import { useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [matchPassword, setMatchPassword] = useState(null)
    const [userTaken, setUserTaken] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = {username, password, email}
        if(password == confirmPassword){
            fetch('http://localhost:5000/api/user/create', {

                method: 'POST',
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(user)
            })
            .then((response) => {
                if(response.status === 400){        
                    setPassword('')
                    return setUserTaken(true)
                }
                navigate('/login')
                return response.json()
            })
        } else {
            setMatchPassword(false)
        }
    }

    return (
        <div className='signupWrapper'>
            <div className='signupContainer'>
                <h1>Sign Up</h1>
                <form action="" method='POST' className='signupForm' onSubmit={handleSubmit}>
                    <label htmlFor='username'>Username</label>
                    <input type="text" name='text' id="username" value={username} placeholder='Username' onChange={(e) => setUsername(e.target.value.replace(" ", ""))} required></input>
                    <label htmlFor='email'>Email</label>
                    <input type="email" name='text' id="email" value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value.replace(" ", ""))} required></input>
                    <label htmlFor='password'>Password</label>
                    <input type="password" name='password' id="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value.replace(" ", ""))} required></input>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input type="password" name='confirmPassword' id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value.replace(" ", ""))} required></input>
                    {/* <div className='createAccountLink'>
                        <h3>Already a user? <Link to="/login">Login!</Link></h3>
                    </div> */}
                    <button type='submit'>Sign Up!</button>
                </form>
                {matchPassword === false &&
                    <h2>Passwords must match</h2>
                }    
                {userTaken === true &&
                    <h2>Username is taken</h2>
                }  
            </div>
        </div>
    )
}

export default SignUp
