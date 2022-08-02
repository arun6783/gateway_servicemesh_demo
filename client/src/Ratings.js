import React from 'react'
import axios from 'axios'
import urls from './Urls'
function Ratings({ postId, commentId, rating, notifyParent }) {
  const likeComment = async () => {
    try {
      let url = `${urls.RatingsServiceBase}/ratings`
      console.log('likeurl-', url)
      await axios.post(url, { id: commentId, like: true })

      notifyParent(true)
    } catch (e) {
      console.log(
        `error occured   when liking comment for commentId id=${commentId}. error = ${e}`
      )
    }
  }

  const unlikeComment = async () => {
    try {
      let url = `${urls.RatingsServiceBase}/ratings`
      console.log('likeurl-', url)
      await axios.post(url, { id: commentId, like: false })
      notifyParent(true)
    } catch (e) {
      console.log(
        `error occured  when liking comment for commentId id=${commentId}. error = ${e}`
      )
    }
  }
  return (
    <div>
      <span className="col-sm pl-0">name</span>
      <span>
        <span className="col-sm pl-0">
          <a
            onClick={(e) => {
              e.preventDefault()
              likeComment()
            }}
          >
            <i className="fa-solid fa-thumbs-up"></i>
          </a>
          <span className="ml-1">{rating.like}</span>
        </span>
        <span className="col-sm pl-0">
          <a
            onClick={(e) => {
              e.preventDefault()
              unlikeComment()
            }}
          >
            <i className="fa-solid fa-thumbs-down"></i>
          </a>
          <span className="ml-1">{rating.dislike}</span>
        </span>
      </span>
    </div>
  )
}

export default Ratings
