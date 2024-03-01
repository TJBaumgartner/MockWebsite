import {useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom';
import '../App.css'
import { Link } from 'react-router-dom';

function ExploreTabs() {
    return (
        <div className='followTabs'>
            <Link to={'/discover'}>
                <p>Discover</p>
            </Link>
            <Link to={'/followers'}>
                <p>Followers</p>
            </Link>
            <Link to={'/following'}>
                <p>Following</p>
            </Link>
        </div>
  )
}

export default ExploreTabs
