import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
const Home = () => {
  const username= localStorage.getItem("user")
  const navigate=useNavigate();
  const handleLogout = async() => {
    localStorage.removeItem("user")
    try {
      await axios.get('http://localhost:5000/api/user/logout').then(()=>{
      navigate('/login'); 
    })
    } catch (error) {
      console.error(error.response.data);
    }
    window.location.reload()
  }
  return (
    <div className='min-h-[70vh] flex flex-col items-center justify-center pt-30'>
      <p>Hello {username}</p>
      <button onClick={handleLogout}>Logout</button>
      <Link to={"/profile"}>ProfilePAGE</Link>
    </div>
  )
}

export default Home