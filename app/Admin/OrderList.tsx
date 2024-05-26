import { fetchOrders } from '@/services/adminService';
import React, { useEffect, useState } from 'react';


const OrderList: React.FC = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      const data = await fetchOrders();
      setOrders(data);
    }

    loadOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="w-full table-auto bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id} className="border-b">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.user.username}</td>
              <td className="px-4 py-2">{order.total_price}</td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">{order.created_at}</td>
              <td className="px-4 py-2">
                {/* Add actions for editing/deleting orders if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
