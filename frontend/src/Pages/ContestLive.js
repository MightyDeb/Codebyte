import { Button, Checkbox } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { redirect, useParams } from 'react-router-dom'
import { CheckCheck, CheckCheckIcon } from 'lucide-react';


const ContestLive = () => {
  const user= localStorage.getItem('user')
  
  const {id}= useParams()
  const [time,setTime]= useState(0)
  const intervalRef= useRef(null)
  const [isRunning,setIsRunning]= useState(false)
  const [penaltyM,setPenaltyM]= useState(0)
  const [solved,setSolved]= useState([])
  const [contestData,setContestData]=useState(null)
  const [creatorData,setCreatorData]= useState(null)
  const [participantData,setParticipantData]= useState(null)
  const [show,setShow]= useState( false)
  useEffect(()=>{
    let isMounted= true
    async function fetchData(){
      try {
        const response= await axios.get(`http://localhost:5000/api/contest/details/${id}`, { withCredentials: true });
        console.log(response.data)
        if(isMounted){
          setContestData(response.data.contest)
          
        }
      } catch (error) {
        console.log(error)
      }  
    }
    fetchData()
    return () => {
      isMounted = false;
    };
  },[id])
  useEffect(()=>{
    let isMounted= true
    async function fetchData(){
      try {
        if(contestData){
          const responseCreator= await axios.get(`http://localhost:5000/api/user/getDetails/${contestData.creator}`, { withCredentials: true });
          const responseParticipant= await axios.get(`http://localhost:5000/api/contest/sortedParticipants/${id}`)
          
          if(isMounted){
            setCreatorData({
              name: responseCreator.data.name,
              username: responseCreator.data.username
            })
            setParticipantData(responseParticipant.data.sortedParticipants)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData() 
    return () => {
      isMounted = false;
    };
  },[contestData])

  const formatTime= (time)=>{
    
    let x=time;
    const hour= String(Math.floor(x/3600)).padStart(2,'0')
    x-=Math.floor(x/3600)*3600
    const min= String(Math.floor(x/60)).padStart(2,'0')
    x-=Math.floor(x/60)*60
    const sec= String(Math.floor(x)).padStart(2,'0')
    return `${hour} : ${min} : ${sec}`
  }


  const [f,setF]= useState(1)
  
  useEffect(()=>{
    if(f){
      axios.get(`http://localhost:5000/api/contest/details/${id}`, { withCredentials: true })
      .then(res=> setTime(res.data.contest.duration*60))
      .catch(err=> console.log(err))
      setF(0)
    }
    if(isRunning && time > 0){
      intervalRef.current= setInterval(()=>{
        setTime(prev=> prev-1)
      },1000)
    }else if(isRunning && time===0){
      clearInterval(intervalRef.current)
      setIsRunning(false)
      alert("Your time is up")
      handleSubmission()
    }
    return ()=> clearInterval(intervalRef.current)
  },[isRunning,time])

  

  const isParticipant= (user)=>{
    console.log(contestData?.registrations)
    const array= contestData?.registrations.map((user)=> user.username)
    
    return array?.includes(user)
  }
  

  const handleStartContest= ()=>{  
      setShow(true)
      setIsRunning(prev=> !prev)
  }

  const handlePenalty= async(submissions)=>{
    let pen=0;
    let solved= []
    try {
      const res= await axios.get(`http://localhost:5000/api/contest/details/${id}`, { withCredentials: true })
      const problemList= res.data.contest.problems.map((i)=>{
        return{
          contestId: i.contestId,
          index: i.index
        }
      })
      
      for(let i of problemList){
        for(let j of submissions){
          
          if(j.problemId.toString()===i.contestId && j.problemIndex===i.index){
            console.log('matched')
            if(j.verdict=='OK'){
              
              solved.push({
                contestId: i.contestId,
                index: i.index
              })
              pen+=j.timeTakenMinutes
            }else{
              pen+=10
            }
          break;
          }
        }
      }
      return ()=>{
        setPenaltyM(pen)
        setSolved(solved)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleSubmission= async()=>{
    try {
      const response= await axios.get(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=10`)  
      
      const submissions= response.data.result.filter((submission) => submission.author.participantType === "PRACTICE")
      .map((submission) => {
        const contestStartTime = new Date(submission.creationTimeSeconds) ;
        const submissionTime = new Date(submission.relativeTimeSeconds);
        const timeTakenMinutes = Math.abs(submissionTime.getMinutes()-contestStartTime.getMinutes()) ;
        return {
          problemId: submission.problem.contestId,
          problemIndex: submission.problem.index,
          timeTakenMinutes: timeTakenMinutes,
          verdict: submission.verdict
        };
      });
      handlePenalty(submissions)
      console.log(penaltyM,"g")
      const formData= {penalty: penaltyM,
        problemsSolved: solved ? solved.map((i)=>{
          return{
            contestId: i.contestId,
            index: i.index
          }
        }) : []
      }
      await axios.put(`http://localhost:5000/api/contest/attempt/${id}`, 
        formData, { withCredentials: true }
      ).catch(err=> console.log(err))
    } catch (error) {
      console.log(error)
    }
  }

  const handleEarlySubmission= ()=>{
    setTime(0)
    setIsRunning(false)
    handleSubmission()
   
  }

  return (
    <div className='min-h-[70vh] flex flex-col items-center justify-center gap-7 p-4 mt-24'>
      <div className='mt-0 text-center'>
        <h1 className='text-3xl md:text-5xl font-bold border-b-2 border-black mb-3'>CONTEST PAGE - : <span className='text-red-500'>{!isParticipant(user) ? "LIVE" : "OVER"}</span></h1>
        {(!contestData || !creatorData) && <p className='font-extrabold '>Loading details...</p>}
        {(contestData && creatorData) &&
        <div className='font-mono border-solid border-black border-2 p-2 text-l md:text-xl hover:scale-105'>
          <p>{creatorData.name}({creatorData.username})</p>
          <p className='underline'>{Math.floor(contestData?.duration/60)} hours and {contestData?.duration%60} minutes</p>
          <p>Attempts:-  {contestData?.registrations.length}</p>
        </div>
        }
      </div>
      <div>
        {!isParticipant(user) && <Button variant='contained' color='error' onClick={handleStartContest} disabled={show} sx={{ "&:hover": {
          transform: "scale(1.2)", 
          transition: "transform 0.3s ease-in-out", 
        }, margin: "2rem"}}>Attempt Contest Now</Button>}
        {isParticipant(user) &&
        <div className='bg-blue-700 text-white text-center rounded-3xl p-3 font-semibold mb-7'>
          <h1 className='text-xl border-b-2 mb-3 font-bold '>Your Analysis</h1>
          <p>No. of questions solved: {contestData?.registrations.includes({username: user}).problemsSolved?.length || 0}</p>
          <p>Questions:</p>
          {contestData?.registrations.includes({username: user}).problemsSolved?.map((i,index)=>{
            <p id={`${index}`}>{i.contestId} {i.index}</p>
          })}
          <p>Penalty: {contestData?.registrations.includes({username: user}).penalty || 0}</p>
        </div>}
        {isParticipant(user) && 
        <div className='bg-sky-300 p-1 flex flex-col justify-center items-center '>
          <h1 className='my-3 font-serif font-bold text-xl border-b-2 border-black'>Contest Leaderboard</h1>
          <table style={{ width: "90vw", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#2563eb", color: "white" }}>
            <th style={{ padding: "5px", border: "1px solid #ddd" }}>Rank</th>
            <th style={{ padding: "5px", border: "1px solid #ddd" }}>Handle</th>
            <th style={{ padding: "5px", border: "1px solid #ddd" }}>Question Solved</th>
          </tr>
        </thead>
        <tbody>
          {
            participantData?.map((user,index)=>{
              
              return(
              <tr key={index} style={{ borderBottom: "1px solid #ddd", fontWeight: 500 }}>
                <td style={{ padding: "10px", textAlign: "center" }}>{index+1}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>{user.username}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>{
                  user.problemsSolved?.map((i,x)=>(
                    <p id={`${x}`}>
                      <a href={`https://codeforces.com/problemset/problem/${i.contestId}/${i.index}`}
                      target="_blank">{i.contestId}-{i.index}</a>
                    </p>
                  ))
                  }</td>
              </tr>)
            })
          }
          </tbody>
          </table>
        </div>
        }
        
        {show && 
        <div className='shadow-xl p-4 bg-yellow-300 bg-opacity-40 text-center font-mono text-xl font-bold'>
          {contestData?.problems.map((problem,index)=>{
          
          return(
            
              <p className='hover:text-blue-900 hover:scale-104'><a id={`${index}`} href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`} target="_blank">
              Problem No. {index+1} &emsp; {problem.contestId}-{problem.index}
              </a>
              
              </p>
            
          )
        })}
        </div>
        }
        {show &&  <div className='text-center w-[95vw] mt-10 flex flex-col items-center'>
        <p className='mb-5 font-mono font-extrabold text-3xl bg-black max-w-fit text-white px-3 '>{formatTime(time)}</p>
        <Button variant='contained' color="success" onClick={handleEarlySubmission} sx={{ "&:hover": {
          transform: "scale(1.2)", 
          transition: "transform 0.3s ease-in-out", 
        }, margin: "2rem"}}>SUBMIT</Button></div>}
      </div>
    </div>
  )
}

export default ContestLive

//local and global variables are not matching , use state problem, solved and penalty not being updated in useState
//refresh page after auto-sumit/submit
