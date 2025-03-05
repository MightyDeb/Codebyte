
import React, { use, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ProblemList from './Pages/ProblemList';
import ContestLive from './Pages/ContestLive';
import Leaderboard from './Pages/Leaderboard';
import Profile from './Pages/Profile';
import './App.css';
import MashupMaker from './Pages/MashupMaker';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Register from './Pages/Register';
import ProtectRoute from './components/auth/ProtectRoute';
import Comparison from './Pages/Comparison';
import { Toaster } from 'react-hot-toast';
import {io} from 'socket.io-client';

import Header from './components/utils/Header';
import Footer from './components/utils/Footer';

function App() {
  const user= localStorage.getItem("user");
  const [socket, setSocket]= useState(null)
  useEffect(()=>{
    setSocket(io(process.env.BACKEND_URI))
    socket?.on("contestCreated", (data) => {
      console.log(data)
    })
    console.log(socket)
  },[])
  useEffect(()=>{
    if(socket){
      socket.emit('userOnline', user)
    }
  },[socket,user])
  return (
    <>

    
    <div className='min-h-screen flex flex-col items-center justify-center overscroll-y-auto bg-gradient-to-r from-white to-gray-300'>
    <Router>
    <Header socket={socket} />
      <Routes>
        <Route element={       
              <ProtectRoute user={user} /> }>
              <Route path="/" element={<Landing/>} />
              <Route path="/home" element={<Home/>} />
              <Route path="/problems" element={<ProblemList />} />
              <Route path="/contest/:id" element={<ContestLive socket={socket}/>} />
              <Route path="/leaderboard" element={<Leaderboard socket={socket}/>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/mashup" element={<MashupMaker socket={socket}/>} />
              <Route path="/friend/:friendId" element={<Comparison/>} />
        </Route>
          
        <Route element={<ProtectRoute user={!user} redirect='/'/>}>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={ <Register/>} />
        </Route>
            
        
        <Route path="*" element={<h1>404 Not Found</h1>} />   
        
      </Routes>
      <Toaster position="bottom-center"/>
      <Footer/> 
    </Router>
    </div>
     
    </>
  );
}

export default App;

