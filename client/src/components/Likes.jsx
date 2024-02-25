import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

function Likes() {
    const id = localStorage.getItem('userID')

    return (
        <div className='userListContainer'>
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
        </div>
    )
}

export default Likes
