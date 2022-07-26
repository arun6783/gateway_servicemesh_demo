const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

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
  posts[id] = {
    id,
    title,
  }

  let eventsServiceHost = process.env.EVENTS_SRV_HOST || 'localhost'

  await axios.post(`http://${eventsServiceHost}:4005/events`, {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  })

  res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type)

  res.send({})
})

app.listen(4100, () => {
  console.log('Listening on 4100')
})
