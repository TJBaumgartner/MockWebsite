import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

function Followers() {
    
    const id = localStorage.getItem('userID')
    const [users, setUsers] = useState()
    const [following, setFollowing] = useState([])

    const loadUsers = () => {
        const data = {id}
        const newData = fetch(`http://localhost:5000/api/user/followers`, {   
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
            return data.followers
        }) 
        return newData
    }


    useEffect(() => {
        async function fetchData(){
            try{
                const data = await loadUsers()
                setUsers(data)
                log(data)
            } catch (e) {
                console.error(e)
            }
        }
        fetchData()
    }, [])

    const unfollow = (element) => {
        const user = element._id
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
            return following._id !== user
        }))
    }
    
    const follow = (element) => {
        const user = element._id
        const data = {id, user}
        fetch('http://localhost:5000/api/user/follow', {
            method: 'POST',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(data)
        })
        .then((response) => {
            return response.json()
        })
        return setFollowing([...following, element])
    }
    const log = (data) => {
        let array = null
        if(data){
            array = data.filter(function(a){
                return a.followers.includes(id) ? a : null
            })
        }else{
            array = users.filter(function(a){
                return a.followers.includes(id) ? a : null
            })
        }
        return setFollowing(array)
    }
    return (
        <div className='followListContainer'>
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
                    <div className='userFollow' key={user._id}>
                        <div className='userInfo'>
                            <span>{user.username}</span>
                            <p>{user.bio}</p>
                        </div>
                        {following.includes(user) &&
                            <button onClick={() => unfollow(user)}>Unfollow</button>
                        }
                        {!following.includes(user) &&
                            <button onClick={() => follow(user)}>Follow</button>
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Followers

