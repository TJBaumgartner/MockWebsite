import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import moment from 'moment'
import EditProfile from './EditProfile'
import UserTabs from './UserTabs'

function Posts() {

    const id = localStorage.getItem('userID')

    const [posts, setPosts] = useState()
    useEffect(() => {
        const data = {id}
        fetch(`http://localhost:5000/api/user/${id}/posts`, {   
            method: 'POST',     
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            setPosts(data)
        })
    }, [])
    return (
        <div className='userListContainer'>
            <EditProfile/>
            <UserTabs currentTab={'posts'}/>
            {posts &&
                posts.map((post) => (
                    <div className='postContainer' key={post._id}>
                        <div className='postTop'>
                            <h1>{post.user[0].username}</h1> 
                            {moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')}      
                        </div>
                        <p>{post.message}</p>
                        <div className='postBottom'>
                            <span >{post.likes}<i className="fa fa-heart"></i></span>                            
                            <i className="fa fa-comment"></i>
                        </div>
                    </div>  
                ))
            }
        </div>
    )
}

export default Posts
