import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

function Following() {

    const id = localStorage.getItem('userID')
    const name = localStorage.getItem('name')
    const [users, setUsers] = useState()
    const [followRequest, setFollowRequest] = useState(false)



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
        .then((data) => {
            console.log(data.following)
            setUsers(data.following)
            setFollowRequest(false)
        }) 
    }, [followRequest])


    const unfollow = (user) => {

        const data = {id, user}
        fetch('http://localhost:5000/api/user/unfollow', {
            method: 'POST',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        .then((response) => {
            setFollowRequest(true)
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
                    (user.username == name) ?
                    null
                    :
                    (user.followers.includes(id)) ? 
                        <div className='userFollow' key={user._id}>
                        <div className='userInfo'>
                            <span>{user.username}</span>
                            <p>{user.bio}</p>
                        </div>
                        <button onClick={() => unfollow(user._id)} >Unfollow</button>
                    </div>
                    :
                    null
                ))
            }
        </div>
    )
}

export default Following