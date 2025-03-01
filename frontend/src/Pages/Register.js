import React, { useState } from 'react';
import axios from 'axios';
import { redirect } from 'react-router-dom';
import toast from 'react-hot-toast'

const Register = () => {
  const [isLoading,setIsLoading]= useState(false)
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });
  

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    try {
      const {data} = await axios.post('http://localhost:5000/api/user/register', formData, {
        withCredentials: true,
      });
      localStorage.setItem('user', data.user.username);
      toast.success(data.message)
      redirect('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
    window.location.reload()
  };

  return (
    <div className='border-double border-8 border-blue-700 flex flex-col items-center justify-center gap-4 p-4 mt-24'>
      <h1 className='text-blue-700 font-bold underline text-4xl'>REGISTER</h1>
      <form onSubmit={handleSubmit} className='p-10 flex flex-col items-center justify-center gap-4'>
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'/>
        <br/>
        <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'/>
        <br/>
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'/>
        <br/>
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'/>
        <br/>
        <button disabled={isLoading} type="submit" className='w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50'>Register</button>
      </form>
      <a href={'/login'}><p className='text-blue-700 font-bold hover:scale-105'>Already an user? Sign-in</p></a>
    </div>
    
  );
};

export default Register;