import { useState, useEffect } from 'react'
import '../App.css'
import 'font-awesome/css/font-awesome.min.css';
import moment from "moment";    
import {useNavigate } from 'react-router-dom';


function HomePage() {
    
    const navigate = useNavigate()
    const id = localStorage.getItem('userID')

    const [posts, setPosts] = useState()
    const [likes, setLikes] = useState([])
    const [likesLoaded, setLikesLoaded] = useState(false)
    const [displayForm, setDisplayForm] = useState(false)
    const [message, setMessage] = useState('')
    const [currentPostId, setCurrentPostId] = useState('')


    useEffect(() => {
        fetch('https://mockwebsite-api.onrender.com/api/homepage', {        
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
        fetch(`https://mockwebsite-api.onrender.com/api/user/following`, {   
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
            fetch(`https://mockwebsite-api.onrender.com/api/homepage/posts`, {   
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
        fetch(`https://mockwebsite-api.onrender.com/api/user/getLikes`, {   
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
    const likePost = (post) =>{
        const user = id
        const data = {post, user}
        fetch(`https://mockwebsite-api.onrender.com/api/homepage/posts/${post}/like`, {   
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
        fetch(`https://mockwebsite-api.onrender.com/api/homepage/posts/${post}/unlike`, {   
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

    const displayReplyForm = (post) => {
        setCurrentPostId(post)
        setDisplayForm(true)
    }
    const createReply = (e) => {
        e.preventDefault();
        const user = localStorage.getItem('userID')
        const data = {message, user, currentPostId}
        fetch(`https://mockwebsite-api.onrender.com/api/post/${currentPostId}/reply`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log('Post Created')
        })
        closeReplyForm()
    }
    const closeReplyForm = () => {
        setDisplayForm(false)
        setMessage('')
    }

    const postDetail = (e, postId) => {
        if(e.target !== e.currentTarget) return
        navigate(`/post/${postId}/detail`)
    }

    return (
        <div className='homepageContainer'>
            <h1 className='homepageHeader'>Your Timeline</h1>
            {posts && likesLoaded &&
                posts.map((post) => (
                    <div className='postContainer' key={post._id} onClick={(e) => postDetail(e, post._id)}>
                        <div className='postTop' onClick={(e) => postDetail(e, post._id)}>
                            <h1>{post.user[0].username}</h1> 
                            {moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')}      
                        </div>
                        <p>{post.message}</p>
                        <div className='postBottom' onClick={(e) => postDetail(e, post._id)}>
                            {likes.includes(post._id) &&
                                <span onClick={() => unlikePost(post._id)} className='likedPost'><i className="fa fa-heart"></i>{post.likes}</span>                            
                            }
                            {!likes.includes(post._id) &&
                                <span onClick={() => likePost(post._id)} className='unlikedPost'><i className="fa fa-heart"></i>{post.likes}</span>                            
                            }
                        <div>
                            <i className="fa fa-comment" onClick={() => displayReplyForm(post._id)}>{post.comment.length}</i>
                            {displayForm == true &&
                            <div>
                                <div className='postFormBackground' onClick={() => closeReplyForm()}></div>
                                <div className='postFormContainer'>
                                    <span onClick={() => closeReplyForm()}>X</span>
                                    <form className="postForm" action="" method="POST" onSubmit={(e) => createReply(e)}>
                                        <textarea 
                                        name="message" 
                                        id="message" 
                                        type="text"
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder='Post your reply'
                                        />
                                        <div className='bottomBorder'></div>
                                        {message !== '' &&
                                            <button type="submit">Reply</button>
                                        }
                                        {message == '' &&
                                            <button type='button' className='disabledButton'>Reply</button>
                                        }
                                    </form>  
                                </div> 
                            </div>
                            }
                        </div>
                    </div>  
                </div>
                ))
            }
        </div>
    )
}

export default HomePage



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

                {/* <button onClick={() => fakeUser()}>Create Random User</button> */}
            {/* <button onClick={() => fakePost()}>Create Random Post</button> */}