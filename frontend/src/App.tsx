import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; 
import Home from './pages/Home';
import './index.css'
import { verifyJwt } from './services/loginService';
const App: React.FC = () => {
  const [isAuthenticated,setIsauthenticated]=useState<boolean>(false)
  useEffect(()=>{
    (async()=>{
      const response= await verifyJwt()
      console.log({response});
      
      setIsauthenticated(response)
    })()
  },[isAuthenticated])
  return (
    <Router>
    <Routes>
      {/* <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} /> */}
      <Route
          path="/"
          element={
            isAuthenticated ? <Home setAuthenticated={setIsauthenticated}/> : <Login setAuthenticated={setIsauthenticated}/>
          }
        />
    </Routes>
  </Router>
  );
};

export default App;
