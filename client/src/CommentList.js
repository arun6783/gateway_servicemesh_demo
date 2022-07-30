import React from 'react'

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content = comment.content

    return (
      <li className="list-group-item" key={comment.id}>
        <div style={{ display: 'flex' }}>
          {content}
          <span style={{ marginLeft: 'auto' }}>
            <i className="fa-solid fa-circle-minus"></i>
          </span>
        </div>

        <div>
          <span className="col-sm">name</span>
          <span>
            <span className="col-sm">
              <i className="fa-solid fa-thumbs-up"></i>
              <span className="ml-1">433</span>
            </span>
            <span className="col-sm">
              <i className="fa-solid fa-thumbs-down"></i>
              <span className="ml-1">11</span>
            </span>
          </span>
        </div>
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
