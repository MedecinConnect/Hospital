/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from "react";
import axios from 'axios';
import { BASE_URL } from "../config";


const initial_state = {
  user: localStorage.getItem("user") !== null ? JSON.parse(localStorage.getItem("user")) : null,
  token: localStorage.getItem("token") || "",
  role: localStorage.getItem("role") || "",
  appointments: [],
  message: "",
  error: null,
};

export const AuthContext = createContext(initial_state);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        user: null,
        token: "",
        role: "",
        message: ""
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: "",
        role: "",
        message: "",
        error: action.payload.error
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: "",
        role: "",
        appointments: [],
        message: ""
      };
    case "SET_APPOINTMENTS":
      return {
        ...state,
        appointments: action.payload.appointments,
        message: action.payload.message,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload.error
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);

  useEffect(() => {
    const { user, token, role } = state;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  }, [state]);

  const fetchAppointments = async () => {
    if (state.token) {
      try {
        const response = await axios.get(`${BASE_URL}/bookings/appointments`, { 
          headers: {
            Authorization: `Bearer ${state.token}`
          },
          withCredentials: true,
        });
        
        let message = "";
        if (response.data.appointments.length > 0) {
          message = "Vous avez les rendez-vous suivants : " + response.data.appointments.map(app => `Docteur ${app.doctor.name}, Ticket: ${app.ticketPrice}`).join(", ");
        }

        dispatch({
          type: 'SET_APPOINTMENTS',
          payload: {
            appointments: response.data.appointments,
            message: message
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

  useEffect(() => {
    fetchAppointments();
  }, [state.token]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};