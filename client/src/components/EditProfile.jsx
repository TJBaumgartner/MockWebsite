import {useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
import '../App.css'

function EditProfile() {

    const id = localStorage.getItem('userID')
    const [user, setUser] = useState()
    const [displayForm, setDisplayForm] = useState(false)
    const [bio, setBio] = useState('')

    useEffect(() => {
    
        const data = {id}
        fetch(`https://mockwebsite-api.onrender.com/api/profile/${id}`, {   
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
            setUser(data)
            setBio(data.bio)
        })
    }, [])

    const submitChange = (e) => {
        e.preventDefault()
        const data = {id, bio}
        fetch(`https://mockwebsite-api.onrender.com/api/profile/${id}/edit`, {   
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
        setDisplayForm(false)
    }
    return (
    <div className='profileContainer'>
        {user && 
            <div>
                <div className='userHeader'>
                    <h1>{user.username}</h1>
                    <button className='editButton' onClick={() => setDisplayForm(true)}>Edit Profile</button>
                </div>
                {displayForm == false &&
                <div>
                    <p>{bio}</p>
                </div>
                }
                {displayForm == true &&
                    <div className='editContainer'>
                        <p>Edit Bio</p>
                        <form action="" method='POST' onSubmit={submitChange} className='editForm'>
                            <input type='text' required value={bio} onChange={(e) => setBio(e.target.value)} maxLength={"200"}/>
                            <button type='submit'>Confirm</button>
                        </form>
                    </div>                
                }
            </div>
        }
    </div>
  )
}

export default EditProfile
