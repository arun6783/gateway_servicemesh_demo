import React from 'react'
import axios from 'axios'
import Ratings from './Ratings'
const CommentList = ({ postId, comments, notifyParent }) => {
  const removeComment = async (commentId) => {
    let commentsServiceHost = process.env.COMMENTS_SRV_HOST || 'localhost'
    try {
      await axios.delete(
        `http://${commentsServiceHost}:4001/posts/${postId}/comments/${commentId}`
      )
      notifyParent(true)
    } catch (e) {
      console.log(
        `error occured when deleting comment for post id=${postId}. error = ${e}`
      )
    }
  }

  const renderedComments = comments.map((comment) => {
    let content = comment.content

    return (
      <li className="list-group-item" key={comment.id}>
        <div style={{ display: 'flex' }}>
          {content}
          <span style={{ marginLeft: 'auto' }}>
            <a
              onClick={(e) => {
                e.preventDefault()
                removeComment(comment.id)
              }}
            >
              <i className="fa-solid fa-circle-minus"></i>
            </a>
          </span>
        </div>
        {comment.ratings ? (
          <Ratings
            commentId={comment.id}
            rating={comment.ratings}
            notifyParent={notifyParent}
            postId={postId}
          />
        ) : null}
      </li>
    )
  })

  return (
    <ul
      className="list-group list-group-flush overflow-auto"
      style={{ maxHeight: '200px', borderBottom: '10px' }}
    >
      {renderedComments}
    </ul>
  )
}

export default CommentList
