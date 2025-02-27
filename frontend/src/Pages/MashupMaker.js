import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MashupMaker = () => {
  const [allProblems, setAllProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [problemTag, setProblemTag] = useState("");
  const [problemRating, setProblemRating] = useState(800);
  const [problems,setProblems]= useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    // Fetch problems from the backend
    axios.get("https://codeforces.com/api/problemset.problems")
    .then(response=> setAllProblems( response.data.result.problems))
    .catch((error) => {
      console.error(error); })
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
            problem.tags.includes(problemTag.toLowerCase())
          ) : allProblems.filter((problem) =>
            problem.tags.includes(problemTag.toLowerCase()));
        }
        if(problemRating){
          filteredProblems = filteredProblems.length>0 ? filteredProblems.filter((problem) =>
            problem.rating===parseInt(problemRating, 10)
          ) : allProblems.filter((problem) =>
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