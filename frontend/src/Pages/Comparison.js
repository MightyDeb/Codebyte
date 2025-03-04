import { Button } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Comparison = () => {
  const username= localStorage.getItem("user")
  const {friendId}= useParams()
  const [myDetails,setMyDetails]= useState(null)
  const [friendDetails,setFriendDetails]= useState(null)
  useEffect(()=>{
    let isMounted= true;
    const fetchDetails= async()=>{
      try {
        if(isMounted){
          const myResponse= await axios.get(`http://localhost:5000/api/user/get/${username}`,{
            withCredentials: true
          })
          const friendResponse= await axios.get(`http://localhost:5000/api/user/get/${friendId}`,{
            withCredentials: true
          })
          setMyDetails(myResponse.data.details)
          setFriendDetails(friendResponse.data.details)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchDetails()
    return ()=> {
      isMounted= false
    }
  },[])
  const ProgressBar = ({ number1, number2 }) => {  
    const progress = number1;
    const total = number1 + number2;
    console.log(progress,total)
    const progressPercentage = (progress / total) * 100;
  
    return (
      <div style={{ width: '70%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
        <div
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: '#76c7c0',
            height: '10px',
            borderRadius: '5px',
          }}
        ></div>
        <div style={{ marginTop: '5px', textAlign: 'center'}} className='text-blue-700 font-semibold'>
          ({progressPercentage.toFixed(2)}%)
        </div>
      </div>
    );
  };
  return (
    <div className='min-h-[70vh] flex flex-col justify-center items-center p-4 mt-24'>
      <table className='table-auto border-collapse border border-gray-300 md:hover:scale-125'>
        <thead>
          <tr className='bg-sky-200'>
            <th className='border border-gray-300 px-4 py-2'>Attribute</th>
            <th className='border border-gray-300 px-4 py-2'>Friend</th>
            <th className='border border-gray-300 px-4 py-2'>You</th>
          </tr>
        </thead>
        <tbody className='font-semibold'>
          <tr>
            <td className='border border-gray-300 px-4 py-2'>Name</td>
            <td className='border border-gray-300 px-4 py-2'>{friendDetails?.name}</td>
            <td className='border border-gray-300 px-4 py-2'>{myDetails?.name}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 px-4 py-2'>Username</td>
            <td className='border border-gray-300 px-4 py-2'>{friendDetails?.username}</td>
            <td className='border border-gray-300 px-4 py-2'>{myDetails?.username}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 px-4 py-2'>CF Rating</td>
            <td className='border border-gray-300 px-4 py-2'>{friendDetails?.CFrating}</td>
            <td className='border border-gray-300 px-4 py-2'>{myDetails?.CFrating}</td>
          </tr>
          <tr>
            <td className='border border-gray-300 px-4 py-2'>Rank</td>
            <td className='border border-gray-300 px-4 py-2'>{friendDetails?.rank}</td>
            <td className='border border-gray-300 px-4 py-2'>{myDetails?.rank}</td>
          </tr>
        </tbody>
      </table>
      <h1 className='my-7 text-blue-700 font-bold text-xl underline'>Your Progress</h1>
      <ProgressBar number1={myDetails?.CFrating} number2={friendDetails?.CFrating}/>
      <h1 className='my-7 text-blue-700 font-bold text-xl underline'>Friend's progress</h1>
      <ProgressBar number1={friendDetails?.CFrating} number2={myDetails?.CFrating}/>
      <a href='/profile' className='mt-7 hover:scale-105'><Button variant='contained'>Go Back to Profile</Button></a>
    </div>
  )
}

export default Comparison