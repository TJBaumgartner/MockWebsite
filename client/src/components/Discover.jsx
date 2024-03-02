import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import ExploreTabs from './ExploreTabs'
function Discover() {

    const id = localStorage.getItem('userID')
    const name = localStorage.getItem('name')
    const [users, setUsers] = useState()
    // const [followSent, setFollowSent] = useState(false)
    const [following, setFollowing] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

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
            return response.json()
        })
        setFollowing([...following, user])
    }
    
    const unfollow = (user) => {

        const data = {id, user}
        fetch('http://localhost:5000/api/user/unfollow', {
            method: 'POST',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json()
        })
        setFollowing(following.filter(function(following){
            return following !== user
        }))
    }

    return (
        <div className='followListContainer'>
            <ExploreTabs currentTab={'discover'}/>
            {users &&
                users.map((user) => (
                    (user.username == name || user.followers.includes(id)) ?
                    null
                    :
                    <div className='userFollow' key={user._id}>
                        <div className='userInfo'>
                            <span>{user.username}</span>
                            <p>{user.bio}</p>
                        </div>
                        {following.includes(user._id) &&
                            <button onClick={() => unfollow(user._id)} className='followButton'>Unfollow</button>
                        }
                        {!following.includes(user._id) &&
                            <button onClick={() => follow(user._id)} className='followButton'>Follow</button>
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Discover
