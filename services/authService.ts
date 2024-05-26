import { baseAPI } from '@/utils/variables';

import axios, { isAxiosError } from 'axios';


const API_URL = `${baseAPI}/account`;



export const signup = async (username: string, email: string, password: string) => {
  try {
const API_URL = `${baseAPI}/account`;
    const response = await axios.post(`${API_URL}/signup/`, { username, email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, { username, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/password-reset/`, { email });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const resetPassword = async (uid: string, token: string, newPassword: string) => {
  try {
    const response = await axios.post(`${API_URL}/password-reset/confirm/`, { uid, token, newPassword });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
