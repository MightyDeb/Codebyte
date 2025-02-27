import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";





const Profile = () => {
  const username="Mighty_Deb"
  //other details from local database
  const [userInfo, setUserInfo] = useState();
  const [historyInfo, setHistoryInfo]= useState([])

  useEffect(()=>{
    axios.get(`https://codeforces.com/api/user.info?handles=${username}`)
    .then(response=> {
      setUserInfo( response.data.result[0])   
    })
    .catch((error) => {
      console.error(error); })
    axios.get(`https://codeforces.com/api/user.rating?handle=${username}`)
    .then(response => {
      setHistoryInfo( response.data.result)
    })
    .catch((error) => {
      console.error(error); })
  },[])

  if (!userInfo) return <div><h1>Loading...</h1></div>;

  return (
    <div>
      <h2>User Analytics: {username}</h2>

      <h3>User Info</h3>
      <p>Registered Name:</p>
      <p>Name: {userInfo.handle}</p>
      <p>Rating: {userInfo.rating}</p>
      <p>Max Rating: {userInfo.maxRating}</p>
      <p>Rank: {userInfo.rank}</p>
      <p>Number of contests created on Codebyte:</p>
      <img src={userInfo.avatar} alt="User Avatar"/>

      <h3>CODEFORCES Rating History</h3>
      <h2>Last 5 contests</h2>
      <div >
        {historyInfo.length===0 && <p>Loading...</p>}
        {historyInfo.reverse().slice(0,5).map((history,index)=>{
          return(
            <div key={index}>
              <p>Contest ID: {history.contestId}</p>
              <p>Contest Name: {history.contestName}</p>
              <p>Contest Rank: {history.rank}</p>
            </div>
          )
        })}
      </div>
      <h2>Rating Curve</h2>
      <div style={{ margin: "20px" }}>
      <LineChart
        width={600}
        height={300}
        data={historyInfo.map((history, index) => ({ x: index + 1, y: history.newRating }))}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" label={{ value: "Contest Number", position: "insideBottom", offset: -10 }} />
        <YAxis label={{ value: "Rating", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
      </div>
      <div>
        {/* grid of local contests */}
      </div>
      <h3>SWOT ANALYSIS BY CODEBYTE-AI</h3>
      {/* AI COACH */}
    </div>
  );
};

export default Profile;