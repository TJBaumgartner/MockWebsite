import {useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
import '../App.css'
import { Link } from 'react-router-dom';

function ExploreTabs(props) {

    const id = localStorage.getItem('userID')

    const [activeTab, setActiveTab] = useState('')
    useEffect(() => {
        if(props.currentTab == 'discover'){
            setActiveTab('discover')
        } else if(props.currentTab == 'followers') {
            setActiveTab('followers')
        } else {
            setActiveTab('following')
        }
    }, [])

    return (
        <div>
            {activeTab == 'discover' &&
                <div className='followTabs'>
                    <Link to={'/discover'}>
                        <p className='active'>Discover</p>
                    </Link>
                    <Link to={'/followers'}>
                        <p>Followers</p>
                    </Link>
                    <Link to={'/following'}>
                        <p>Following</p>
                    </Link>
                </div>
            }
            {activeTab == 'followers' &&
                <div className='followTabs'>
                    <Link to={'/discover'}>
                        <p>Discover</p>
                    </Link>
                    <Link to={'/followers'}>
                        <p className='active'>Followers</p>
                    </Link>
                    <Link to={'/following'}>
                        <p>Following</p>
                    </Link>
                </div>
            }
            {activeTab == 'following' &&
                <div className='followTabs'>
                    <Link to={'/discover'}>
                        <p>Discover</p>
                    </Link>
                    <Link to={'/followers'}>
                        <p>Followers</p>
                    </Link>
                    <Link to={'/following'}>
                        <p className='active'>Following</p>
                    </Link>
                </div>
            }
        </div>
  )
}

export default ExploreTabs
