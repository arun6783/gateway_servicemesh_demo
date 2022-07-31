const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
require('hpropagate')()

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
  }

  console.log('afterremoving comments', commentsByPostId[postId])
  return res.send({ status: 'OK' })
})

const start = async () => {
  try {
    app.listen(4001, () => {
      console.log('Listening on 4001')
    })
  } catch (err) {
    console.log('Commentsservice - error occured when connecting to nats', err)
  }
}

start()
