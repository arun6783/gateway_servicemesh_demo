import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CommentCreate from './CommentCreate'
import CommentList from './CommentList'
import urls from './Urls'
const PostList = ({ postCreated }) => {
  const [posts, setPosts] = useState({})
  const [commentCreated, setCommentCreated] = useState(false)

  let timer

  const [runningTime, setRunningTime] = useState(0)

  const stopCountDown = () => {
    clearInterval(timer)
  }

  const startCountDown = () => {
    const startTime = Date.now() - 0
    timer = setInterval(() => {
      setRunningTime(Date.now() - startTime)
    })
  }

  const fetchPosts = async () => {
    startCountDown()
    try {
      const res = await axios.get(`${urls.QueryServiceBase}/query`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
      setPosts(res.data)
    } catch (err) {}
    stopCountDown()
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
            {post.name ? (
              <span style={{ marginLeft: 'auto', marginTop: '5px' }}>
                {post.name}
              </span>
            ) : null}
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
          ) : (
            <p>No Comments present!!</p>
          )}
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
    <>
      <div className="row align-items-start">
        <div className="col">
          <h1>Posts</h1>
        </div>
        <div className="col">
          <p className="text-right">{runningTime} ms</p>
        </div>
      </div>
      <div className="d-flex flex-row flex-wrap justify-content-between">
        {renderedPosts}
      </div>
    </>
  )
}

export default PostList
