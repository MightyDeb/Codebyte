import React from 'react'
import axios from "axios"
import { Link, redirect, useNavigate } from 'react-router-dom';

const Landing = () => {
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
   // Redirect to the login page
  };
  return (
    <div>
      <p>Hello {username}</p>
      <button onClick={handleLogout}>Logout</button>
      <Link to={"/profile"}>ProfilePAGE</Link>
    </div>
  )
}

export default Landing