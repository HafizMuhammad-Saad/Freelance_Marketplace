import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home: React.FC = () => {
  const [gigs, setGigs] = useState<any[]>([]);
  
 
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/gigs`);
        setGigs(response.data);
      } catch (err) {
        console.error('Error fetching gigs:', err);
      }
    };

    fetchGigs();
  }, []);

 
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Freelance Marketplace</h1>
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Signup
            </Link>
          </div>
        </div>
      </nav>

      <div className="bg-blue-600 text-white py-16 mb-8">
  <div className="container mx-auto text-center">
    <h1 className="text-4xl font-bold mb-4">Find the Best Freelancers</h1>
    <p className="text-lg mb-6">Hire skilled professionals for your projects or showcase your skills.</p>
    <Link
      to="/signup"
      className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
    >
      Get Started
    </Link>
  </div>
</div>

      {/* Gigs Section */}
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Gigs</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{gig.title}</h2>
              <p className="text-gray-600 mb-4">{gig.description}</p>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-800 font-medium">${gig.price}</p>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {gig.category}
                </span>
              </div>
              <Link
                to={`/gig/${gig._id}`} // Add a link to view gig details (optional)
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-center block hover:bg-blue-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;