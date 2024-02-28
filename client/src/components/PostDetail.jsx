import {useEffect } from 'react'
import {useNavigate, useParams} from 'react-router-dom';
import '../App.css'

function PostDetail() {

    const params = useParams();
    const id = params.id
    useEffect(() => {
        console.log(id)
        fetch(`http://localhost:5000/api/post/${id}/comments`, {   
            method: 'GET',     
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access')
            },
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
        }) 
    }, [])

    return (
    <>
    <h1>PostDetail</h1>
    </>
  )
}

export default PostDetail
