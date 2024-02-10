import { useState, useEffect } from 'react'
import '../App.css'

function Users() {

    const id = localStorage.getItem('userID')
    const name = localStorage.getItem('name')
    const [users, setUsers] = useState()

    useEffect(() => {
        const data = {id}
        fetch(`http://localhost:5000/api/user/list`, {   
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
            console.log(data)
            setUsers(data)
        }) 
    }, [])

    
    return (
        <div className='userListContainer'>
            <h1>Users to follow</h1>
            {users &&
                users.map((user) => (
                    (user.username == name) ?
                    null
                    :
                    <div className='userFollow'>
                        <div className='userInfo'>
                            <span key={user._id}>{user.username}</span>
                            <p>{user.bio}</p>
                        </div>
                        <button onClick={() => follow()} >follow</button>
                    </div>
                ))
            }
        </div>
    )
}

export default Users
