const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const { Urls } = require('./Urls')
require('hpropagate')()

const app = express()
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))

app.get('/api/query', async (req, res) => {
  //1 get posts
  let posts = {}
  const ratingsRes = await axios.get(`${Urls.RatingsServiceBase}/api/ratings`)
  const postRes = await axios.get(`${Urls.PostsServiceBase}/api/posts`)
  posts = postRes.data
  const promises = []
  Object.values(posts).forEach((post, inde) => {
    //2. get comments for posts
    promises.push(
      axios
        .get(`${Urls.CommentsServiceBase}/api/post/${post.id}/comments`)
        .then((commentsRes) => {
          let comments =
            commentsRes?.data?.map((x) => {
              //3 get ratings for a comment
              x.ratings = ratingsRes?.data[x.id] || {
                like: 0,
                dislike: 0,
              }
              return x
            }) || []
          posts[post.id].comments = comments
        })
        .catch((err) => {
          console.log(
            `error occured when getting posts for id = ${post.id}`,
            err
          )
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
