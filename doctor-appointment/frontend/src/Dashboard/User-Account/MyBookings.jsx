import { BASE_URL } from "./../../config";

import DoctorCard from "./../../components/Doctors/DoctorCard";
import useFetchData from "./../../hooks/useFetchData";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const MyBookings = () => {
  const { token } = useContext(AuthContext);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/bookings/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const appointmentsWithFeedback = await Promise.all(
          response.data.appointments.map(async (appointment) => {
            try {
              const feedbackResponse = await axios.get(
                `${BASE_URL}/bookings/${appointment._id}/feedback`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return {
                ...appointment,
                feedback: feedbackResponse.data.feedback,
              };
            } catch (err) {
              console.error(`Failed to fetch feedback for booking ${appointment._id}:`, err);
              return appointment; // Return the appointment without feedback
            }
          })
        );

        setMyAppointments(appointmentsWithFeedback);
      } catch (err) {
        setError('Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center w-full h-full">
          <HashLoader color="#0067FF" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center w-full h-full">
          <h3 className="text-headingColor text-[20px] font-semibold leading-[30px]">
            {error}
          </h3>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1  lg:grid-cols-2 gap-5">
          {myAppointments?.map((appointment) => (
            <div key={appointment._id} className="bg-white p-5 shadow-md rounded-md">
              {appointment.doctor ? (
                <DoctorCard doctor={appointment.doctor} />
              ) : (
                <p>No doctor assigned to this appointment.</p>
              )}
              <div className="mt-3">
                <p className="text-sm text-gray-600">Date: {new Date(appointment.createdAt).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Price: ${appointment.ticketPrice}</p>
                <p className="text-sm text-gray-600">Status: {appointment.isPaid ? 'Paid' : 'Unpaid'}</p>
                
                {/* Display Doctor's Feedback if available */}
                {appointment.feedback && (
                  <div className="mt-2 p-3 bg-gray-100 rounded-md">
                    <p className="text-sm font-bold">Doctor's Feedback:</p>
                    <p className="text-sm text-gray-800">{appointment.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;