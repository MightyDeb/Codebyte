import React, { useEffect, useState } from "react";
import axios from "axios";

function ProblemList() {
  const username= localStorage.getItem("user")
  const [allProblems,setAllProblems]= useState([])
  const [problemTag, setProblemTag] = useState("");
  const [problemRating, setProblemRating] = useState(800);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [solvedProblems, setSolvedProblems] = useState([]);

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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Codeforces Problem Search</h1>
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

      <div style={{ marginTop: "20px" }}>
        {problems.slice(0,50).map((problem, index) => {
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
      </div>
      <br/>
      <h1>Codeforces Problems Set</h1>
      <div style={{ marginTop: "20px" }}>
        {allProblems.length===0 && <p>Loading...</p>}
        {allProblems.map((problem, index) => {
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
      </div>
    </div>
  );
}

export default ProblemList;