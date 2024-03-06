import { useState, useEffect } from 'react'
import '../App.css'
import 'font-awesome/css/font-awesome.min.css';
import moment from "moment";    
import {useNavigate, useParams } from 'react-router-dom';



function PostDetail() {

    const [likes, setLikes] = useState([])
    const [displayForm, setDisplayForm] = useState(false)
    const [message, setMessage] = useState('')




    const params = useParams();
    const id = params.id
    const [comments, setComments] = useState()
    const [post, setPost] = useState()

    useEffect(() => {
        loadComments()
    }, [displayForm])

    const loadComments = () => {
        fetch(`https://mockwebsite-api.onrender.com/api/post/${id}/comments`, {   
            method: 'GET',     
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access')
            },
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            setPost(data[0])
            setComments(data[0].comment)
        }) 
    }

    // const likePost = (post) =>{
    //     const user = id
    //     const data = {post, user}
    //     fetch(`http://localhost:5000/api/homepage/posts/${post}/like`, {   
    //         method: 'POST',     
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(data)
    //     })
    //     .then((response) => {
    //         return response.json()
    //     })
    //     return setLikes([...likes, post])
    // }
    // const unlikePost = (post) =>{
    //     const user = id
    //     const data = {post, user}
    //     fetch(`http://localhost:5000/api/homepage/posts/${post}/unlike`, {   
    //         method: 'POST',     
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(data)
    //     })
    //     .then((response) => {
    //         return response.json()
    //     })
    //     setLikes(likes.filter(function(likes){
    //         return likes !== post
    //     }))
    // }

    const displayReplyForm = (post) => {
        setDisplayForm(true)
    }
    const createReply = (e) => {
        e.preventDefault();
        const user = localStorage.getItem('userID')
        const currentPostId = post._id;
        const data = {message, user, currentPostId}
        fetch(`https://mockwebsite-api.onrender.com/api/post/${currentPostId}/reply`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log('Post Created')
        })
        loadComments()
        closeReplyForm()
    }
    const closeReplyForm = () => {
        setDisplayForm(false)
        setMessage('')
    }


    return (
    <div  className='postContainer2'>
        {post &&
        <div className='postDetailContainer'>
            <div className='detailPostTop'>
                <h3>{post.user[0].username}</h3> 
                <p>{post.message}</p>
                <p>{moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')} </p>     
            </div>
            <div className='postBottom'>
                {/* {likes.includes(post._id) &&
                    <span onClick={() => unlikePost(post._id)} className='likedPost'><i className="fa fa-heart"></i>{post.likes}</span>                            
                }
                {!likes.includes(post._id) &&
                    <span onClick={() => likePost(post._id)} className='unlikedPost'><i className="fa fa-heart"></i>{post.likes}</span>                            
                } */}
                <span><i className="fa fa-heart"></i>{post.likes}</span>                            
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
        }
        <div>
            <form className="replyForm" action="" method="POST" onSubmit={(e) => createReply(e)}>
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
                    <button type='button' className='replyDisabledButton'>Reply</button>
                }
            </form>  
        </div>
        {comments &&
            comments.map((comment) => (    
                <div className='commentContainer'>
                    <div>
                        <h3>{comment.user[0].username}</h3>
                        {moment(comment.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')}      
                    </div>
                    <p>{comment.message}</p>
                </div>
            ))
        }
    </div>
  )
}

export default PostDetail
