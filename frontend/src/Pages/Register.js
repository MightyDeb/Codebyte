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
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      {}
      <br/>
      <input type="text" placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
      <br/>
      <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <br/>
      <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <br/>
      <button disabled={isLoading} type="submit">Register</button>
    </form>
  );
};

export default Register;