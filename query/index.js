const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { natsWrapper } = require('./events/nats-wrapper')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}
const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data

    posts[id] = { id, title, comments: [] }
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data
    const post = posts[postId]
    post.comments.push({
      id,
      content,
      status,
      ratings: { like: 0, dislike: 0 },
    })
  }

  if (type === 'CommentDeleted') {
    console.log('commentdeleteddata', data)
    const { id, postId } = data
    const commentsByPostId = posts[postId].comments
    posts[postId].comments = commentsByPostId.filter((x) => x.id !== id)
  }

  if (type === 'CommentLiked') {
    const { commentId, postId } = data

    let comments = posts[postId].comments

    let comment = comments.find((c) => c.id === commentId)

    if (comment) {
      comment.ratings.like++
      posts[postId].comments = comments
    }
  }

  if (type === 'CommentUnLiked') {
    const { commentId, postId } = data

    let comments = posts[postId].comments

    let comment = comments.find((c) => c.id === commentId)

    if (comment) {
      comment.ratings.dislike++
      posts[postId].comments = comments
    }
  }
}

app.get('/posts/:id', (req, res) => {
  res.send(posts[req.params.id])
})

app.get('/posts', (req, res) => {
  console.log('posts=', JSON.stringify(posts))
  res.send(posts)
})

const start = async () => {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID || 'servicemeshdemo',
      process.env.NATS_CLIENT_ID || 'gateway-servicemesh-queryclient',
      process.env.NATS_URL || 'http://localhost:4222'
    )
  } catch (err) {
    console.log('QueryService - error occured when connecting to nats', err)
  }

  app.listen(4002, async () => {
    console.log('Listening on 4002')
    try {
      natsWrapper.listen('PostCreated', 'Query-Service', handleEvent)
      natsWrapper.listen('CommentCreated', 'Query-Service', handleEvent)
      natsWrapper.listen('CommentDeleted', 'Query-Service', handleEvent)
      natsWrapper.listen('CommentLiked', 'Query-Service', handleEvent)
      natsWrapper.listen('CommentUnLiked', 'Query-Service', handleEvent)
    } catch (error) {
      console.log(error.message)
    }
  })
}

start()
