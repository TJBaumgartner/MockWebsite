import {useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
import '../App.css'
import { Link } from 'react-router-dom';

function UserTabs(props) {
    const id = localStorage.getItem('userID')

    const [activeTab, setActiveTab] = useState(false)
    useEffect(() => {
        if(props.currentTab == 'posts'){
            setActiveTab(true)
        } else {
            setActiveTab(false)
        }
    }, [])

    return (
    <div>
        {activeTab == true  ? 
        <div className='userTabs'>
            <Link to={`/${id}/posts`}>
            <p className='active'>Posts</p>
            </Link>
            <Link to={`/${id}/likes`}>
                <p>Likes</p>
            </Link>
            </div>
        :
        <div className='userTabs'>
            <Link to={`/${id}/posts`}>
            <p>Posts</p>
            </Link>
            <Link to={`/${id}/likes`}>
                <p className='active'>Likes</p>
            </Link>
        </div>
        }

    </div>
  )
}

export default UserTabs
