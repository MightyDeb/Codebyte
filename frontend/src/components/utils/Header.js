import React, { useEffect, useState } from 'react'
import { Bell, CircleX, Cross, Ham, Menu } from 'lucide-react'
import axios from 'axios'
import Logo from "../../constants/pictures/codebyte.png"
import { Button } from '@mui/material'
import { a, redirect, useNavigate } from 'react-router-dom'

const Header = ({socket}) => {
  
  const user= localStorage.getItem("user")
  const [notifications, setNotifications]= useState([])
  const [realTimeNotifications, setRealTimeNotifications]= useState([])
  const [open,setOpen]= useState(false)
  const [mobileView, setMobileView]= useState(false)
  useEffect(()=>{   
      let isMounted= true;
      async function fetchData(){
        try {
      const notifications= await axios.get('http://localhost:5000/api/notifications/notification',{
        withCredentials: true,
      })
      if(isMounted){
        setNotifications(notifications.data.notificationMessage)
      }
      console.log(notifications.data)
    } catch (error) {
      console.error(error)
    }
  }
    fetchData();
    return () => {
      isMounted=false
    }
  },[])
  useEffect(()=>{
    console.log(socket)
    if(socket){
      socket.on("getContestAlert",data=>{
        setRealTimeNotifications(prev=>[...prev,data])
      })
      socket.on("newfriendRequestAlert",data=>{
        setRealTimeNotifications(prev=>[...prev,data])
      })
    }
  },[socket])
  
  const handleRead = async() => {
    
    try {
      setNotifications([])
      setRealTimeNotifications([])
      setOpen(false)
      await axios.put('http://localhost:5000/api/notifications/updateNotification',{
        withCredentials: true,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const addFriendHandler = async() => {
    try {
      await axios.put('http://localhost:5000/api/friends/addFriend',{friendUsername: user},{
        withCredentials: true,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = async() => {
    localStorage.removeItem("user")
    try {
      await axios.get('http://localhost:5000/api/user/logout').then(()=>{
      redirect('/login'); 
    })
    } catch (error) {
      console.error(error.response.data);
    }
    window.location.reload()
  }

  return (
    <div className='fixed  top-0 w-full bg-[#0f3b7c] text-white text-center p-4 flex justify-between items-center gap-2 h-[50px]'>
      <img src={Logo} alt="logo" className='h-10 w-10 inline-block'/>
      <button onClick={()=>setMobileView(!mobileView)} className='md:hidden'>
        {mobileView ? <CircleX /> : <Menu />}
      </button>

      <div className={`w-full md:flex md:items-center md:w-auto 
                    md:space-x-4 absolute md:relative top-16 left-0 md:top-0 
                    md:left-0 p-4 md:p-0  md:bg-transparent 
                    transition-all duration-500 ease-in-out transform ${mobileView ? 
                    'translate-x-0' : 'translate-x-full'
                        } md:translate-x-0 ${mobileView ? 'text-blue-700' : 'text-white'}`}>
                        
        {!user && <a href={'/login'}><button className='block py-2 px-4 hover:font-semibold md:inline-block '>Login</button></a>}
        {!user && <a href={'/register'}><button className='block py-2 px-4 hover:font-semibold md:inline-block'>Register</button></a>}
        {user && <a href={'/home'}><button className='block py-2 px-4  hover:font-semibold md:inline-block'>Home</button></a>}
        {user && <a href={'/profile'}><button className='block py-2 px-4  hover:font-semibold md:inline-block'>Profile</button></a>}
        {user && <a href={'/leaderboard'}><button className='block py-2 px-4  hover:font-semibold md:inline-block'>Leaderboard</button></a>}
        {user && <a href={'/contests'}><button className='block py-2 px-4  hover:font-semibold md:inline-block'>Contests</button></a>}
        {user && <a href={'/problems'}><button className='block py-2 px-4  hover:font-semibold md:inline-block'>Practice</button></a>}
        {user && <button className='block py-2 px-4 hover:font-semibold  md:inline-block' onClick={handleLogout}>Logout</button>}
      </div>
      <div className='icons'>
        <div className='icon' >
         <button onClick={()=>setOpen(!open)}><Bell /></button>
         <div className='counter'>{notifications.length+realTimeNotifications.length>0 && notifications.length+realTimeNotifications.length}</div>
        </div>
      </div>
      {open && notifications.length+realTimeNotifications.length>0 && <div className='notifications'>
        {notifications.map((notification,index)=>(
          <div key={index} className='notification'>
            <span>{notification}</span>
            {notification.type==="friendRequest" && <button onClick={addFriendHandler}>Accept</button>}
          </div>
        ))}
        {realTimeNotifications.map((notification,index)=>(
          <div key={index} className='notification'>
            <span>{notification.message}</span>
            {notification.type==="friendRequest" && <button onClick={addFriendHandler}>Accept</button>}
          </div>

        ))}
        <button onClick={handleRead}>Mark as read</button>
      </div>}
    </div>
  )
}

export default Header