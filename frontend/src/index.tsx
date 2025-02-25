// import React from 'react';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// import { fetchGigs } from './api';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Fetch all gigs
export const fetchGigs = async () => {
  const response = await axios.get(`${API_URL}/gigs`);
  return response.data;
};

// Login user
export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

// Create a gig
export const createGig = async (gigData: {
  title: string;
  description: string;
  price: number;
  category: string;
}) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/gigs`, gigData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


const Home: React.FC = () => {
  const [gigs, setGigs] = useState<any[]>([]);

  useEffect(() => {
    const loadGigs = async () => {
      const gigs = await fetchGigs();
      setGigs(gigs);
    };
    loadGigs();
  }, []);

  return (
    <div>
      <h1>Gigs</h1>
      <ul>
        {gigs.map((gig) => (
          <li key={gig._id}>
            <h2>{gig.title}</h2>
            <p>{gig.description}</p>
            <p>Price: ${gig.price}</p>
            <p>Category: {gig.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
