"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const RevenueSection: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/customers/revenue/');
      setRevenueData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Revenue</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        revenueData && (
          <div>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Weekly Sales</h3>
              <Line
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'Sales',
                      data: revenueData.weekly_sales,
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                height={200}
                width={600}
              />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                  datasets: [
                    {
                      label: 'Sales',
                      data: revenueData.monthly_sales,
                      backgroundColor: 'rgba(153, 102, 255, 0.2)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                height={200}
                width={600}
              />
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <p>Total Revenue: R{revenueData.total_revenue} </p>
              <p>Most Bought Product: {revenueData.most_bought_product}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default RevenueSection;
