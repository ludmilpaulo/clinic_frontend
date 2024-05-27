"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const CustomersSection: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone_number: '',
    id_number_or_passport: '',
    gender: '',
    date_of_birth: '',
    address: '',
  });
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/customers/');
      setCustomers(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedCustomer) {
        await axios.put(`/api/customers/${selectedCustomer.id}/`, form);
      } else {
        await axios.post('/api/customers/', form);
      }
      fetchCustomers();
      setForm({ name: '', surname: '', phone_number: '', id_number_or_passport: '', gender: '', date_of_birth: '', address: '' });
      setSelectedCustomer(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setForm({
      name: customer.name,
      surname: customer.surname,
      phone_number: customer.phone_number,
      id_number_or_passport: customer.id_number_or_passport,
      gender: customer.gender,
      date_of_birth: customer.date_of_birth,
      address: customer.address,
    });
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`/api/customers/${id}/`);
      fetchCustomers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Customers</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">{selectedCustomer ? 'Edit Customer' : 'Add Customer'}</h3>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Surname</label>
          <input 
            type="text" 
            name="surname" 
            value={form.surname} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input 
            type="text" 
            name="phone_number" 
            value={form.phone_number} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">ID Number or Passport</label>
          <input 
            type="text" 
            name="id_number_or_passport" 
            value={form.id_number_or_passport} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <input 
            type="text" 
            name="gender" 
            value={form.gender} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <input 
            type="date" 
            name="date_of_birth" 
            value={form.date_of_birth} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <textarea 
            name="address" 
            value={form.address} 
            onChange={handleChange} 
            className="w-full border rounded px-3 py-2 mt-1"
            rows={4}
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-colors duration-300"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Customers List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Surname</th>
                <th className="py-2">Phone Number</th>
                <th className="py-2">ID Number or Passport</th>
                <th className="py-2">Gender</th>
                <th className="py-2">Date of Birth</th>
                <th className="py-2">Address</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="border px-4 py-2">{customer.name}</td>
                  <td className="border px-4 py-2">{customer.surname}</td>
                  <td className="border px-4 py-2">{customer.phone_number}</td>
                  <td className="border px-4 py-2">{customer.id_number_or_passport}</td>
                  <td className="border px-4 py-2">{customer.gender}</td>
                  <td className="border px-4 py-2">{customer.date_of_birth}</td>
                  <td className="border px-4 py-2">{customer.address}</td>
                  <td className="border px-4 py-2">
                    <button 
                      onClick={() => handleEdit(customer)} 
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(customer.id)} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomersSection;