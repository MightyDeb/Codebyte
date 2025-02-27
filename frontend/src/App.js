
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ProblemList from './Pages/ProblemList';
import ContestLive from './Pages/ContestLive';
import Leaderboard from './Pages/Leaderboard';
import Profile from './Pages/Profile';
import './App.css';
import MashupMaker from './Pages/MashupMaker';
import UserComparison from './Pages/UserComaprison';
import ProblemSolvers from './Pages/ProblemSolvers';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Motive from './Pages/Motive';
import Notifications from './Pages/Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/motive" element={<Motive />} />
        <Route path="/problems" element={<ProblemList />} />
        <Route path="/contests" element={<ContestLive />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mashup" element={<MashupMaker/>} />
        <Route path="/comparison/:user1/:user2" element={<UserComparison/>} />
        <Route path="/champs" element={<ProblemSolvers/>} />
        <Route path="/notifications" element={<Notifications />} />       
      </Routes>
    </Router>
  );
}

export default App;