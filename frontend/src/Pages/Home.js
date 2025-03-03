import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import Hero from '../constants/pictures/hero.png'
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
        const contestResponse= await axios.get('http://localhost:5000/api/contest/unattemptedContests')
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
        fontWeight: 'bold'
      }}>{`Welcome ${username}`}</Typography>
      <div className='w-[100vw] bg-gray-200 flex items-center justify-center py-3 mb-2'>
      <img src={Hero} className='max-w-[70vw] h-auto mt-0 ' alt='Hero'/></div>
      <div className='flex gap-10 flex-col md:flex-row justify-around items-center mt-10'>
        <div className='p-4 border-double border-2 border-blue-700 '>
          <h1 className='font-bold uppercase border-b-2 border-blue-800 text-blue-800 animate-bounce'>
            View Your Profile
          </h1>
          <div className='mt-2 font-bold'>
            <h5>{`Username:  ${userInfo?.handle}`}</h5>
            <h5>{`CF Rating: ${userInfo?.rating}`}</h5>
            <h5>{`Rating: ${userInfo?.rating}`}</h5>
            <h5>{`Rank: ${userInfo?.rank}`}</h5>
          </div>
          <br/>
          <a href={'/profile'}>
            <Button variant='outlined' color='primary'>View More</Button>
          </a>

        </div>
        <div className='p-4 border-double border-2 border-blue-700 '>
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
        <div className='p-4 border-double border-2 border-blue-700 '>
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
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </div>
  )
}

export default Home



//unauthorized access give contests
//can convert to grid