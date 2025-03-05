import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button, Typography } from '@mui/material';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {format} from 'date-fns'
import { ChartSpline, Users } from 'lucide-react';



const Profile = () => {
  const username= localStorage.getItem("user")
  const [localInfo,setLocalInfo]= useState(null)
  const [userInfo, setUserInfo] = useState(null);
  const [historyInfo, setHistoryInfo]= useState([])
  const [swot,setSwot]= useState(null)
  const [friends,setFriends]= useState([])
  const genAI = new GoogleGenerativeAI(process.env.API_KEY || "AIzaSyB28CnLO6zpajpuV4Y6Qv5p5Svim51ExD4");
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  
    useEffect(()=>{
        const fetchAIData=async()=>{
          try {
            if(userInfo && historyInfo){
              const prompt = `
    Write a professional SWOT for a codeforces user with rating ${userInfo.rating}.
    
    About the candidate:
    - Industry: ${userInfo.handle}
    - Number of contests: ${historyInfo.length}
    - Skills: "competitive programming, math, greedy algorith, basic computation, data structures and algorithm"

    Requirements:
    1. Use a professional, enthusiastic tone
    2. Keep it concise (max 400 words)
    3. Write in the following subheadings- strengths,weakness,opportunities and threats.
    4. Relate it with the modern trends of competitive coding and data structures/algorithm.

    Return the response in this JSON format only, no additional text:
    {
      "Strengths": "string",
      "Weakness": "string",
      "Opportunities": "string",
      "Threats": "string,        
    }
  `;
  const result = await model.generateContent(prompt);
      const text= result.response.text()
          
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      setSwot(JSON.parse(cleanedText))
            }
            } catch (error) {
              console.log(error)
            }
        }
        fetchAIData()
        
      },[userInfo,historyInfo])
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const userInfoResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        const historyInfoResponse = await axios.get(`https://codeforces.com/api/user.rating?handle=${username}`);
        const localInfoResponse = await axios.get('https://codebyte-if2s.onrender.com/api/user/me', { withCredentials: true });
        if (isMounted) {
          setUserInfo(userInfoResponse.data.result[0]);
          setHistoryInfo(historyInfoResponse.data.result);
          setLocalInfo(localInfoResponse.data.user);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(()=>{
    const getUserDetails= async(id)=>{
      try {
        const {data}= await axios.get(`https://codebyte-if2s.onrender.com/api/user/getDetails/${id}`)
        setFriends(prev=> [...prev,data.username])
      } catch (error) {
        console.log(error)
      }
    }
    localInfo?.friends?.map(i=> getUserDetails(i))
  },[localInfo])
  

  if (!userInfo || !localInfo) return <div><h1>Loading...</h1></div>;

  return (

    <div className='min-h-[70vh] flex flex-col items-center justify-center gap-7 p-4 mt-24'>
      <Typography variant='h5' sx={{
        backgroundColor: 'lightgrey',
        width: '100vw',
        textAlign: 'center',
        padding: '10px',
        fontWeight: 'bold'
      }}>{`User Analytics: ${username}`}</Typography>
      <div className='flex flex-col items-center justify-center gap-5 border-double border-4 p-3 md:p-5 border-blue-950 bg-yellow-400 rounded-lg shadow-lg'>
        <h3 className='uppercase font-extrabold text-4xl hover:animate-bounce border-b-2 border-black'>User Info</h3>
        <div className='text-center typewriter md:text-xl '>
          <p className='underline font-mono'>Registered Name: </p>
          <p>{localInfo.name}</p>
          <p className='underline font-mono'>CF Name: </p>
          <p>{userInfo.handle}</p>
          <p className='underline font-mono'>Rating: </p>
          <p>{userInfo.rating}</p>
          <p className='underline font-mono'>Max Rating: </p>
          <p>{userInfo.maxRating}</p>
          <p className='underline font-mono'>Rank: </p>
          <p>{userInfo.rank}</p>
          <p className='underline font-mono'>Date of registration: </p>
          <p>{format(new Date(localInfo.createdAt), 'MMMM do, yyyy H:mm a')}</p>
        </div>
        <img src={localInfo.profileAvatar} alt="User Avatar" className='border-black bolder-solid border-2'/>
      </div>
      <h2 className='mt-2 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700 flex gap-2'>Friends List <Users/></h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
        {
          friends?.length===0 &&
          <p className='col-span-1 md:col-span-2 lg:col-span-4'>NO FRIENDS</p>
        }
        {friends?.map((i,index)=>{
          
          return(
          <a href={`/friend/${i}`} id={`${index}`}><p className='uppercase text-l p-2 px-4 hover:scale-110 bg-blue-600 text-white rounded-lg font-bold'>
            {i}
          </p></a>
          )})}
      </div>
      <h3 className='mt-2 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700'>CODEFORCES Rating History</h3>
      <h2 className='uppercase text-l p-2 px-4 hover:scale-110 bg-blue-600 text-white rounded-lg font-bold'>Last 5 contests</h2>
      <div className='flex flex-col  overflow-x-hidden w-[90vw] bg-yellow-400 p-2 py-4 rounded-xl border-solid border-2 border-black'>
        {historyInfo.length===0 && <p>Loading...</p>}
        {historyInfo.slice(-5).map((history,index)=>{
            return(
            <div key={index} className='flex flex-col md:flex-row gap-3'>
              <p className='font-semibold'>{index+1}.</p>
              <p><span className='underline font-semibold'>Contest ID:</span> {history.contestId}</p>
              <p className='underline font-semibold'>Contest Name:</p>
              <p>{history.contestName}</p>
              <p><span className='underline font-semibold'>Contest Rank:</span> {history.rank}</p>
              <br/>
            </div>
            )
          })}
          </div>
          <h2 className='mt-2 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700 flex gap-2'>Rating Curve <ChartSpline/></h2>
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
              <LineChart
              data={historyInfo.map((history, index) => ({ x: index + 1, y: history.newRating }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <XAxis dataKey="x" label={{ value: "Contest Number", position: "insideBottom", offset: -10 }} />
                <YAxis label={{ value: "Rating", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />              
              <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>         
          </div>

          <h3 className='mt-2 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700'>
            SWOT ANALYSIS BY CODEBYTE-AI
          </h3>
          {!swot && <p>"Generating SWOT by AI..."</p>}
          {swot && 
          <div className='flex flex-col items-center overflow-x-hidden w-[90vw] bg-yellow-400 p-2 py-4 rounded-xl border-solid border-2 border-black'>
            <p className='text-xl font-semibold underline font-mono'>Strengths</p>
            <p>{swot.Strengths}</p>
            <p className=' text-xl font-semibold underline font-mono'>Weakness</p>
            <p>{swot.Weakness}</p>
            <p className=' text-xl font-semibold underline font-mono'>Opportunities</p>
            <p>{swot.Opportunities}</p>
            <p className='text-xl font-semibold underline font-mono'>Threats</p>
            <p>{swot.Threats}</p>
          </div>
          
            }
            <a href={'/problems'} className=' mt-2 hover:animate-bounce'>
            <Button variant='contained'>Practice Problems</Button>
            </a>
    </div>
  
          
        
      
    
  );
};

export default Profile;


//ulta contest
//user comparison (friends)