const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const { natsWrapper } = require('./events/nats-wrapper')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex')
  const { content } = req.body

  const comments = commentsByPostId[req.params.id] || []

  comments.push({ id: commentId, content, status: 'approved' })

  commentsByPostId[req.params.id] = comments

  try {
    await natsWrapper.publish('CommentCreated', {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'approved',
    })
  } catch (err) {
    console.log(
      'CommentsService - error occured when trying to post data to nats',
      err
    )
  }

  res.status(201).send(comments)
})

app.delete('/posts/:postId/comments/:id', async (req, res) => {
  const { id, postId } = req.params

  let comments = commentsByPostId[postId]

  console.log('delete route called', commentsByPostId)

  if (!comments) {
    return res.status(400).send({
      error: `Cannot find comments for the given postid=${postId}, commentid=${id}`,
    })
  }

  let itemIndex = comments.findIndex((x) => x.id == id)
  if (itemIndex != -1) {
    console.log('going to remove comment at index ', id)
    commentsByPostId[postId].splice(itemIndex, 1)

    try {
      await natsWrapper.publish('CommentDeleted', {
        id: id,
        postId: postId,
      })
      console.log('commentdeletedpublished')
    } catch (err) {
      console.log(
        'CommentsService - error occured when trying to post data to nats',
        err
      )
    }
  }

  console.log('afterremoving comments', commentsByPostId[postId])
  return res.send({ status: 'OK' })
})

const start = async () => {
  try {
    let clusterId = process.env.NATS_CLUSTER_ID || 'servicemeshdemo'
    let natsUrl = process.env.NATS_URL || 'http://localhost:4222'
    let clientId =
      process.env.NATS_CLIENT_ID || 'gateway-servicemesh-postsclient'

    await natsWrapper.connect(clusterId, clientId, natsUrl)

    app.listen(4001, () => {
      console.log('Listening on 4001')
    })
  } catch (err) {
    console.log('Commentsservice - error occured when connecting to nats', err)
  }
}

start()
