import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import pagination from "../components/utils/pagination";
import { Dumbbell, Search } from "lucide-react";

function ProblemList() {
  const username= localStorage.getItem("user")
  const [allProblems,setAllProblems]= useState([])
  const [problemTag, setProblemTag] = useState("");
  const [problemRating, setProblemRating] = useState(800);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [currentPageAllProblems,setCurrentPageAllProblems]= useState(1)
  const [totalPagesAllProblems,setTotalPagesAllProblems]= useState(1)
  const [paginatedAllProblems,setPaginatedAllProblems]= useState([])
  const [currentPageProblems,setCurrentPageProblems]= useState(1)
  const [totalPagesProblems,setTotalPagesProblems]= useState(1)
  const [paginatedProblems,setPaginatedProblems]= useState([])

  useEffect(()=>{
    axios.get("https://codeforces.com/api/problemset.problems")
    .then(response=> setAllProblems( response.data.result.problems))
    .catch((error) => {
      console.error(error); })
    axios.get(`https://codeforces.com/api/user.status?handle=${username}`)
    .then((response)=> {
      if (response.data.status === "OK") {
        const solved = [];
        response.data.result?.forEach((submission) => {
          if (submission.verdict === "OK") {
            const problem = submission.problem;
            solved.push(`${problem.contestId}-${problem.index}`); // Add to array
          }
        });
        setSolvedProblems(solved); 
      }
    }  )
  .catch((error) => {
    console.error(error);  })
},[])


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
        console.log(filteredProblems)
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

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 p-4 mt-24">
      <h1 className="mt-2 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700 flex gap-2">Codeforces Problem Search <Search/></h1>
      <div className="border-double border-4 border-blue-700 p-2 md:p-4 flex flex-col items-center">
        <label for="tag" className="underline font-semibold">Problem Tag</label><br/>
        <input
        id="tag"
          type="text"
          placeholder="Enter problem tag"
          value={problemTag}
          onChange={(e) => setProblemTag(e.target.value)}
          style={{ padding: "10px", width: "300px", margin: "10px" }}
        />
        <br/>
        <label for="rating" className="underline font-semibold">Problem Rating</label><br/>
        <input
          id="rating"
          type="number"
          placeholder="Enter problem rating"
          value={problemRating}
          onChange={(e) => setProblemRating(e.target.value)}
          style={{ padding: "10px", width: "300px", margin: "10px" }}
          
        />
        <br/><br/>
        <Button
          onClick={searchProblem}
          disabled={loading}
          variant="contained"
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <p style={{ color: "red", fontWeight: 700 }}>{error}</p>}

      

      <div className="mt-7 flex flex-col items-center justify-center">
        {paginatedProblems?.map((problem, index) => {
          const problemId = `${problem.contestId}-${problem.index}`;
          const isSolved = solvedProblems.includes(problemId);
          return(
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              backgroundColor: isSolved ? "#e0ffe0" : "#fff",
              fontWeight: 600,
              width: "90%"
            }}
          >
            <h3>{problem.name}</h3>
            <p>
              <strong>Problem ID:</strong> {problem.contestId}
              {problem.index}
            </p>
            <p>
              <strong>Tags:</strong> {problem.tags.join(", ")}
            </p>
            <p>
              <strong>Rating:</strong> {problem.rating}
            </p>
            <a
              href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "none" }}
            >
              View Problem
            </a>

          </div>
        )})}
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
      <a href={'/mashup'}><Button variant="contained" sx={{
        marginTop: '3rem'
      }}>Why not create a contest?</Button></a>
      <h1 className="mt-10 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700 flex gap-2">Codeforces Problems Set <Dumbbell/></h1>
      <div className="mt-20 flex flex-col items-center justify-center">
        {paginatedAllProblems?.length===0 && <p>Loading...</p>}
        {paginatedAllProblems?.map((problem, index) => {
          const problemId = `${problem.contestId}-${problem.index}`;
          const isSolved = solvedProblems.includes(problemId);
          return(
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              backgroundColor: isSolved ? "#e0ffe0" : "#fff",
              fontWeight: 600,
              width: "90%"
            }}
          >
            <h3>{problem.name}</h3>
            <p>
              <strong>Problem ID:</strong> {problem.contestId}
              {problem.index}
            </p>
            <p>
              <strong>Tags:</strong> {problem.tags.join(", ")}
            </p>
            <p>
              <strong>Rating:</strong> {problem.rating}
            </p>
            <a
              href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "none" }} className="underline"
            >
              View Problem
            </a>
          </div>
        )})
        }
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
}

export default ProblemList;