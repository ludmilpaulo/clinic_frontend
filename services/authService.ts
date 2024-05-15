import { baseAPI } from '@/utils/variables';
import axios from 'axios';

const API_URL = `${baseAPI}`;

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/account/custom-login/`, { username, password });
  return response.data;
};

// services/authService.ts


export const signup = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/account/custom-signup/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 201) {
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
   
    throw error;
  }
};


