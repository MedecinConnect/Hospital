import axios from 'axios';
import { BASE_URL } from '../../config';

// Fonction pour ajouter un hôpital
export const addHospital = async (hospitalData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/hospitals`, 
      hospitalData, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to add hospital:', error);
    throw new Error('Failed to add hospital.');
  }
};

// Fonction pour mettre à jour un hôpital
export const updateHospital = async (hospitalId, hospitalData, token) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/hospitals/${hospitalId}`, 
      hospitalData, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update hospital:', error);
    throw new Error('Failed to update hospital.');
  }
};

// Fonction pour supprimer un hôpital
export const deleteHospital = async (hospitalId, token) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/hospitals/${hospitalId}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete hospital:', error);
    throw new Error('Failed to delete hospital.');
  }
};
