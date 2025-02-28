import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MashupMaker = () => {
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
          console.log(contestsList)
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
  }

  return (
    <div>
      <h2>Selected Problems</h2>
      <ul>
        {selectedProblems?.map((problem, index) => (
          <li key={index}>
            {problem.name} (Contest ID: {problem.contestId}, Index: {problem.index})
          </li>
        ))}
      </ul>
      <button onClick={()=>{
          setShow(true)
         console.log(selectedProblems)}}>CREATE CONTEST</button>
      {show &&
        <form>
          <input type="number" placeholder="Set duration in minutes"  value={duration} onChange={(e) => setDuration(e.target.value)}/>
          <button type="submit" onClick={createContest}>FINALISE</button>
        </form>
      }
      <br/>
      <h1>Show previous contest</h1>
      {previousContest && previousContest.length>0 && previousContest.map((contest,index)=>{
        return(
          <div>
            <p>ContestNo: {index+1}</p>
            <p>Problem List</p>
            {contest.problems?.map((i)=>(
              <p>
                {i.contestId}-{i.index}
              </p>
            ))}
            <p>No. of registrations: {contest.registrations.length}</p>
          </div>
        )
      })}
      <h1>Find a problem</h1>
      <div>
        <input
          type="text"
          placeholder="Enter problem tag"
          value={problemTag}
          onChange={(e) => setProblemTag(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Enter problem rating"
          value={problemRating}
          onChange={(e) => setProblemRating(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
          min="800"
          max="3500"
        />
        <button
          onClick={searchProblem}
          disabled={loading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {problems.map((problem, index) => (
            <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
              <input
              type="checkbox"
              checked={selectedProblems.includes(problem)}
              onChange={() => handleProblemSelect(problem)}
            />
              <span>{problem.name} (Rating: {problem.rating || 'unrated'})</span>
            </div>
          ))}
      </div>
      
      <br/>
      <h1>Select Problems for Mashup</h1>
      <div>
        {allProblems.map((problem, index) => (
          <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <input
              type="checkbox"
              checked={selectedProblems.includes(problem)}
              onChange={() => handleProblemSelect(problem)}
            />
            <span>{problem.name} (Rating: {problem.rating || 'unrated'})</span>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default MashupMaker;