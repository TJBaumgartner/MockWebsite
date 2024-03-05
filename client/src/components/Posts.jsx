import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import moment from 'moment'
import EditProfile from './EditProfile'
import UserTabs from './UserTabs'
import { useNavigate } from 'react-router-dom'
function Posts() {
    const navigate = useNavigate()
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
    const postDetail = (e, postId) => {
        if(e.target !== e.currentTarget) return
        navigate(`/post/${postId}/detail`)
    }
    return (
        <div className='userListContainer'>
            <EditProfile/>
            <UserTabs currentTab={'posts'}/>
            {posts &&
                posts.map((post) => (
                    <div className='postContainer' key={post._id} onClick={(e) => postDetail(e, post._id)}>
                        <div className='postTop' onClick={(e) => postDetail(e, post._id)}>
                            <h1>{post.user[0].username}</h1> 
                            {moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')}      
                        </div>
                        <p>{post.message}</p>
                        <div className='postBottom' onClick={(e) => postDetail(e, post._id)}>
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
