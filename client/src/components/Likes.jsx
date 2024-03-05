import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import moment from 'moment'
import EditProfile from './EditProfile'
import UserTabs from './UserTabs'
import { useNavigate } from 'react-router-dom'
function Likes() {
    const navigate = useNavigate();
    const id = localStorage.getItem('userID')

    const [posts, setPosts] = useState()
    const [likes, setLikes] = useState([])

    useEffect(() => {
        const data = {id}
        fetch(`http://localhost:5000/api/user/${id}/likes`, {   
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
            setLikes(data[0].likes)
            setPosts(data[0].likes)
        })
    }, [])

    const likePost = (post, isLiked) =>{
        const user = id
        const data = {post, user}
        fetch(`http://localhost:5000/api/homepage/posts/${post}/like`, {   
            method: 'POST',     
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json()
        })
        return setLikes([...likes, isLiked])
    }
    const unlikePost = (post, isLiked) =>{
        const user = id
        const data = {post, user}
        fetch(`http://localhost:5000/api/homepage/posts/${post}/unlike`, {   
            method: 'POST',     
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json()
        })
        setLikes(likes.filter(function(likes){
            return likes !== isLiked
        }))
    }
    const postDetail = (e, postId) => {
        if(e.target !== e.currentTarget) return
        navigate(`/post/${postId}/detail`)
    }
    return (
        <div className='userListContainer'>
            <EditProfile/>
            <UserTabs  currentTab={'likes'}/>
            {posts &&
                posts.map((post) => (
                    <div className='postContainer' key={post._id} onClick={(e) => postDetail(e, post._id)}>
                        <div className='postTop' onClick={(e) => postDetail(e, post._id)}>
                            <h1>{post.user[0].username}</h1> 
                            {moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')}      
                        </div>
                        <p>{post.message}</p>
                        <div className='postBottom' onClick={(e) => postDetail(e, post._id)}>
                            {likes.includes(post) &&
                                <span onClick={() => unlikePost(post._id, post)} className='likedPost'><i className="fa fa-heart"></i>{post.likes}</span>                            
                            }
                            {!likes.includes(post) &&
                                <span onClick={() => likePost(post._id, post)} className='unlikedPost'><i className="fa fa-heart"></i>{post.likes - 1}</span>                            
                            }
                            <i className="fa fa-comment"></i>
                        </div>
                    </div>  
                ))
            }
        </div>
    )
}

export default Likes
