import React, { useState } from 'react'
import axios from 'axios'
import urls from './Urls'

const CommentCreate = ({ postId, notifyParent }) => {
  const [content, setContent] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      await axios.post(`${urls.CommentsServiceBase}/post/${postId}/comments`, {
        content,
      })
      notifyParent(true)
      setContent('')
    } catch (e) {
      console.log(
        `error occured when creating comment for post id=${postId}. error = ${e}`
      )
    }
  }

  return (
    <div className="mt-2">
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
