import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'


const ProtectRoute = ({ element, user, redirect = '/login' }) => {
  // console.log(user, element);
  if (!user) {
    return <Navigate to={redirect} />;
  }
  return element ? element : <Outlet />;
}

export default ProtectRoute

// React Navigate helps to navigate between sites.
//React Outlet is a component provided by React Router that serves as a placeholder for child routes within a parent route. It is a safe practice.