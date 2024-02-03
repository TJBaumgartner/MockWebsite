import {useEffect } from 'react'
import {useNavigate } from 'react-router-dom';
import '../App.css'

function Index() {
  const navigate = useNavigate()

    useEffect(() => {
      navigate('/login')
    }, [])  

    return (
    <>
    </>
  )
}

export default Index
