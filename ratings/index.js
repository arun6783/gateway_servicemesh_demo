const express = require('express')
const bodyParser = require('body-parser')
require('hpropagate')()
var app = express()
const cors = require('cors')
app.use(cors({ origin: '*' }))

app.use(bodyParser.json())

const ratingsByCommentId = {}

app.get('/api/ratings', (req, res) => {
  console.log('allratings', ratingsByCommentId)
  res.send(ratingsByCommentId)
})

app.post('/api/ratings', (req, res) => {
  const { id, like } = req.body
  console.log('post', id)
  res.send(ratingsByCommentId)

  const ratings = ratingsByCommentId[id] || { like: 0, dislike: 0 }
  if (like) {
    ratings.like++
  } else {
    ratings.dislike++
  }
  ratingsByCommentId[id] = ratings
  res.status(201).send(ratingsByCommentId[id])
})

app.get('*', function (req, res) {
  console.log('404ing')
  res.send({ error: 'route not found' })
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
