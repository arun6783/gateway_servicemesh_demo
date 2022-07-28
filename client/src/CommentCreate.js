import React, { useState } from 'react'
import axios from 'axios'

const CommentCreate = ({ postId, notifyParent }) => {
  const [content, setContent] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    let commentsServiceHost = process.env.COMMENTS_SRV_HOST || 'localhost'
    try {
      await axios.post(
        `http://${commentsServiceHost}:4001/posts/${postId}/comments`,
        {
          content,
        }
      )
      notifyParent(true)
      setContent('')
    } catch (e) {
      console.log(
        `error occured when creating comment for post id=${postId}. error = ${e}`
      )
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default CommentCreate
