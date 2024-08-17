import React, { useEffect, useState } from 'react';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';

const BedsList = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeds = async () => {
      try {
        const res = await fetch(`${BASE_URL}/beds`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure the API is secured if needed
          },
        });
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message);
        }

        setBeds(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBeds();
  }, []); // Runs only once, on component mount

  if (loading) {
    return <p>Loading beds...</p>;
  }

  if (error) {
    return <p>Error loading beds: {error}</p>;
  }

  if (beds.length === 0) {
    return <p>No beds available at the moment.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Available Beds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beds.map((bed) => (
          <div
            key={bed._id}
            className={`bg-white shadow-md rounded-lg p-6 transform transition duration-500 hover:scale-105 ${
              bed.status === 'occupied' ? 'bg-red-200' : 'bg-green-200'
            }`}
          >
            <p className="text-lg font-semibold">
              <strong>Bed Number:</strong> {bed.bedNumber}
            </p>
            <p className="text-lg font-semibold">
              <strong>Department:</strong> {bed.department}
            </p>
            <p className="text-lg font-semibold">
              <strong>Status:</strong>
              <span
                className={`ml-2 py-1 px-3 rounded-full text-white ${
                  bed.status === 'occupied' ? 'bg-red-500' : 'bg-green-500'
                }`}
              >
                {bed.status === 'occupied' ? 'Occupied' : 'Available'}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BedsList;