const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')
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

// app.post('/events', async (req, res) => {
//   console.log('commentsservie-events')
//   console.log('Event Received:', req.body.type)

//   const { type, data } = req.body

//   if (type === 'CommentModerated') {
//     const { postId, id, status, content } = data
//     const comments = commentsByPostId[postId]

//     const comment = comments.find((comment) => {
//       return comment.id === id
//     })
//     comment.status = status

//     let eventsServiceHost = process.env.EVENTS_SRV_HOST || 'localhost'

//     await axios.post(`http://${eventsServiceHost}:4005/events`, {
//       type: 'CommentUpdated',
//       data: {
//         id,
//         status,
//         postId,
//         content,
//       },
//     })
//   }

//   res.send({})
// })

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
    console.log('Comments service - error occured when connecting to nats', err)
  }
}

start()
