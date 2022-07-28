import React, { useState } from 'react'
import axios from 'axios'
const PostCreate = ({ notifyParent }) => {
  const [title, setTitle] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    let postsServiceHost = process.env.POSTS_SRV_HOST || 'localhost'

    await axios.post(`http://${postsServiceHost}:4100/posts`, {
      title,
    })
    notifyParent()
    setTitle('')
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default PostCreate
