import  { useState, useContext, useEffect } from 'react';
import { addHospital, updateHospital, deleteHospital } from './Hospital';
import { AuthContext } from '../../context/AuthContext';
import HashLoader from 'react-spinners/HashLoader';
import { BASE_URL } from '../../config';

import uploadImageToCloudinary from '../../utils/uploadCloudinary';
import { assignPatientToHospital } from '../AssignPatientToHospital/hospitalAssignments';
import AssignPatientToBed from '../AssignPatientToHospital/AssignPatientToBed';

const ManageHospitals = () => {
  const { token, role, user } = useContext(AuthContext);
  const doctorId = user?._id;
  const [hospitalData, setHospitalData] = useState({ hospitalName: '', location: '', departments: [], photo: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [editingHospitalId, setEditingHospitalId] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const hospitalResponse = await fetch(`${BASE_URL}/hospitals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hospitalResult = await hospitalResponse.json();
        setHospitals(hospitalResult.data);

        if (role === 'doctor') {
          const url = `${BASE_URL}/bookings/doctors/${doctorId}/appointments`;
          const patientResponse = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const patientResult = await patientResponse.json();
          setPatients(patientResult.appointments || []);
        }

        const bedResponse = await fetch(`${BASE_URL}/beds`);
        const bedResult = await bedResponse.json();
        setBeds(bedResult.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setMessage('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, doctorId, role]);

  useEffect(() => {
    if (selectedHospitalId) {
      fetchBeds(selectedHospitalId);
    }
  }, [selectedHospitalId]);

  const fetchBeds = async (hospitalId) => {
    try {
      const response = await fetch(`${BASE_URL}/beds?hospitalId=${hospitalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setBeds(result.data.filter(bed => !bed.isOccupied)); 
      } else {
        console.error('Failed to fetch beds:', result.message);
      }
    } catch (error) {
      console.error('Failed to fetch beds:', error);
    }
  };

  const handleHospitalAction = async (action) => {
    setLoading(true);
    try {
      const result = await action();
      setMessage(`Hospital ${result.success ? 'successfully' : 'failed to'} ${action.name.split(/(?=[A-Z])/).pop().toLowerCase()}d.`);
      setHospitals(hospitals => {
        if (action.name === 'handleAddHospital') return [...hospitals, result.data];
        if (action.name === 'handleUpdateHospital') return hospitals.map(h => (h._id === editingHospitalId ? result.data : h));
        if (action.name === 'handleDeleteHospital') return hospitals.filter(h => h._id !== result.data._id);
        return hospitals;
      });
      if (action.name === 'handleUpdateHospital') resetHospitalData();
    } catch (error) {
      setMessage('Failed to process request.');
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHospital = async () => {
    return await addHospital(hospitalData, token);
  };

  const handleUpdateHospital = async () => {
    return await updateHospital(editingHospitalId, hospitalData, token);
  };

  const handleDeleteHospital = async (id) => {
    await deleteHospital(id, token);
    return { data: { _id: id } };
  };

  const resetHospitalData = () => {
    setEditingHospitalId(null);
    setHospitalData({ hospitalName: '', location: '', departments: [], photo: '' });
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    try {
      const data = await uploadImageToCloudinary(file);
      setHospitalData(prev => ({ ...prev, photo: data.url }));
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const handleAssignPatient = async () => {
    setLoading(true);
    try {
      await assignPatientToHospital(selectedBookingId, selectedHospitalId, selectedBedId, token); 
      setMessage('Patient successfully assigned to the hospital and bed.');
    } catch (error) {
      setMessage('Failed to assign patient to hospital and bed.');
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
          {role === 'admin' && (
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
                <input
                  type="file"
                  className="border p-3 rounded-md mb-4 w-full"
                  accept=".jpg,.png"
                  onChange={handleFileInputChange}
                />
                {hospitalData.photo && (
                  <img src={hospitalData.photo} alt="Hospital" className="w-[150px] h-[150px] rounded-md" />
                )}
                {editingHospitalId ? (
                  <button 
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md mt-3 mr-3 hover:bg-yellow-600"
                    onClick={() => handleHospitalAction(handleUpdateHospital)}
                  >
                    Update Hospital
                  </button>
                ) : (
                  <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded-md mt-3 mr-3 hover:bg-blue-600"
                    onClick={() => handleHospitalAction(handleAddHospital)}
                  >
                    Add Hospital
                  </button>
                )}
              </div>
            </div>
          )}

          {role === 'doctor' && (
            <div className="mt-10">
              <h3 className="text-2xl font-bold mb-4">Assign Patient to Hospital</h3>
              <div className="mb-4">
                <select
                  className="border p-3 rounded-md mb-4 w-full"
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                >
                  <option value="">Select Patient</option>
                  {patients.map(appointment => (
                    <option key={appointment._id} value={appointment._id}>
                      {appointment.user.name}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-3 rounded-md mb-4 w-full"
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(e.target.value)}
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map(hospital => (
                    <option key={hospital._id} value={hospital._id}>
                      {hospital.hospitalName}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-3 rounded-md mb-4 w-full"
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                >
                  <option value="">Select Bed</option>
                  {beds.filter(bed => bed.status === 'available').map(bed => (
                    <option key={bed._id} value={bed._id}>
                      Bed {bed.bedNumber} - {bed.department}
                    </option>
                  ))}
                </select>
                <button 
                  className="bg-blue-500 text-white py-2 px-4 rounded-md mt-3 hover:bg-blue-600"
                  onClick={handleAssignPatient}
                >
                  Assign Patient
                </button>
              </div>
            </div>
          )}

          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Hospital List</h3>
            <ul>
              {hospitals.map(hospital => (
                <li key={hospital._id} className="border p-4 mb-2 rounded-md">
                  <h4 className="text-xl font-bold">{hospital.hospitalName}</h4>
                  <p>{hospital.location}</p>
                  <p>Departments: {hospital.departments.join(', ')}</p>
                  <img src={hospital.photo} alt={hospital.hospitalName} className="w-[100px] h-[100px] rounded-md mt-2" />
                  {role === 'admin' && (
                    <div className="mt-3">
                      <button
                        className="bg-yellow-500 text-white py-2 px-4 rounded-md mr-2 hover:bg-yellow-600"
                        onClick={() => {
                          setEditingHospitalId(hospital._id);
                          setHospitalData(hospital);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                        onClick={() => handleHospitalAction(() => handleDeleteHospital(hospital._id))}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </section>
  );
};

export default ManageHospitals;