"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes } from 'react-icons/fa';

const OrdersSection: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/orders/');
      setOrders(response.data);
      setLoading(false);
    } catch (error : any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleStatusChange = async (order: any, status: string) => {
    setLoading(true);
    try {
      await axios.put(`/api/orders/${order.id}/`, { ...order, status });
      fetchOrders();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">User</th>
                <th className="py-2">Total Price</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border px-4 py-2">{order.user.username}</td>
                  <td className="border px-4 py-2">{order.total_price}</td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2">
                    <button 
                      onClick={() => handleStatusChange(order, 'completed')} 
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      <FaCheck />
                    </button>
                    <button 
                      onClick={() => handleStatusChange(order, 'pending')} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
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

export default OrdersSection;
