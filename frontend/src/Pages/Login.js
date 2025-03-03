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
    window.location.reload()
  };

  return (
    <div className=' min-h-[70vh] border-double border-8 border-blue-700 flex flex-col items-center justify-center gap-4 p-4 mt-24' style={{
      backgroundImage: `linear-gradient(45deg, #5514B4, #FF80FF)`
    }}>
      <h1 className='text-white font-bold underline text-4xl'>LOGIN</h1>
      <form onSubmit={handleSubmit} className='p-10 flex flex-col items-center justify-center gap-4'>
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input 
          type="text" 
          placeholder="Username" 
          value={formData.username} 
          onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
          className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button 
          disabled={isLoading} 
          type="submit" 
          className='w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 border-white border-2 hover:scale-105' 
        >
          Login
        </button>
      </form>
      <a href={'/register'}><p className='text-white font-bold hover:scale-105'>New registration? Sign-up</p></a>
    </div>
  );
};

export default Login;