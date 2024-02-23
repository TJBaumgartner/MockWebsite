import { useState, useEffect } from 'react'
import {useNavigate } from 'react-router-dom'
import '../App.css'
import 'font-awesome/css/font-awesome.min.css';
import moment from "moment";    


function HomePage() {
    


/*
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
LIKE/UNLIKE BUTTON RERENDER
*/




    const navigate = useNavigate()
    const id = localStorage.getItem('userID')

    const [posts, setPosts] = useState()
    const [likes, setLikes] = useState([])
    const [likesLoaded, setLikesLoaded] = useState(false)
    useEffect(() => {
        fetch('http://localhost:5000/api/homepage', {        
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access')
            }
        })
        .then((response) => {
            if(response.status === 401){
                navigate('/login');
            }
            return response.json()
        })
    }, [])

    const loadPosts = () => {
        const data = {id}
        fetch(`http://localhost:5000/api/user/following`, {   
            method: 'POST',     
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access')
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json()
        })
        .then((user) => {
            
            const followData = user.following
            const data = {followData, id}
            fetch(`http://localhost:5000/api/homepage/posts`, {   
                method: 'POST',     
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setPosts(data)
            }) 
        })
    }

    useEffect(() => {
        async function fetchData(){
            try{
                const data = await loadPosts()
                fetchLikes(data)
                setLikesLoaded(true)
            } catch (e) {
                console.error(e)
            }
        }
        fetchData()
    }, [])
    
    const fetchLikes = () => {
        const postData = posts
        const data = {id, postData}
        fetch(`http://localhost:5000/api/user/likes`, {   
            method: 'POST',     
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            setLikes(data[0].likes)
        }) 
    }

    // const fakeUser = () => {
    //     fetch('http://localhost:5000/api/createFake', {
    //         method: 'POST',
    //         headers: {"Content-Type": "application/json"},
    //     })
    //     .then(() => {
    //         console.log('Post Created')
    //     })
    // }
    // const fakePost = () => {
    //     fetch('http://localhost:5000/api/createFakePost', {
    //         method: 'POST',
    //         headers: {"Content-Type": "application/json"},
    //     })
    //     .then(() => {
    //         console.log('Post Created')
    //     })
    // }
    const likePost = (post) =>{
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
        loadPosts()
        return setLikes([...likes, post])
    }
    const unlikePost = (post) =>{
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
        loadPosts()
        setLikes(likes.filter(function(likes){
            return likes !== post
        }))
    }
    return (
        <div className='homepageContainer'>
            <h1>Made it to the homepage</h1>     
            {posts && likesLoaded &&
                posts.map((post) => (
                    <div className='postContainer' key={post._id}>
                        <div className='postTop'>
                            <h1>{post.user[0].username}</h1> 
                            {moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')}      
                        </div>
                        <p>{post.message}</p>
                        <div className='postBottom'>
                            {likes.includes(post._id) &&
                                <span onClick={() => unlikePost(post._id)} className='likedPost'>{post.likes}<i className="fa fa-heart"></i></span>                            
                            }
                            {!likes.includes(post._id) &&
                                <span onClick={() => likePost(post._id)}>{post.likes}<i className="fa fa-heart"></i></span>                            
                            }
                            <i className="fa fa-comment"></i>
                        </div>
                    </div>  
                ))
            }
            {/* <button onClick={() => fakeUser()}>Create Random User</button> */}
            {/* <button onClick={() => fakePost()}>Create Random Post</button> */}
        </div>
    )
}

export default HomePage
