import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/utils/Header";

function App({socket}) {
  const user= localStorage.getItem("user")
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [userDetails, setUserDetails] = useState(null);

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
  
  
  const addFriend= async()=>{  
    socket.emit("friendRequest", {sender: user, receiver: userDetails.handle})
  }

  return (
    
    <div className="App" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      
      <h1>Search User</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Codeforces username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button
          onClick={searchUser}
          disabled={loadingUser}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {loadingUser ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userDetails && (
        <div style={{ marginTop: "20px" }}>
          <h2>User Details:</h2>
          <p>
            <strong>Handle:</strong> {userDetails.handle}
          </p>
          <p>
            <strong>Rating:</strong> {userDetails.rating || "N/A"}
          </p>
          <p>
            <strong>Rank:</strong> {userDetails.rank || "N/A"}
          </p>
          <p>
            <strong>Max Rating:</strong> {userDetails.maxRating || "N/A"}
          </p>
          <p>
            <strong>Max Rank:</strong> {userDetails.maxRank || "N/A"}
          </p>
          <p>
            <strong>Contribution:</strong> {userDetails.contribution || "N/A"}
          </p>
          <p>
            <strong>Last Online:</strong>{" "}
            {new Date(userDetails.lastOnlineTimeSeconds * 1000).toLocaleString()}
          </p>
          <p>
            <strong>Registered:</strong>{" "}
            {new Date(userDetails.registrationTimeSeconds * 1000).toLocaleString()}
          </p>
          <button type="submit" onClick={addFriend}>Add to friend</button>
        </div>
      )}
      <br/>
      <h1>Codeforces Leaderboard</h1>

      {loadingLeaderboard && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Rank</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Handle</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Rating</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Max Rating</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Rank</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard?.map((user, index) => (
            <tr key={user.handle} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px", textAlign: "center" }}>{index + 1}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{user.handle}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{user.rating}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{user.maxRating}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{user.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;