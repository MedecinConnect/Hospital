/* eslint-disable react/prop-types */

import { useState } from "react";
import convertTime from "../../utils/convertTime";
import { BASE_URL, token } from "./../../config";

const SidePanel = ({ ticketPrice, timeSlots, doctorId }) => {
  const [selectedSlot, setSelectedSlot] = useState(""); // État pour le créneau horaire sélectionné

  const bookingHandler = async () => {
    if (!selectedSlot) {
      alert("Veuillez sélectionner un créneau horaire.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/bookings/checkout-session/${doctorId}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedSlot }), // Inclure le créneau horaire sélectionné dans le corps de la requête
        }
      );

      const data = await response.json();

      if (data.session.url) {
        window.location.href = data.session.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value); // Mettre à jour l'état avec le créneau sélectionné
  };

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {ticketPrice} $CA
        </span>
      </div>

      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor">
          Temps de rendez-vous:
        </p>
        <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <li key={index} className="flex items-center justify-between mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="timeSlot"
                  value={`${item.day} ${convertTime(item.startingTime || "00:00")} - ${convertTime(item.endingTime || "00:00")}`}
                  onChange={handleSlotChange}
                  className="mr-2"
                />
                <span className="text-[15px] leading-6 text-textColor font-semibold">
                  {item.day.charAt(0).toUpperCase() + item.day.slice(1)}: {convertTime(item.startingTime || "00:00")}
                  <span> - </span>
                  {convertTime(item.endingTime || "00:00")}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={bookingHandler} className="px-2 btn w-full rounded-md mt-4">
        Book Appointment
      </button>
    </div>
  );
};

export default SidePanel;