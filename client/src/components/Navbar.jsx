/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import {useState, useEffect} from 'react'
import 'font-awesome/css/font-awesome.min.css';

const Navbar = (props) => {
    const loggedIn = props.loggedIn
    const logout = props.logout

    const id = localStorage.getItem('userID')
    const name = localStorage.getItem('name')

    const [displayForm, setDisplayForm] = useState(false)
    const [displayLogout, setDisplayLogout] = useState(false)
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
        setDisplayLogout(false)
        setMessage('')
    }
    const closeLogout = () => {
        setDisplayLogout(false)
        logout()
    }

    return (
        <div className="navContainer"> 
            <div>
                {loggedIn == true &&
                    <div className="Navbar"> 
                        <div className="homepageLinks">
                            <Link to={'/homepage'}>
                                <p><i className="fa fa-home"></i>Hompage</p>
                            </Link>
                            <Link to={'/discover'}>
                            <p><i className="fa fa-search"></i>Explore</p>
                            </Link>
                            <Link to={{
                                pathname: `/${id}/posts`,
                                }}
                                >
                                <p><i className="fa fa-user"></i>Profile</p>
                            </Link>
                        </div>
                        <div>
                            <button onClick={() => displayPostForm()} className="postButton">Post</button>
                            {displayForm == true &&
                            <div>
                                <div className='postFormBackground' onClick={() => closePostForm()}></div>
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
                            </div>
                            }
                        </div>
                        <div className="logoutContainer">
                            <div className="logoutDisplay">
                                <h1>{name}</h1>
                                <i class="fa fa-bars" onClick={() => setDisplayLogout(true)}></i>
                            </div>
                            {displayLogout &&
                            <div>
                                <div className='postFormBackground' onClick={() => closePostForm()}></div>
                                <button onClick={()=> closeLogout()} className="logout">Logout</button>
                            </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
  );
};

export default Navbar;
