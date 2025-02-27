import React, { useState } from 'react';
import axios from 'axios';

const ProblemSolvers = () => {
  const [contestId, setContestId] = useState('');
  const [index, setIndex] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!contestId || !index) {
      setError('Please enter contest ID and problem index');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `http://localhost:5000/api/problem/${contestId}/${index}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching problem solvers:', error);
      setError('Failed to fetch problem solvers');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Find Users Who Solved a Problem</h1>
      <div>
        <input
          type="text"
          placeholder="Enter Contest ID"
          value={contestId}
          onChange={(e) => setContestId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Problem Index (e.g., A, B, C)"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users.length > 0 && (
        <div>
          <h2>Users who solved the problem:</h2>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProblemSolvers;