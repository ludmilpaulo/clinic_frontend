// services/adminService.ts
import axios from 'axios';
import { store } from '@/redux/store';
import { selectUser } from '@/redux/slices/authSlice';
import { baseAPI } from '@/utils/variables';

const API_URL = baseAPI;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const user = selectUser(state);
    const token = user?.token;
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error('Axios error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'An error occurred while making the request.');
  } else {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred.');
  }
};

export const fetchDrugs = async () => {
  try {
    const response = await api.get('/pharmacy/drugs/');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createDrug = async (drugData: FormData) => {
  try {
    const response = await api.post('/pharmacy/drugs/create/', drugData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateDrug = async (id: number, drugData: FormData) => {
  try {
    const response = await api.put(`/pharmacy/drugs/${id}/`, drugData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteDrug = async (id: number) => {
  try {
    const response = await api.delete(`/pharmacy/drugs/${id}/`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const createOrder = async (orderData: any) => {
  try {
    const response = await api.post('/order/orders/', orderData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchOrders = async () => {
  try {
    const response = await api.get('/order/orders/');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchSalesSummary = async () => {
  try {
    const response = await api.get('/order/sales-summary/');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchUserStatistics = async () => {
  try {
    const response = await api.get('/order/user-statistics/');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchLocationStatistics = async () => {
  try {
    const response = await api.get('/location-statistics/');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users/');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
