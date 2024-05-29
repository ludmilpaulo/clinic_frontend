"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseAPI } from '@/utils/variables';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';
import withAuth from '@/components/PrivateRoute';

interface OrderItem {
  id: number;
  drug: { name: string };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  created_at: string;
  status: string;
  invoice: string;
  items: OrderItem[];
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  orders: Order[];
}

const ProfilePage = () => {
  const auth = useSelector((state: RootState) => selectUser(state));
  const token = auth?.token;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data from API
    axios.get(`${baseAPI}/account/user`)
      .then(response => setUser(response.data))
      .catch(error => console.error('Failed to fetch user data:', error));
  }, []);

  const handleUpdateProfile = () => {
    if (user) {
      axios.put(`${baseAPI}/account/user`, user)
        .then(response => {
          setUser(response.data);
          setIsEditing(false);
        })
        .catch(error => console.error('Failed to update user data:', error));
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              value={user.first_name}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              value={user.last_name}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user.email}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={user.address}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              value={user.city}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={(e) => setUser({ ...user, city: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700">Postal Code</label>
            <input
              type="text"
              value={user.postal_code}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={(e) => setUser({ ...user, postal_code: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={user.country}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              onChange={(e) => setUser({ ...user, country: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>
        <div className="flex justify-end">
          {isEditing ? (
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Order History</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left border-b">Order ID</th>
              <th className="p-2 text-left border-b">Date</th>
              <th className="p-2 text-left border-b">Status</th>
              <th className="p-2 text-left border-b">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {user.orders.map((order) => (
              <tr key={order.id}>
                <td className="p-2 border-b">{order.id}</td>
                <td className="p-2 border-b">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="p-2 border-b">{order.status}</td>
                <td className="p-2 border-b">
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => window.location.href = order.invoice}
                  >
                    Download
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(ProfilePage);
