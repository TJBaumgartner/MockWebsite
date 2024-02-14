import { useState, useEffect } from 'react'
import {useNavigate } from 'react-router-dom'
import '../App.css'
import Navbar from './Navbar'
function HomePage() {

    const id = localStorage.getItem('userID')
    const [posts, setPosts] = useState()
    const navigate = useNavigate()
    useEffect(() => {
        fetch('http://localhost:5000/api/homepage', {        
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access')
            }
        })
        .then((response) => {
            if(response.status === 401){
                console.log(localStorage)
                navigate('/login');
            }
            console.log(localStorage)
            return response.json()
        })
    }, [])

    useEffect(() => {
        const data = {id}
        fetch(`http://localhost:5000/api/homepage/posts`, {   
            method: 'POST',     
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            setPosts(data)
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
    // const fakePost = () => {
    //     fetch('http://localhost:5000/api/createFakePost', {
    //         method: 'POST',
    //         headers: {"Content-Type": "application/json"},
    //     })
    //     .then(() => {
    //         console.log('Post Created')
    //     })
    // }

    return (
        <div className='homepageContainer'>
            <h1>Made it to the homepage</h1>
            {posts &&
                <button onClick={() => console.log(posts)}>Click me</button>
            }
            {/* <button onClick={() => fakeUser()}>Create Random User</button>
            <button onClick={() => fakePost()}>Create Random Post</button> */}
        </div>
    )
}

export default HomePage
