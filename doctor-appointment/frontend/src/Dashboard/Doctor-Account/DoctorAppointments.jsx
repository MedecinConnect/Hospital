/* eslint-disable react/prop-types */
import FeedbackForm from './FeedBackform';

const DoctorAppointments = ({ appointments, token }) => {
  return (
    <div className="doctor-appointments">
      <h2>Your Appointments</h2>
      {appointments.map((appointment) => (
        <div key={appointment._id} className="appointment">
          <p>Patient: {appointment.user.name}</p>
          <p>Date: {new Date(appointment.createdAt).toLocaleDateString()}</p>
          <FeedbackForm bookingId={appointment._id} token={token} />
        </div>
      ))}
    </div>
  );
};
  export default DoctorAppointments;