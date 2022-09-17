const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const { randomName } = require('./randomName')
require('hpropagate')()

const app = express()
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))

const posts = {}

app.get('/api/posts', (req, res) => {
  Object.values(posts).map((p) => {
    p.name = randomName()
  })
  res.send(posts)
})

app.post('/api/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex')
  const { title } = req.body
  if (!title || title.length === 0) {
    return res.status(400).send({ error: 'title is required' })
  }

  let newPost = {
    id,
    title,
  }
  posts[id] = newPost

  res.status(201).send(posts[id])
})

app.post('/api/events', (req, res) => {
  console.log('Received Event', req.body.type)

  res.send({})
})

const start = async () => {
  try {
    app.listen(4100, () => {
      console.log('Postsservice- Listening on 4100')
    })
  } catch (err) {
    console.log('Post service - error occured when connecting to nats', err)
  }
}

start()
