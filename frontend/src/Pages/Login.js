import React, { useState } from 'react';
import axios from 'axios';
import { redirect, useNavigate,  } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLoading,setIsLoading]= useState(false)
  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  

  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    try {
      const {data} = await axios.post('http://localhost:5000/api/user/login', formData, {
        withCredentials: true,
      });
      console.log(data)
      localStorage.setItem('user', data.user.username);
      toast.success(data.message)
      redirect('/')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
      <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <button disabled={isLoading} type="submit">Login</button>
    </form>
  );
};

export default Login;