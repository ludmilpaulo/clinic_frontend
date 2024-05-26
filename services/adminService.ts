import { baseAPI } from '@/utils/variables';
import axios from 'axios';

const API_URL = baseAPI;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const fetchDrugs = async () => {
  const response = await api.get('/pharmacy/drugs/');
  return response.data;
};

export const createDrug = async (drugData: FormData) => {
  const response = await api.post('/pharmacy/drugs/', drugData);
  return response.data;
};

export const updateDrug = async (id: string, drugData: FormData) => {
  const response = await api.put(`/pharmacy/drugs/${id}/`, drugData);
  return response.data;
};

export const deleteDrug = async (id: string) => {
  const response = await api.delete(`/pharmacy/drugs/${id}/`);
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('order/orders/', orderData);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await api.get('order/orders/');
  return response.data;
};




  export const fetchSalesSummary = async () => {
    const response = await api.get('/order/sales-summary/');
    return response.data;
  };
  
  export const fetchUserStatistics = async () => {
    const response = await api.get('/order/user-statistics/');
    return response.data;
  };
  
  export const fetchLocationStatistics = async () => {
    const response = await api.get('/location-statistics/');
    return response.data;
  };


  export const fetchUsers = async () => {
    const response = await api.get('/users/');
    return response.data;
  };