let commentsServiceHost = process.env.COMMENTS_SRV_HOST || 'localhost'
let postsServiceHost = process.env.POSTS_SRV_HOST || 'localhost'
let queryServiceHost = process.env.QUERY_SRV_HOST || 'localhost'
let ratingsServiceHost = process.env.RATINGS_SRV_HOST || 'localhost'

export default {
  CommentsServiceBase: `http://${commentsServiceHost}:4001`,
  PostsServiceBase: `http://${postsServiceHost}:4100`,
  QueryServiceBase: `http://${queryServiceHost}:4002`,
  RatingsServiceBase: `http://${ratingsServiceHost}:4004`,
}
