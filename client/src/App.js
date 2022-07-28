import React, { useState } from 'react'
import PostCreate from './PostCreate'
import PostList from './PostList'

const App = () => {
  const [postCreated, setPostCreated] = useState(false)
  return (
    <div className="container">
      <h1>Create Post</h1>
      <PostCreate
        notifyParent={() => {
          setPostCreated(true)
        }}
      />
      <hr />
      <h1>Posts</h1>
      <PostList postCreated={postCreated} />
    </div>
  )
}
export default App
