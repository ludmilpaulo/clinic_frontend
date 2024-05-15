// fetchData.ts

import axios from 'axios';

const API_URL = 'http://your-django-api-url';

export const fetchCategories = async () => {
  const response = await axios.get(`${API_URL}/categories/`);
  return response.data;
};

export const fetchDoctors = async (categoryId: string) => {
  const response = await axios.get(`${API_URL}/doctors/`, {
    params: { category: categoryId },
  });
  return response.data;
};

export const fetchAvailableAppointments = async (doctorId: string, dateTime: string) => {
  const response = await axios.get(`${API_URL}/appointments/`, {
    params: { doctor: doctorId, datetime: dateTime },
  });
  return response.data;
};
