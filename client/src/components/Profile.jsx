import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

function Profile() {

  return (
    <div className='userListContainer'>
      <div className='userTabs'>
          <Link to={'/userPosts'}>
              <p>Posts</p>
          </Link>
          <Link to={'/userReplies'}>
              <p>Replies</p>
          </Link>
          <Link to={'/userLikes'}>
              <p>Likes</p>
          </Link>
      </div>
    </div>
  )
}

export default Profile
