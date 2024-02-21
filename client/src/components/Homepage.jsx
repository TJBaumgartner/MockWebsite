import { useState, useEffect } from 'react'
import {useNavigate } from 'react-router-dom'
import '../App.css'
import 'font-awesome/css/font-awesome.min.css';
import moment from "moment";    


function HomePage() {
    
    const navigate = useNavigate()
    const id = localStorage.getItem('userID')

    const [posts, setPosts] = useState()
    const [likes, setLikes] = useState([])
    const [likesLoaded, setLikesLoaded] = useState(false)
    useEffect(() => {
        async function fetchData(){
            try{
                const data = await loadPosts()
                setPosts(data)
                fetchLikes(data)
                setLikesLoaded(true)
            } catch (e) {
                console.error(e)
            }
        }
        fetchData()
    }, [])
    const fetchLikes = () => {
        const data = {id}
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
    const likePost = (event, post) =>{
        // event.target.style.color = "red"
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
    }
    const unlikePost = (event, post) =>{
        // event.target.style.color = "red"
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
    }
    return (
        <div className='homepageContainer'>
            <h1>Made it to the homepage</h1>     
            {posts && likesLoaded &&
                posts.map((post) => (
                    (likes.includes(post._id)) 
                    ? 
                    <div className='postContainer' key={post._id}>
                        <div className='postTop'>
                            <h1>{post.user[0].username}</h1> 
                            {moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')}      
                        </div>
                        <p>{post.message}</p>
                        <div className='postBottom'>
                            <span onClick={(e) => unlikePost(e, post._id)} className='likedPost'>{post.likes}<i className="fa fa-heart"></i></span>
                            <i className="fa fa-comment"></i>
                        </div>
                    </div>  
                    :
                    <div className='postContainer' key={post._id}>
                        <div className='postTop'>
                            <h1>{post.user[0].username}</h1> 
                            {moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')}      
                        </div>
                        <p>{post.message}</p>
                        <div className='postBottom'>
                            <span onClick={(e) => likePost(e, post._id)}>{post.likes}<i className="fa fa-heart"></i></span>
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
