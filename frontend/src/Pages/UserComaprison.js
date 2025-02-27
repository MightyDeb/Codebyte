import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserComparison = () => {
  const { user1, user2 } = useParams();
  const [user1Data, setUser1Data] = useState(null);
  const [user2Data, setUser2Data] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data for both users
    const fetchData = async () => {
      try {
        // Fetch user info
        const userInfoResponse = await axios.get(`http://localhost:5000/api/users/${user1}/${user2}`);
        setUser1Data(userInfoResponse.data[0]);
        setUser2Data(userInfoResponse.data[1]);

        // Fetch additional data (rating, submissions, etc.)
        const user1RatingResponse = await axios.get(`http://localhost:5000/api/user/${user1}/rating`);
        const user2RatingResponse = await axios.get(`http://localhost:5000/api/user/${user2}/rating`);
        const user1SubmissionsResponse = await axios.get(`http://localhost:5000/api/user/${user1}/submissions`);
        const user2SubmissionsResponse = await axios.get(`http://localhost:5000/api/user/${user2}/submissions`);

        setUser1Data(prev => ({ ...prev, rating: user1RatingResponse.data, submissions: user1SubmissionsResponse.data }));
        setUser2Data(prev => ({ ...prev, rating: user2RatingResponse.data, submissions: user2SubmissionsResponse.data }));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user1, user2]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user1Data || !user2Data) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>User Comparison</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h2>{user1Data.handle}</h2>
          <p>Rating: {user1Data.rating}</p>
          <p>Max Rating: {user1Data.maxRating}</p>
          <p>Solved Problems: {user1Data.submissions.filter(s => s.verdict === 'OK').length}</p>
        </div>
        <div>
          <h2>{user2Data.handle}</h2>
          <p>Rating: {user2Data.rating}</p>
          <p>Max Rating: {user2Data.maxRating}</p>
          <p>Solved Problems: {user2Data.submissions.filter(s => s.verdict === 'OK').length}</p>
        </div>
      </div>
    </div>
  );
};

export default UserComparison;