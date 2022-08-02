import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CommentCreate from './CommentCreate'
import CommentList from './CommentList'
import urls from './Urls'
const PostList = ({ postCreated }) => {
  const [posts, setPosts] = useState({})
  const [commentCreated, setCommentCreated] = useState(false)

  const fetchPosts = async () => {
    const res = await axios.get(`${urls.QueryServiceBase}/query`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
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
              Post by User
            </span>
          </div>
          {post?.comments ? (
            <>
              <CommentList
                postId={post.id}
                notifyParent={() => {
                  setCommentCreated(!commentCreated)
                }}
                comments={post.comments}
              />
            </>
          ) : null}
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
