const express = require('express')
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto')
const cors = require('cors')
const { natsWrapper } = require('./events/nats-wrapper')

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

  try {
    await natsWrapper.publish('PostCreated', newPost)
  } catch (err) {
    console.log(
      'PostsService - error occured when trying to post data to nats',
      err
    )
  }
  res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type)

  res.send({})
})

const start = async () => {
  try {
    let clusterId = process.env.NATS_CLUSTER_ID || 'servicemeshdemo'
    let natsUrl = process.env.NATS_URL || 'http://localhost:4222'
    let clientId =
      process.env.NATS_CLIENT_ID || 'gateway-servicemesh-postsclient'

    await natsWrapper.connect(clusterId, clientId, natsUrl)
    app.listen(4100, () => {
      console.log('Postsservice- Listening on 4100')
    })
  } catch (err) {
    console.log('Post service - error occured when connecting to nats', err)
  }
}

start()
