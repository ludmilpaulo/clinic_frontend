import { fetchUserStatistics } from '@/services/adminService';
import React, { useEffect, useState } from 'react';


const UserStatistics: React.FC = () => {
  const [userStatistics, setUserStatistics] = useState({
    most_purchases_user: '',
    total_spent: 0,
  });

  useEffect(() => {
    async function getUserStatistics() {
      const data = await fetchUserStatistics();
      setUserStatistics(data);
    }

    getUserStatistics();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Statistics</h1>
      <p className="text-gray-700">User with the most purchases: {userStatistics.most_purchases_user}</p>
      <p className="text-gray-700">Total spent: ${userStatistics.total_spent}</p>
    </div>
  );
};

export default UserStatistics;
