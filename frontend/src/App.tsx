import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import GigDetails from './pages/GigDetails'; // Import the new component

import ProtectedRoute from './components/ProtectedRoute'; 
const App: React.FC = () => {

  return (
    
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gig/:id" element={<GigDetails />} /> {/* Add this route */}

        </Route>
      </Routes>
    </Router>
    
  );
  
};


export default App;