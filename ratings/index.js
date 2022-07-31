const express = require('express')
const bodyParser = require('body-parser')
const { natsWrapper } = require('./events/nats-wrapper')

var app = express()
const cors = require('cors')
console.log('using cors')
app.use(
  cors({
    origin: '*',
  })
)

app.use(bodyParser.json())

const ratingsByCommentId = {}

app.get('/posts/:postId/comments/:id/ratings', (req, res) => {
  res.send(ratingsByCommentId[req.params.id]?.count || 0)
})

app.post('/posts/:postId/comments/:id/like', async (req, res) => {
  const ratings = ratingsByCommentId[req.params.id] || { like: 0, dislike: 0 }

  ratings.like++
  ratingsByCommentId[req.params.id] = ratings

  try {
    await natsWrapper.publish('CommentLiked', {
      commentId: req.params.id,
      postId: req.params.postId,
    })
  } catch (err) {
    console.log(
      'ratingsService -error occured when trying to post likes data to nats',
      err
    )
  }

  res.status(201).send(ratingsByCommentId[req.params.id])
})

app.delete('/posts/:postId/comments/:id/unlike', async (req, res) => {
  const ratings = ratingsByCommentId[req.params.id] || { like: 0, dislike: 0 }

  ratings.dislike++
  ratingsByCommentId[req.params.id] = ratings

  try {
    await natsWrapper.publish('CommentUnLiked', {
      commentId: req.params.id,
      postId: req.params.postId,
    })
  } catch (err) {
    console.log(
      'ratingsService - error occured when trying to post unlike data to nats',
      err
    )
  }

  res.status(200).send(ratings)
})

const start = async () => {
  try {
    let clusterId = process.env.NATS_CLUSTER_ID || 'servicemeshdemo'
    let natsUrl = process.env.NATS_URL || 'http://localhost:4222'
    let clientId =
      process.env.NATS_CLIENT_ID || 'gateway-servicemesh-postsclient'

    await natsWrapper.connect(clusterId, clientId, natsUrl)

    app.listen(4004, () => {
      console.log('Listening on 4004')
    })
  } catch (err) {
    console.log('ratingsservice - error occured when connecting to nats', err)
  }
}

start()
