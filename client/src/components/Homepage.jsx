import { useState } from 'react'
import '../App.css'
function HomePage(props) {

    const logout = props.logout
    return (
        <>
            <button onClick={()=> logout()} className="logout">Logout</button>
            <h1>Made it to the homepage</h1>
        </>
    )
}

export default HomePage
