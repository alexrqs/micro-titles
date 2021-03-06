import React, { useState } from 'react';
import axios from 'axios';

export default ({ postId }) => {
  const [content, setContent] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()

    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      content,
    })

    setContent('')
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor=""> new Comment§</label>
          <input type="text" className="form-control" onChange={e=> setContent(e.target.value)}/>
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}
