/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from "react";
import axios from 'axios';
import { BASE_URL } from "../config";


const initial_state = {
  user: null,
  token: "",
  role: "",
  appointments: [],
  message: "",
  error: null,
};

export const AuthContext = createContext(initial_state);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };
    case "LOGOUT":
      return initial_state;
    case "SET_APPOINTMENTS":
      return {
        ...state,
        appointments: action.payload.appointments,
        message: action.payload.message,
        error: null,
      };
    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload.message,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);

  // Effect pour initialiser l'utilisateur
  useEffect(() => {
    const isFirstLaunch = !localStorage.getItem("app_initialized");

    if (!isFirstLaunch) {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");

      if (storedUser && storedToken && storedRole) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: JSON.parse(storedUser),
            token: storedToken,
            role: storedRole,
          }
        });
      }
    } else {
      localStorage.setItem("app_initialized", true);
    }
  }, []);

  // Mise à jour du localStorage en fonction de l'état
  useEffect(() => {
    if (state.user && state.token && state.role) {
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", state.token);
      localStorage.setItem("role", state.role);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, [state.user, state.token, state.role]);

  // Fonction pour récupérer les rendez-vous
  const fetchAppointments = async () => {
    if (state.token) {
      try {
        const response = await axios.get(`${BASE_URL}/bookings/appointments`, { 
          headers: {
            Authorization: `Bearer ${state.token}`
          },
          withCredentials: true, // Include credentials
        });
        
        const message = response.data.appointments.length > 0
          ? "You have the following appointments: " + response.data.appointments.map(app => `Doctor ${app.doctor.name}, Ticket: ${app.ticketPrice}`).join(", ")
          : "";
  
        dispatch({
          type: 'SET_APPOINTMENTS',
          payload: {
            appointments: response.data.appointments,
            message: message // Set the message here
          },
        });
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: {
            error: 'Failed to fetch appointments. Please try again later.'
          }
        });
      }
    }
  };
  

  // Effect pour récupérer les rendez-vous une fois le token disponible
  useEffect(() => {
    if (state.token) {
      fetchAppointments();
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
