import './App.css'
import React, {useEffect, useState} from 'react'
import {Route, Routes } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HomePage from './components/Homepage';
import Signup from './components/signup';
import Login from './components/Login'
import Index from './components/Index';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Discover from './components/Discover';
import Followers from './components/Followers';
import Following from './components/Following';

function App() {   
  
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false)
  
  useEffect(() => {
    setInterval(async () => {
        fetch('http://localhost:5000/api/token', {        
            method: 'POST',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                "token": localStorage.getItem('refresh')
            })
        })
        .then((response) => {
            if(response.status === 401){
                console.log(localStorage)
                if(loggedIn == true){
                  localStorage.clear()
                  navigate('/login');
                }
            }
            return response.json()
        })
        .then((data) => {
          console.log(data)
          localStorage.setItem('access', data.accessToken);
        })
    },18000)
  }, [])
  
  const logout = async() => {
    await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"token": localStorage.getItem('refresh')})
    })
    .then((response) => {
        localStorage.clear()
        setLoggedIn(false)
        navigate('/login')
        return response.json()
    })
}

  return (
    <div className='AppContainer'>
        <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} logout={logout}/>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path="/homepage" element={<HomePage logout={logout}/>}/>
          <Route path="/following" element={<Following/>}/>
          <Route path="/discover" element={<Discover/>}/>
          <Route path="/followers" element={<Followers/>}/>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} logout={logout}/>}/>
          <Route path="/user/create" element={<Signup/>}/>
          <Route path="/:id/profile" element={<Profile/>}/>
        </Routes>
    </div>
  )
}

export default App
