import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

import '../App.css'

function Login(props) {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [usernameError, setUsernameError] = useState("")

    const logout = props.logout

    useEffect(() => {
        if(localStorage.length > 0) {
            logout()
            localStorage.clear()
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = {username, password}
            fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(user)
            })
            .then((response) => {
                if(response.status === 400){
                    setPasswordError(false)
                    setPassword('')
                    return setUsernameError(true)
                }
                if(response.status === 403){
                    setUsernameError(false)
                    setPassword('')
                    return setPasswordError(true)
                }
                return response.json()
            })
            .then((data) => {
                localStorage.setItem('access', data.accessToken);
                localStorage.setItem('refresh', data.refreshToken);
                localStorage.setItem('name', data.name);
                localStorage.setItem('userID', data.id);
                props.setLoggedIn(true);
                navigate('/homepage');
            })
    }
    let validationStyle = {border: '2px solid black'}
    if(passwordError == true || usernameError == true){
        validationStyle = {border: '2px solid red'}
    }
    return (
        <div className='loginWrapper'>
            <div className='loginContainer'>
                <h1>Login</h1>
                <form action="" method='POST' onSubmit={handleSubmit} className='loginForm'>
                    <label htmlFor='username'>Username</label>
                    <input type="text" name='text' id="username" value={username} placeholder='Username or Email' onChange={(e) => setUsername(e.target.value.replace(" ", ""))} required style={validationStyle}></input>
                    <label htmlFor='password'>Password</label>
                    <input type="password" placeholder="Type your Password"name='password' id="password" value={password} onChange={(e) => setPassword(e.target.value.replace(" ", ""))} required style={validationStyle}></input>
                    {passwordError == true || usernameError == true &&
                        <h3>Password or Username is incorrect</h3>
                    }
                    <div className='createAccountLink'>
                        <h3>Need An Account? <Link to="/user/create">Sign Up!</Link></h3>
                    </div>
                    <button type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login
