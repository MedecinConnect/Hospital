import axios from 'axios';
import { BASE_URL } from '../../config';

export const assignPatientToHospital = async (bookingId, hospitalId, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/assignments/assign-patient`,
      { bookingId, hospitalId },
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
