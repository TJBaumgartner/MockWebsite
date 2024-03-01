import {useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
import '../App.css'
import { Link } from 'react-router-dom';

function UserTabs() {
    const id = localStorage.getItem('userID')
    return (
    <div className='userTabs'>
        <Link to={`/${id}/posts`}>
            <p>Posts</p>
        </Link>
        <Link to={`/${id}/replies`}>
            <p>Replies</p>
        </Link>
        <Link to={`/${id}/likes`}>
            <p>Likes</p>
        </Link>
    </div>
  )
}

export default UserTabs
