import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

function Discover() {

    const id = localStorage.getItem('userID')
    const name = localStorage.getItem('name')
    const [users, setUsers] = useState()
    const [followSent, setFollowSent] = useState(false)

    useEffect(() => {
        console.log('hi')
        setInterval(() => {
            loadUsers()
        }, 100)
        clearInterval()
    }, [followSent])

    const loadUsers = () => {
        const data = {id}
        fetch(`http://localhost:5000/api/user/discover`, {   
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
        .then((data) => {
            setUsers(data)
        }) 
    }

    const follow = (user) => {
        const data = {id, user}
        fetch('http://localhost:5000/api/user/follow', {
            method: 'POST',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        .then((response) => {
            setFollowSent(true)
            return response.json()
        })
    }
    
    return (
        <div className='userListContainer'>
            <div className='followTabs'>
            <Link to={'/discover'}>
                <p>Discover</p>
            </Link>
            <Link to={'/followers'}>
                <p>Followers</p>
            </Link>
            <Link to={'/following'}>
                <p>Following</p>
            </Link>
            </div>
            {users &&
                users.map((user) => (
                    (user.username == name || user.followers.includes(id)) ?
                    null
                    :
                        <div className='userFollow'>
                        <div className='userInfo'>
                            <span key={user._id}>{user.username}</span>
                            <p>{user.bio}</p>
                        </div>
                        <button onClick={() => follow(user._id)} >Follow</button>
                    </div>
                ))
            }
        </div>
    )
}

export default Discover
