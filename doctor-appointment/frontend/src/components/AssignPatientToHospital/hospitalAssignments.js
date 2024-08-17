import axios from 'axios';
import { BASE_URL } from '../../config';

export const assignPatientToHospital = async (bookingId, hospitalId, bedId, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/assignments/assign-patient`,
      { bookingId, hospitalId, bedId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to assign patient to hospital:', error);
    throw new Error('Failed to assign patient to hospital.');
  }
};

export const assignPatientToBed = async (bookingId, bedId, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/assignments/assign-patient`,
      { bookingId, bedId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to assign patient to bed:', error);
    throw error;
  }
};