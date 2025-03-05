import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import Hero from '../constants/pictures/hero.jpg'
import Filler from '../constants/pictures/filler.gif'
import { GoogleGenerativeAI } from "@google/generative-ai";
const Home = () => {
  const username= localStorage.getItem("user")
  const [userInfo,setUserInfo]= useState(null)
  const [problems,setProblems]= useState([])
  const [contests,setContests]= useState([])
  const navigate=useNavigate();
  const genAI = new GoogleGenerativeAI(process.env.API_KEY || "AIzaSyB28CnLO6zpajpuV4Y6Qv5p5Svim51ExD4");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  useEffect(()=>{
    const fetchAIData=async()=>{
      try {
        if(userInfo){
          const prompt = `
    Generate a data by choosing 5 problems from the CodeforcesAPI of question rating ${userInfo.rating} to ${userInfo.rating+200}
    
    Return the response in this JSON format only, no additional text:
    {
      "problems": [
        {
          "contestId": "string",
          "index: "string",
        }
      ]
    }
  `;
          const result = await model.generateContent(prompt);
          const text= result.response.text()
          
          const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        setProblems(JSON.parse(cleanedText).problems)
        console.log(text);
        }
        } catch (error) {
          console.log(error)
        }
    }
    fetchAIData()
    
  },[userInfo])

  useEffect(()=>{
    let isMounted = true;
    async function fetchData() {
      try {
        const userInfoResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        const contestResponse= await axios.get('process.env.BACKEND_URI/api/contest/unattemptedContests')
        console.log(contestResponse)
        if (isMounted) {
          setUserInfo(userInfoResponse.data.result[0]);         
          setContests(contestResponse.data.unattemptedContests)
        }
      }catch(error){
        console.log(error)
      }
    }
    fetchData();

    return () => {
      isMounted = false;
    };
  },[])
  
  useEffect(()=>{
    console.log(problems)
  },[problems])
  return (
    <div className='min-h-[70vh] flex flex-col items-center justify-center p-4 mt-24 text-center'>
      <Typography variant='h5' sx={{
        backgroundColor: 'lightgrey',
        width: '100vw',
        textAlign: 'center',
        padding: '10px',
        fontWeight: 'bold',
        backgroundImage: `linear-gradient(45deg, #5514B4, #FF80FF)`
      }}>{`Welcome ${username}`}</Typography>
      <div className='w-[100vw] bg-gray-200 flex items-center justify-center py-3 mb-2'>
      <img src={Hero} className='max-w-[70vw] h-auto mt-0 ' alt='Hero'/></div>
      <div className='flex gap-10 flex-col md:flex-row justify-around items-center mt-10 bg-sky-100 w-[95vw] p-4'>
        <div className='p-4 border-double border-2 border-blue-700 hover:scale-105'>
          <h1 className='font-bold uppercase border-b-2 border-blue-800 text-blue-800 animate-bounce'>
            View Your Profile
          </h1>
          <div className='mt-2 font-bold'>
          <h5>{`Username:  ${userInfo?.handle}`}</h5>
            <h5>{`CF Rating: ${userInfo?.rating}`}</h5>
            <h5>{`Rank: ${userInfo?.rank}`}</h5>
            <h5>Welcome!</h5>
          </div>
          <br/>
          <a href={'/profile'}>
            <Button variant='outlined' color='primary'>View More</Button>
          </a>
        </div>
        <div><img src={Filler} className='md:hidden h-40 w-40'/></div>
        <div className='p-4 border-double border-2 border-blue-700 hover:scale-105'>
          <h1 className='font-bold uppercase border-b-2 border-blue-800 text-blue-800 animate-bounce'>GIVE A CONTEST</h1>
          <br/>
          <div className='grid grid-cols-2 mb-8'>
          {contests?.map((contest,index)=>(
            <a href={`/contest/${contest._id}`}><p id={`${index}`} className='text-blue-400 underline hover:text-sky-950 font-semibold'>{contest._id.slice(3,9)}</p></a>
          ))}
          </div>
          <a href={'/mashup'}>
            <Button variant='outlined' color='primary'>View More</Button>
          </a>
        </div>
        <div>
        <img src={Filler} className='md:hidden h-40 w-40'/>
        </div>
        <div className='p-4 border-double border-2 border-blue-700 hover:scale-105'>
          <h1 className='font-bold uppercase border-b-2 border-blue-800 text-blue-800 animate-bounce'>
            Practice Problems
          </h1>
          <div className='flex flex-col'>
            {problems.length==0 &&
            <p>Generating from AI...</p>}
          {problems.length > 0 &&
            problems.map((problem) => (
              <a key={`${problem.contestId}-${problem.index}`} href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}>
                <span className='text-blue-400 font-bold underline hover:text-sky-950 '>{`${problem.contestId}-${problem.index}`}</span>
              </a>
            ))
            
          }
          </div>
          <br/>
          <a href={'/problems'}>
            <Button variant='outlined' color='primary'>View More</Button>
          </a>
        </div>
      </div>
      <div className='text-center text-white bg-blue-700 mt-10 p-7'>
        <h1 className='font-bold uppercase border-b-2 border-white my-4 animate-pulse '>ABOUT</h1>
        <p>Devbits 2025, a flagship hackathon of EES Fest Udyam, was an exhilarating platform for innovation and collaboration, bringing together tech enthusiasts to solve real-world challenges. The hackathon's problem statement revolved around creating a competitive coding arena that leveraged the Codeforces API to enable real-time mashup creation, problem-solving, and user comparison. This platform aimed to revolutionize the way coders practice and compete by providing a seamless, interactive, and dynamic environment for coding enthusiasts.

Our team, comprising Debapriya Maity, Dhairya Arora, and Utkarsh Agarwal, took on this challenge with enthusiasm and determination. We designed a robust system that allowed users to create custom mashups, solve problems in real-time, and compare their performance with others. The platform integrated features like real-time leaderboard updates, problem recommendations, and user performance analytics, making it a one-stop solution for competitive coders. By utilizing the Codeforces API, we ensured access to a vast repository of problems and user data, enhancing the platform's functionality and user experience.

The hackathon was not just about coding but also about teamwork, creativity, and problem-solving under pressure. It was an incredible learning experience, and we are proud of what we achieved together. Devbits 2025 will always remain a memorable milestone in our journey as developers and innovators.

P.S.: Our project aimed to make competitive coding more accessible, engaging, and fun for everyone!</p>
      </div>
    </div>
  )
}

export default Home



//unauthorized access give contests
//can convert to grid