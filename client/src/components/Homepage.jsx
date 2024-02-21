import { useState, useEffect } from 'react'
import {useNavigate } from 'react-router-dom'
import '../App.css'
import 'font-awesome/css/font-awesome.min.css';
import moment from "moment";    


function HomePage() {
    
    const navigate = useNavigate()
    const id = localStorage.getItem('userID')

    const [posts, setPosts] = useState()


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

    // useEffect(() => {
    //     const data = {id}
    //     fetch(`http://localhost:5000/api/homepage/posts`, {   
    //         method: 'POST',     
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(data)
    //     })
    //     .then((response) => {
    //         return response.json()
    //     })
    //     .then((data) => {
    //         setPosts(data)
    //     }) 
    // }, [])

    useEffect(() => {
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
    }, [])


    // const fakeUser = () => {
    //     fetch('http://localhost:5000/api/createFake', {
    //         method: 'POST',
    //         headers: {"Content-Type": "application/json"},
    //     })
    //     .then(() => {
    //         console.log('Post Created')
    //     })
    // }
    const fakePost = () => {
        fetch('http://localhost:5000/api/createFakePost', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
        })
        .then(() => {
            console.log('Post Created')
        })
    }

    return (
        <div className='homepageContainer'>
            <h1>Made it to the homepage</h1>     
            {posts &&
                posts.map((post) => (
                    <div className='postContainer' key={post._id}>
                        <div className='postTop'>
                            <h1>{post.user[0].username}</h1> 
                            {moment(post.createdAt, 'YYYY-MM-DD hh:mm:ss').format('MM/DD/YYYY')}      
                        </div>
                        <p>{post.message}</p>
                        <div className='postBottom'>
                            <p>{post.likes}<i className="fa fa-heart"></i></p>
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
