const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
require('hpropagate')()

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex')
  const { title } = req.body
  if (!title || title.length === 0) {
    return res.status(400).send({ error: 'title is required' })
  }

  console.log('title', title)
  let newPost = {
    id,
    title,
  }
  posts[id] = newPost

  res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
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
