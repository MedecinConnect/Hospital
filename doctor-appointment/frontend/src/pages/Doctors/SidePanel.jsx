/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import convertTime from "../../utils/convertTime";
import { BASE_URL, token } from "./../../config";

const SidePanel = ({ ticketPrice, doctorId }) => {
  const [selectedSlot, setSelectedSlot] = useState(""); // État pour le créneau horaire sélectionné
  const [timeSlots, setTimeSlots] = useState([]); // État pour les créneaux horaires disponibles
  const [slotError, setSlotError] = useState(""); // État pour les erreurs de créneaux horaires

  // Fetch available time slots for the selected doctor
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch(`${BASE_URL}/bookings/doctors/${doctorId}/available-slots`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch available time slots.");
        }
    
        const data = await response.json();
        setTimeSlots(data.availableTimeSlots || []);
      } catch (error) {
        setSlotError("Failed to load available time slots.");
        console.error("Failed to fetch available time slots:", error);
      }
    };
    
    fetchTimeSlots();
  }, [doctorId]);

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

      if (data.success && data.session.url) {
        window.location.href = data.session.url;
      } else {
        alert(data.message || "Failed to create session");
      }
    } catch (error) {
      console.error("Error during booking:", error);
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
        {slotError ? (
          <p className="text-red-600">{slotError}</p>
        ) : (
          <ul className="mt-3">
            {timeSlots.length > 0 ? (
              timeSlots.map((slot, index) => (
                <li key={index} className="flex items-center justify-between mb-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="timeSlot"
                      value={`${slot.day}, ${slot.startingTime} - ${slot.endingTime}`}
                      onChange={handleSlotChange}
                      className="mr-2"
                    />
                    <span className="text-[15px] leading-6 text-textColor font-semibold">
                      {`${slot.day}: ${slot.startingTime} - ${slot.endingTime}`}
                    </span>
                  </label>
                </li>
              ))
            ) : (
              <p>Aucun créneau horaire disponible.</p>
            )}
          </ul>
        )}
      </div>

      <button onClick={bookingHandler} className="px-2 btn w-full rounded-md mt-4">
        Réserver un rendez-vous
      </button>
    </div>
  );
};

export default SidePanel;