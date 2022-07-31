const express = require('express')
const bodyParser = require('body-parser')
require('hpropagate')()

var app = express()
const cors = require('cors')
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

  res.status(201).send(ratingsByCommentId[req.params.id])
})

app.delete('/posts/:postId/comments/:id/unlike', async (req, res) => {
  const ratings = ratingsByCommentId[req.params.id] || { like: 0, dislike: 0 }

  ratings.dislike++
  ratingsByCommentId[req.params.id] = ratings

  res.status(200).send(ratings)
})

const start = async () => {
  try {
    app.listen(4004, () => {
      console.log('Listening on 4004')
    })
  } catch (err) {
    console.log('ratingsservice - error occured when connecting to nats', err)
  }
}

start()
