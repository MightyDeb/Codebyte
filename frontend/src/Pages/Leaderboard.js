import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import pagination from "../components/utils/pagination";
import { Boxes, Search } from "lucide-react";


function App({socket}) {
  const user= localStorage.getItem("user")
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [paginatedLeaderboard,setPaginatedLeaderboard]= useState([])
  const [currentPage,setCurrentPage]= useState(1)
  const [totalPages,setTotalPages]= useState(1)

  const searchUser = async () => {
    if (!username.trim()) {
      setError("Please enter a Codeforces username.");
      return;
    }

    setLoadingUser(true);
    setError("");

    try {
      const response = await axios.get(
        `https://codeforces.com/api/user.info?handles=${username}`
      );

      if (response?.data.status === "OK") {
        setUserDetails(response.data.result[0]);
      } else {
        setError("User not found.");
      }
    } catch (err) {
      setError("An error occurred while fetching user details.");
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  }

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    setError("");
  
    try {
      const response = await axios.get("http://localhost:5000/api/leaderboard")
      .catch(e=> setError(e))
      const sortedUsers = response.data.result.sort((a, b) => b.rating - a.rating).slice(0,1000);
      setLeaderboard(sortedUsers);
    } catch (err) {
      setError("An error occurred while fetching the leaderboard.");
      console.error(err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);
  
  
  useEffect(()=>{
    setPaginatedLeaderboard(pagination({
      data: leaderboard, itemsPerPage: 10, start:(currentPage - 1) * 10
    }))
    setTotalPages(Math.ceil(leaderboard.length / 10))
    console.log(paginatedLeaderboard)
  },[leaderboard,currentPage])

  const addFriend= async()=>{  
    socket.emit("friendRequest", {sender: user, receiver: userDetails.handle})
  }

  const paginationHandle=()=>{
    setCurrentPage(prev=> prev===totalPages ? 1 : prev+1)
  }
  const paginationHandle2=()=>{
    setCurrentPage(prev=> prev===1 ? totalPages : prev-1)
  }

  return (
    <div className='min-h-[70vh] flex flex-col items-center justify-center gap-7 p-4 mt-24'>
      <h1 className="mt-2 text-2xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700 flex gap-2">
        Search User <Search/>
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-5">
        <input
          type="text"
          placeholder="Enter Codeforces username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 w-72 mr-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={searchUser}
          disabled={loadingUser}
          className="p-2 px-4 bg-blue-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 hover:scale-105"
        >
          {loadingUser ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p style={{ color: "red", fontWeight: 700 }}>{error}</p>}

      {userDetails && (
        <div className='flex flex-col items-center justify-center gap-5 border-double border-4 p-3 md:p-5 border-blue-950 bg-yellow-400 rounded-lg shadow-lg pb-7'>
          <h3 className='uppercase font-extrabold text-4xl hover:animate-bounce border-b-2 border-black'>User Details</h3>
          <p>
            <strong className='underline font-mono'>Handle:</strong> {userDetails.handle}
          </p>
          <p>
            <strong className='underline font-mono'>Rating:</strong> {userDetails.rating || "N/A"}
          </p>
          <p>
            <strong className='underline font-mono'>Rank:</strong> {userDetails.rank || "N/A"}
          </p>
          <p>
            <strong className='underline font-mono'>Max Rating:</strong> {userDetails.maxRating || "N/A"}
          </p>
          <p>
            <strong className='underline font-mono'>Max Rank:</strong> {userDetails.maxRank || "N/A"}
          </p>
          <p>
            <strong className='underline font-mono'>Contribution:</strong> {userDetails.contribution || "N/A"}
          </p>
          <p>
            <strong className='underline font-mono'>Last Online:</strong>{" "}
            {new Date(userDetails.lastOnlineTimeSeconds * 1000).toLocaleString()}
          </p>
          <p>
            <strong className='underline font-mono'>Registered:</strong>{" "}
            {new Date(userDetails.registrationTimeSeconds * 1000).toLocaleString()}
          </p>
          <Button variant="contained" type="submit" onClick={addFriend}>Add to Friend</Button>
        </div>
      )}
      <br/>
      <h1 className='mt-2 text-xl md:text-4xl font-bold text-blue-700 border-b-4 border-blue-700 flex gap-2'>Codeforces Leaderboard <Boxes/></h1>

      {loadingLeaderboard && <p>Loading...</p>}

      <table style={{ width: "98vw", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#2563eb", color: "white" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Rank</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Handle</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Rating</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }} className="hidden md:table-cell">Max Rating</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }} className="hidden md:table-cell">Position</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLeaderboard?.map((user, index) => (
              <tr key={user.handle} style={{ borderBottom: "1px solid #ddd", fontWeight: 500 }}>
                <td style={{ padding: "10px", textAlign: "center" }}>{(currentPage-1)*10+ index+ 1}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>{user.handle}</td>
                <td style={{ padding: "10px", textAlign: "center" }}>{user.rating}</td>
                <td style={{ padding: "10px", textAlign: "center" }} className="hidden md:table-cell">{user.maxRating}</td>
                <td style={{ padding: "10px", textAlign: "center" }} className="hidden md:table-cell">{user.rank}</td>
              </tr>
            )
          )} 
        </tbody>
      </table>
      <div className="flex w-[100vw] justify-evenly">
        <Button variant="text" onClick={paginationHandle} sx={{
          border: "solid 2px", fontWeight: 900
        }}>NEXT ||</Button>
        <Button variant="text" sx={{
          border: "solid 2px", fontWeight: 900
        }} onClick={paginationHandle2}> || Previous</Button>
      </div>
    </div>
  );
}

export default App;