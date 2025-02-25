import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const GigDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the gig ID from the URL
  const [gig, setGig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGigDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/gigs/${id}`);
        setGig(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gig details:', err);
        setError('Failed to load gig details. Please try again later.');
        setLoading(false);
      }
    };

    fetchGigDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!gig) {
    return <div className="text-center py-8">Gig not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-8">
      <div className="container mx-auto">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          &larr; Back to Home
        </Link>
        <div className="bg-white p-8 rounded-lg shadow-lg mt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{gig.title}</h1>
          <p className="text-gray-600 mb-6">{gig.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-800 font-medium">Price: ${gig.price}</p>
              <p className="text-gray-800 font-medium">Category: {gig.category}</p>
            </div>
            <div>
              <p className="text-gray-800 font-medium">Posted By: {gig.postedBy?.name}</p>
              <p className="text-gray-800 font-medium">Email: {gig.postedBy?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;