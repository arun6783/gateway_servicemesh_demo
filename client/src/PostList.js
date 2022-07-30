import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CommentCreate from './CommentCreate'
import CommentList from './CommentList'
const PostList = ({ postCreated }) => {
  const [posts, setPosts] = useState({})
  const [commentCreated, setCommentCreated] = useState(false)
  const fetchPosts = async () => {
    let queryServiceHost = process.env.QUERY_SRV_HOST || 'localhost'

    const res = await axios.get(`http://${queryServiceHost}:4002/posts`)

    setPosts(res.data)
  }

  useEffect(() => {
    fetchPosts()
  }, [postCreated, commentCreated])

  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        className="card"
        style={{ width: '30%', marginBottom: '20px', maxHeight: '400px' }}
        key={post.id}
      >
        <div className="card-body">
          <div style={{ display: 'flex' }}>
            <h3>{post.title}</h3>
            <span style={{ marginLeft: 'auto', marginTop: '5px' }}>
              Post by Arun
            </span>
          </div>
          <CommentList
            postId={post.id}
            notifyParent={() => {
              setCommentCreated(!commentCreated)
            }}
            comments={post.comments}
          />
          <CommentCreate
            postId={post.id}
            notifyParent={() => {
              setCommentCreated(!commentCreated)
            }}
          />
        </div>
      </div>
    )
  })

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  )
}

export default PostList
