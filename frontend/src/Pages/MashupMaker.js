import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../components/utils/Header';
import pagination from '../components/utils/pagination';
import { Button } from '@mui/material';

const MashupMaker = ({socket}) => {
  const username= localStorage.getItem("user")
  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [problemTag, setProblemTag] = useState("");
  const [problemRating, setProblemRating] = useState(800);
  const [problems,setProblems]= useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show,setShow]= useState(false)
  const [duration,setDuration]= useState(0)
  const [previousContest, setPreviousContests]= useState([])
  const [currentPageAllProblems,setCurrentPageAllProblems]= useState(1)
  const [totalPagesAllProblems,setTotalPagesAllProblems]= useState(1)
  const [paginatedAllProblems,setPaginatedAllProblems]= useState([])
  const [currentPageProblems,setCurrentPageProblems]= useState(1)
  const [totalPagesProblems,setTotalPagesProblems]= useState(1)
  const [paginatedProblems,setPaginatedProblems]= useState([])

  useEffect(() => {
    let isMounted= true;
    async function fetchData(){
      try {
        const problemsList= await axios.get(`https://codeforces.com/api/problemset.problems`)
        const contestsList= await axios.get('http://localhost:5000/api/contest/pastContests',{
          withCredentials: true,
        })
        if(isMounted){
          setAllProblems(problemsList.data.result.problems)
          setPreviousContests(contestsList.data.contestList)
          
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchData();
    return () => {
      isMounted=false
    }
  }, []);

  const handleProblemSelect = (problem) => {
    if (selectedProblems.includes(problem)) {
      setSelectedProblems(selectedProblems.filter(p => p !== problem));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const searchProblem = async () => {

    setLoading(true);
    setError("");
    

    try {
      
      const response = await axios.get(
        "https://codeforces.com/api/problemset.problems"
      );
      if (response.data.status === "OK") {
        setAllProblems( response.data.result.problems)
        let filteredProblems= []
        if(problemTag){
          filteredProblems = filteredProblems.length>0 ? filteredProblems.filter((problem) =>
            problem.tags.includes(problemTag.toLowerCase())) : allProblems.filter((problem) =>
            problem.tags.includes(problemTag.toLowerCase()));
        }
        if(problemRating){
          filteredProblems = filteredProblems.length>0 ? filteredProblems.filter((problem) =>
            problem.rating===parseInt(problemRating, 10)) : allProblems.filter((problem) =>
            problem.rating===parseInt(problemRating, 10));         
        }
        if (filteredProblems.length === 0) {
          setProblems(filteredProblems);
          setError("No problems found with the given details.");
        } else {
          setProblems(filteredProblems);
        }
        
      } else {
        setError("Failed to fetch data from Codeforces API.");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    setPaginatedAllProblems(pagination({
      data: allProblems, itemsPerPage: 10, start:(currentPageAllProblems - 1) * 10
    }))
    setTotalPagesAllProblems(Math.ceil(allProblems.length / 10))
  },[allProblems,currentPageAllProblems])

  useEffect(()=>{
    setPaginatedProblems(pagination({
      data: problems, itemsPerPage: 10, start:(currentPageProblems - 1) * 10
    }))
    setTotalPagesProblems(Math.ceil(problems.length / 10))
  },[problems,currentPageProblems])

  const paginationHandle=()=>{
    setCurrentPageAllProblems(prev=> prev===totalPagesAllProblems ? 1 : prev+1)
  }
  const paginationHandle2=()=>{
    setCurrentPageAllProblems(prev=> prev===1 ? totalPagesAllProblems : prev-1)
  }

  const paginationHandle3=()=>{
    setCurrentPageProblems(prev=> prev===totalPagesProblems ? 1 : prev+1)
  }
  const paginationHandle4=()=>{
    setCurrentPageProblems(prev=> prev===1 ? totalPagesProblems : prev-1)
  }

  const createContest= async(e)=>{
    e.preventDefault();
    const problems= selectedProblems.map((problem)=>(
      {
        contestId: problem.contestId, index: problem.index
      }
    ))
    const formData={
      problems,
      duration
    }
    try {
      const {data} = await axios.post('http://localhost:5000/api/contest/createContest', formData, {
        withCredentials: true,
      });
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    }
    //handle notifications
    socket.emit("newContest", {
      username, problems, duration
    })
  }

  return (
    <div className='min-h-[70vh] flex flex-col items-center justify-center gap-7 p-4 mt-24'>
      
      <h2 className="mt-10 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700">Selected Problems</h2>
      {selectedProblems.length===0 && 
      <p className='text-red-500 font-bold text-center'>NO QUESTIONS SELECTED</p>}
      <ul>
        {selectedProblems?.map((problem, index) => (
          <li key={index}>
            <a className='font-semibold'
              href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}>
                <span>{problem.name} (Rating: {problem.rating || 'unrated'}, Index: {problem.index})</span>
              </a>
            
          </li>
        ))}
      </ul>
      {selectedProblems.length>0 && <Button variant='contained' onClick={()=>{
          setShow(true)
        }}>CREATE CONTEST</Button>}
      
      {show &&
        <form className='flex flex-col md:flex-row items-center'>
          <label for="duration" className='font-semibold underline'>Enter duration in minutes</label>
          <input type="number" placeholder="Set duration in minutes"  value={duration} onChange={(e) => setDuration(e.target.value)} className='p-2 rounded-lg m-2'/>
          <Button variant='contained' type="submit" onClick={createContest} sx={{
            marginTop: '1rem'
          }}>FINALISE</Button>
          
        </form>
      }
      <br/>
      <h1 className="mt-10 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700">Show previous contest</h1>
      <p className='font-semibold font-mono md:text-xl'>Created by you..</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {previousContest && previousContest.length>0 && previousContest.map((contest,index)=>{
        return(
          <a href={`/contest/${contest._id}`}>
            <div className="bg-yellow-400 p-3 font-bold shadow-md border-5 border-black rounded-lg ">
          <p className='border-b-2 border-black'>ContestNo: {index+1}</p>
          <p>Problem List</p>
          {contest.problems?.map((i)=>(
            <p>
              {i.contestId}-{i.index}
            </p>
          ))}
          <p>No. of registrations: {contest.registrations.length}</p>
        </div>
        </a>
          
        )
      })}
      </div>
      <h1 className="mt-10 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700">Find a problem</h1>
      <div className="border-double border-4 border-blue-700 p-2 md:p-4 flex flex-col items-center">
      <label for="tag" className="underline font-semibold">Problem Tag</label><br/>
        <input
          type="text"
          placeholder="Enter problem tag"
          value={problemTag}
          onChange={(e) => setProblemTag(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        /><br/>
        <label for="rating" className="underline font-semibold">Problem Rating</label><br/>
        <input
        id="rating"
          type="number"
          placeholder="Enter problem rating"
          value={problemRating}
          onChange={(e) => setProblemRating(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
          min="800"
          max="3500"
        /><br/><br/>
        <Button
                  onClick={searchProblem}
                  disabled={loading}
                  variant="contained"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {paginatedProblems?.map((problem, index) => (
            <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
              <input className='mr-4'
              type="checkbox"
              checked={selectedProblems.includes(problem)}
              onChange={() => handleProblemSelect(problem)}
            />
            <a className='font-semibold'
              href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}>
                <span>{problem.name} (Rating: {problem.rating || 'unrated'})</span>
              </a>
            </div>
          ))}
          {paginatedProblems.length>0 &&
        <div className="flex w-[100vw] justify-evenly">
        <Button variant="text" onClick={paginationHandle3} sx={{
          border: "solid 2px", fontWeight: 900
        }}>NEXT ||</Button>
        <Button variant="text" sx={{
          border: "solid 2px", fontWeight: 900
        }} onClick={paginationHandle4}> || Previous</Button>
      </div>}
      </div>
      
      <br/>
      <h1 className="mt-10 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700">Select Problems for Mashup</h1>
      <div>
        {paginatedAllProblems?.map((problem, index) => (
          <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <input
              type="checkbox"
              checked={selectedProblems.includes(problem)}
              onChange={() => handleProblemSelect(problem)} className='mr-4'
            />
            <a className='font-semibold'
              href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}>
                <span>{problem.name} (Rating: {problem.rating || 'unrated'})</span>
              </a>
            
          </div>
        ))}
        <div className="flex w-[100vw] justify-evenly">
                        <Button variant="text" onClick={paginationHandle} sx={{
                          border: "solid 2px", fontWeight: 900
                        }}>NEXT ||</Button>
                        <Button variant="text" sx={{
                          border: "solid 2px", fontWeight: 900
                        }} onClick={paginationHandle2}> || Previous</Button>
                      </div>
      </div>
      
    </div>
  );
};

export default MashupMaker;