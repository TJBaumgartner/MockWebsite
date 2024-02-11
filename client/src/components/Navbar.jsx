/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
    // const navigate = useNavigate()
    const loggedIn = props.loggedIn
    const setLoggedIn = props.setLoggedIn
    const logout = props.logout

    const id = localStorage.getItem('userID')

    const navigate = useNavigate()
    const [displayForm, setDisplayForm] = useState(false)
    const [message, setMessage] = useState('')

    const displayPostForm = () => {
        setDisplayForm(true)
    }
    const createPost = (e) => {
        e.preventDefault();
        const user = localStorage.getItem('userID')
        const data = {message, user}
        fetch('http://localhost:5000/api/post/create', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log('Post Created')
        })
        closePostForm()
    }
    const closePostForm = () => {
        setDisplayForm(false)
        setMessage('')
    }


    return (
        <div className="navContainer"> 
            <div>
                {loggedIn == true &&
                    <div className="Navbar"> 
                        <div>
                            <Link to={'/homepage'}>
                                <h1>Hompage</h1>
                            </Link>
                            <Link to={'/discover'}>
                                <h1>Explore</h1>
                            </Link>
                            <Link to={{
                                pathname: `/${id}/profile`,
                                }}
                                >
                                <h1>Profile</h1>
                            </Link>
                        </div>
                        <div>
                            <button onClick={() => displayPostForm()}>Post</button>
                            {displayForm == true &&
                                <div className='postFormContainer'>
                                    <span onClick={() => closePostForm()}>X</span>
                                    <form className="postForm" action="" method="POST" onSubmit={createPost}>
                                        <textarea 
                                        name="message" 
                                        id="message" 
                                        type="text"
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder='What to post?!'
                                        />
                                        <div className='bottomBorder'></div>
                                        {message !== '' &&
                                            <button type="submit">Post</button>
                                        }
                                        {message == '' &&
                                            <button type='button' className='disabledButton'>Post</button>
                                        }
                                    </form>  
                                </div> 
                            }
                        </div>
                        <div>
                            <h1>{name} <button onClick={()=> logout()} className="logout">Logout</button></h1>
                        </div>
                    </div>
                }
            </div>
        </div>
  );
};

export default Navbar;
