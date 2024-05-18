import axios from 'axios';
import { baseAPI } from '@/utils/variables';

const API_BASE_URL = baseAPI;

export const createDoctorAvailability = async (availabilityData: any, token: string) => {
  try {
    console.log('Sending availability data:', availabilityData); 
    const response = await axios.post(`${API_BASE_URL}/manager/doctor-availability/`, availabilityData, {
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating doctor availability:', error);
    throw error;
  }
};
