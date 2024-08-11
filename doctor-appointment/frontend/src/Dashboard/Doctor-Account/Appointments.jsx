/* eslint-disable react/prop-types */
import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import FeedbackForm from "./FeedBackform";

const Appointments = ({ appointments, token }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleToggleFeedback = appointmentId => {
    if (selectedAppointment === appointmentId) {
      setSelectedAppointment(null);
    } else {
      setSelectedAppointment(appointmentId);
    }
  };

  return (
    <table className="w-full text-sm text-left text-gray-500 ">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Gender
          </th>
          <th scope="col" className="px-6 py-3">
            Payment
          </th>
          <th scope="col" className="px-6 py-3">
            Price
          </th>
          <th scope="col" className="px-6 py-3">
            Booked on
          </th>
          <th scope="col" className="px-6 py-3">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(item => (
          <tr key={item._id} className="bg-white border-b  hover:bg-gray-50 ">
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
            >
              <img
                className="w-10 h-10 rounded-full"
                src={item.user.photo}
                alt={item.user.name}
              />
              <div className="pl-3">
                <div className="text-base font-semibold">{item.user.name}</div>
                <div className="font-normal text-gray-500">
                  {item.user.email}
                </div>
              </div>
            </th>
            <td className="px-6 py-4">{item.user.gender}</td>
            <td className="px-6 py-4">
              {item.isPaid && (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  Paid
                </div>
              )}

              {!item.isPaid && (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                  Unpaid
                </div>
              )}
            </td>
            <td className="px-6 py-4">{item.ticketPrice}</td>
            <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
            <td className="px-6 py-4">
              <button
                onClick={() => handleToggleFeedback(item._id)}
                className="text-blue-600 hover:underline"
              >
                {selectedAppointment === item._id
                  ? "Hide Feedback"
                  : "Add Feedback"}
              </button>
              {selectedAppointment === item._id && (
                <FeedbackForm bookingId={item._id} token={token} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Appointments;