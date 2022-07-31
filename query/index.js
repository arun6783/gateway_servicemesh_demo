const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const { Urls } = require('./Urls')
require('hpropagate')()

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/posts', async (req, res) => {
  //1 get posts
  let posts = {}

  const postRes = await axios.get(`${Urls.PostsServiceBase}/posts`)
  posts = postRes.data
  const promises = []
  Object.values(posts).forEach((post, inde) => {
    //2. get comments for posts
    promises.push(
      axios
        .get(`${Urls.CommentsServiceBase}/posts/${post.id}/comments`)
        .then((commentsRes) => {
          posts[post.id].comments = commentsRes.data
        })
        .catch((err) => {
          console.log('error occured when getting posts for id = ', post.id)
        })
    )
  })

  await Promise.all(promises)
  res.send(posts)
})

const start = async () => {
  app.listen(4002, async () => {
    console.log('Listening on 4002')
  })
}

start()
