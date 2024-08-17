import { useState, useEffect, useContext } from 'react';
import { assignPatientToBed } from './hospitalAssignments';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';

const AssignPatientToBed = () => {
    const { token, user } = useContext(AuthContext);
    const userId = user?._id;
    const [appointments, setAppointments] = useState([]);
    const [beds, setBeds] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState('');
    const [selectedBed, setSelectedBed] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (userId) {
            fetchAppointments();
            fetchBeds();
        } else {
            console.error("UserId is not defined");
        }
    }, [token, userId]);

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

    const fetchBeds = async () => {
        try {
            const response = await fetch(`${BASE_URL}/beds`, {
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
            await assignPatientToBed(selectedBooking, selectedBed, token);
            setMessage('Patient successfully assigned to the bed.');
            toast.success('Bed successfully assigned and marked as occupied.');

            // Update the beds list to reflect the occupied bed
            setBeds(beds.map(bed => 
                bed._id === selectedBed ? { ...bed, isOccupied: true } : bed
            ));
        } catch (error) {
            setMessage('Failed to assign patient to bed.');
            toast.error('Failed to assign bed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Assign Patient to Bed</h2>
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
                <select value={selectedBed} onChange={(e) => setSelectedBed(e.target.value)}>
                    <option value="">Select Bed</option>
                    {beds.map((bed) => (
                        <option key={bed._id} value={bed._id}>
                            Bed {bed.bedNumber} - {bed.department}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleAssign}>Assign Patient to Bed</button>
        </div>
    );
};

export default AssignPatientToBed;