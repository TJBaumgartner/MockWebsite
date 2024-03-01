import {useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
import '../App.css'

function EditProfile() {

    const id = localStorage.getItem('userID')
    const [user, setUser] = useState()

    useEffect(() => {
    fetch(`http://localhost:5000/api/profile/${id}`, {   
        method: 'POST',     
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('access')
        },
        body: JSON.stringify(id)
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        setUser(data)
    })
    }, [])

    return (
    <div>
        {user && 
            <button onClick={() => console.log(user)}>Click</button>
        }
    </div>
  )
}

export default EditProfile
