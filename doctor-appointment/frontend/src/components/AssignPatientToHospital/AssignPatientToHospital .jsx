import  { useState, useEffect, useContext } from 'react';
import { assignPatientToHospital } from './Hospital';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../config';

const AssignPatientToHospital = () => {
    const { token, userId } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [beds, setBeds] = useState([]); // New state for beds
    const [selectedBooking, setSelectedBooking] = useState('');
    const [selectedHospital, setSelectedHospital] = useState('');
    const [selectedBed, setSelectedBed] = useState(''); // New state for selected bed
    const [message, setMessage] = useState('');

    // Debugging: Log userId and token
    console.log("UserId:", userId);
    console.log("Token:", token);

    useEffect(() => {
        if (userId) {
            fetchAppointments();
            fetchHospitals();
        } else {
            console.error("UserId is not defined");
        }
    }, [token, userId]);

    useEffect(() => {
        if (selectedHospital) {
            fetchBeds(selectedHospital);
        }
    }, [selectedHospital]);

    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/bookings/doctors/${userId}/appointments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                setAppointments(result.appointments);
            } else {
                console.error('Failed to fetch appointments:', result.message);
            }
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        }
    };

    const fetchHospitals = async () => {
        try {
            const response = await fetch(`${BASE_URL}/hospitals`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            setHospitals(result.data);
        } catch (error) {
            console.error('Failed to fetch hospitals:', error);
        }
    };

    const fetchBeds = async (hospitalId) => {
        try {
            const response = await fetch(`${BASE_URL}/beds?hospitalId=${hospitalId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await response.json();
            if (result.success) {
                setBeds(result.data.filter(bed => !bed.isOccupied)); // Only available beds
            } else {
                console.error('Failed to fetch beds:', result.message);
            }
        } catch (error) {
            console.error('Failed to fetch beds:', error);
        }
    };

    const handleAssign = async () => {
        try {
            await assignPatientToHospital(selectedBooking, selectedHospital, selectedBed, token);
            setMessage('Patient successfully assigned to the hospital and bed.');
        } catch (error) {
            setMessage('Failed to assign patient to hospital and bed.');
        }
    };

    return (
        <div>
            <h2>Assign Patient to Hospital</h2>
            {message && <p>{message}</p>}
            <div>
                <select value={selectedBooking} onChange={(e) => setSelectedBooking(e.target.value)}>
                    <option value="">Select Patient</option>
                    {appointments.map((appointment) => (
                        <option key={appointment._id} value={appointment._id}>
                            {appointment.user.name} - {new Date(appointment.selectedSlot).toLocaleString()}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)}>
                    <option value="">Select Hospital</option>
                    {hospitals.map((hospital) => (
                        <option key={hospital._id} value={hospital._id}>
                            {hospital.hospitalName}
                        </option>
                    ))}
                </select>
            </div>
            {selectedHospital && (
                <div>
                    <select value={selectedBed} onChange={(e) => setSelectedBed(e.target.value)}>
                        <option value="">Select Bed</option>
                        {beds.map((bed) => (
                            <option key={bed._id} value={bed._id}>
                                Bed {bed.bedNumber} - {bed.department}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <button onClick={handleAssign}>Assign Patient to Hospital and Bed</button>
        </div>
    );
};

export default AssignPatientToHospital;