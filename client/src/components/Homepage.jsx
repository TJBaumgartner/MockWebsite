import { useState, useEffect } from 'react'
import {useNavigate } from 'react-router-dom'
import '../App.css'
import Navbar from './Navbar'
function HomePage(props) {
    const navigate = useNavigate()

    const [displayForm, setDisplayForm] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetch('http://localhost:5000/api/homepage', {        
            headers: {
                'Content-Type': 'text/plain',
                Authorization: 'Bearer ' + localStorage.getItem('access')
            }
        })
        .then((response) => {
            if(response.status === 401){
                console.log(localStorage)
                navigate('/login');
            }
            return response.json()
        })
    }, [])
    const displayPostForm = () => {
        setDisplayForm(true)
    }
    const createPost = (e) => {
        e.preventDefault()
        console.log(message)
        setDisplayForm(false)
        setMessage('')
    }
    return (
        <div className='homepageContainer'>
            <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn} logout={props.logout}/>
            <h1>Made it to the homepage</h1>
            <button onClick={() => displayPostForm()}>Post</button>
            {displayForm == true &&
                <form action="" method="POST" onSubmit={createPost}>
                    <input 
                    name="message" 
                    id="message" 
                    type="text"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    />
                <button type="submit">Post</button>
            </form>   
            }
        </div>
    )
}

export default HomePage
