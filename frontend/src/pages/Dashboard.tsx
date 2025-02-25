
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon

import GigForm from '../components/GigForm';

const Dashboard: React.FC = () => {
  
  const [userRole, setUserRole] = useState<string>('');
  const [gigs, setGigs] = useState<any[]>([]);
  const [editingGig, setEditingGig] = useState<any>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.role);
      } catch (err) {
        console.error('Error fetching user role:', err);
      }
    };
    fetchUserRole();
  }, []);


  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/gigs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGigs(response.data);
      } catch (err) {
        console.error('Error fetching gigs:', err);
      }
    };
    fetchGigs();
  }, []);

  // const handleWhatsAppClick = (whatsappNumber: string, gigTitle: string) => {
  //   const message = `Hi, I'm interested in your gig: ${gigTitle}`;
  //   const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  //   window.open(whatsappLink, '_blank');
  // };

  const handleCreateGig = async (gigData: {
    title: string;
    description: string;
    price: number;
    category: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/gigs`, gigData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGigs([...gigs, response.data]);
    } catch (err) {
      console.error('Error creating gig:', err);
    }
  };

  
  const handleUpdateGig = async (gigData: {
    title: string;
    description: string;
    price: number;
    category: string;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/gigs/${editingGig._id}`,
        gigData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGigs(gigs.map((gig) => (gig._id === editingGig._id ? response.data : gig)));
      setEditingGig(null); // Clear the editing state
    } catch (err) {
      console.error('Error updating gig:', err);
    }
  };


  const handleDeleteGig = async (gigId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/gigs/${gigId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGigs(gigs.filter((gig) => gig._id !== gigId));
    } catch (err) {
      console.error('Error deleting gig:', err);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Gig Form (for freelancers) */}
        {userRole === 'freelancer' && (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {editingGig ? 'Edit Gig' : 'Create a New Gig'}
            </h2>
            <GigForm
              initialData={editingGig}
              onSubmit={editingGig ? handleUpdateGig : handleCreateGig}
            />
          </div>
        )}

        {/* Gig List */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {userRole === 'freelancer' ? 'Your Gigs' : 'Available Gigs'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="border border-gray-200 p-6 rounded-lg hover:shadow-xl transition-shadow bg-white"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{gig.title}</h3>
                <p className="text-gray-600 mb-4">{gig.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-800 font-medium">${gig.price}</p>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {gig.category}
                  </span>
                </div>

                 {/* WhatsApp Button (for clients)
              {userRole === 'client' && gig.postedBy?.whatsappNumber && (
                <button
                  onClick={() => handleWhatsAppClick(gig.postedBy.whatsappNumber, gig.title)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <FaWhatsapp className="mr-2" /> Contact via WhatsApp
                </button>
              )} */}


                {/* Edit/Delete Buttons (for freelancers) */}
                {userRole === 'freelancer' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingGig(gig)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGig(gig._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex-1"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;