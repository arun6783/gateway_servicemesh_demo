let commentsServiceHost = process.env.COMMENTS_SRV_HOST || 'localhost'
let postsServiceHost = process.env.POSTS_SRV_HOST || 'localhost'
let ratingsServiceHost = process.env.RATINGS_SRV_HOST || 'localhost'

exports.Urls = {
  CommentsServiceBase: `http://${commentsServiceHost}:4001`,
  PostsServiceBase: `http://${postsServiceHost}:4100`,
  RatingsServiceBase: `http://${ratingsServiceHost}:4004`,
}
