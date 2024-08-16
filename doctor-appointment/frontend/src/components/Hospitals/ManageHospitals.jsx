import  { useState, useContext, useEffect } from 'react';
import { addHospital, updateHospital, deleteHospital } from './Hospital';
import { AuthContext } from '../../context/AuthContext';
import HashLoader from 'react-spinners/HashLoader';
import { BASE_URL } from '../../config';



const ManageHospitals = () => {
  const { token, role } = useContext(AuthContext);
  const [hospitalData, setHospitalData] = useState({ hospitalName: '', location: '', departments: [] });
  const [hospitalId, setHospitalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hospitals, setHospitals] = useState([]);

  const [editingHospitalId, setEditingHospitalId] = useState(null);

  useEffect(() => {
    if (role === 'admin') {
      const fetchHospitals = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/hospitals`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await response.json();
          setHospitals(result.data);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch hospitals:', error);
          setLoading(false);
        }
      };

      fetchHospitals();
    }
  }, [token, role]);

  const handleAddHospital = async () => {
    setLoading(true);
    try {
      const result = await addHospital(hospitalData, token);
      setMessage('Hospital added successfully.');
      setHospitals([...hospitals, result.data]); // Update the list with the new hospital
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage('Failed to add hospital.');
      console.error(error.message);
    }
  };

  const handleUpdateHospital = async () => {
    setLoading(true);
    try {
      const result = await updateHospital(editingHospitalId, hospitalData, token);
      setMessage('Hospital updated successfully.');
      setHospitals(hospitals.map(h => (h._id === editingHospitalId ? result.data : h))); // Update the hospital in the list
      setLoading(false);
      setEditingHospitalId(null);
      setHospitalData({ hospitalName: '', location: '', departments: [] });
    } catch (error) {
      setLoading(false);
      setMessage('Failed to update hospital.');
      console.error(error.message);
    }
  };

  const handleDeleteHospital = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;
    setLoading(true);
    try {
      await deleteHospital(id, token);
      setMessage('Hospital deleted successfully.');
      setHospitals(hospitals.filter(h => h._id !== id)); // Remove the deleted hospital from the list
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage('Failed to delete hospital.');
      console.error(error.message);
    }
  };

  const handleEditClick = (hospital) => {
    setEditingHospitalId(hospital._id);
    setHospitalData({
      hospitalName: hospital.hospitalName,
      location: hospital.location,
      departments: hospital.departments.join(','),
    });
  };

  if (role !== 'admin') {
    return <div className="text-red-500 text-lg">Access Denied. Only admins can manage hospitals.</div>;
  }

  return (
    <section className="max-w-[1170px] px-5 mx-auto">
      <h2 className="text-3xl font-bold my-6">Manage Hospitals</h2>
      
      {loading && (
        <div className="flex items-center justify-center w-full h-full">
          <HashLoader color="#0067FF" />
        </div>
      )}

      {message && <div className="text-lg text-green-500 mb-4">{message}</div>}

      {!loading && (
        <>
          <div className="grid lg:grid-cols-2 gap-[30px] lg:gap-[50px]">
            <div className="mb-6">
              <input
                type="text"
                className="border p-3 rounded-md mb-4 w-full"
                placeholder="Hospital Name"
                value={hospitalData.hospitalName}
                onChange={(e) => setHospitalData({ ...hospitalData, hospitalName: e.target.value })}
              />
              <input
                type="text"
                className="border p-3 rounded-md mb-4 w-full"
                placeholder="Location"
                value={hospitalData.location}
                onChange={(e) => setHospitalData({ ...hospitalData, location: e.target.value })}
              />
              <input
                type="text"
                className="border p-3 rounded-md mb-4 w-full"
                placeholder="Departments (comma separated)"
                value={hospitalData.departments}
                onChange={(e) => setHospitalData({ ...hospitalData, departments: e.target.value.split(',') })}
              />
              {editingHospitalId ? (
                <button 
                  className="bg-yellow-500 text-white py-2 px-4 rounded-md mt-3 mr-3 hover:bg-yellow-600"
                  onClick={handleUpdateHospital}
                >
                  Update Hospital
                </button>
              ) : (
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mt-3 mr-3 hover:bg-blue-600"
                  onClick={handleAddHospital}
                >
                  Add Hospital
                </button>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">List of Hospitals</h3>
            {hospitals.length > 0 ? (
              <ul className="list-disc ml-6">
                {hospitals.map((hospital) => (
                  <li key={hospital._id} className="mb-2 flex items-center justify-between">
                    <div>
                      <strong>{hospital.hospitalName}</strong> - {hospital.location} ({hospital.departments.join(', ')})
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600"
                        onClick={() => handleEditClick(hospital)}
                      >
                        Update
                      </button>
                      <button 
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                        onClick={() => handleDeleteHospital(hospital._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-500">No hospitals available.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default ManageHospitals;