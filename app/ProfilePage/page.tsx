"use client";
import React, { useState } from 'react';
import { FaBox, FaUsers, FaChartLine, FaClipboardList } from 'react-icons/fa';
import ProductsSection from './sections/ProductsSection';
import OrdersSection from './sections/OrdersSection';
import CustomersSection from './sections/CustomersSection';
import RevenueSection from './sections/RevenueSection';

const ProfilePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('products');

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
          <nav>
            <ul>
              <li>
                <button
                  onClick={() => setActiveSection('products')}
                  className={`flex items-center p-2 w-full hover:bg-gray-200 ${
                    activeSection === 'products' ? 'bg-gray-200' : ''
                  }`}
                >
                  <FaBox className="mr-2" /> Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('orders')}
                  className={`flex items-center p-2 w-full hover:bg-gray-200 ${
                    activeSection === 'orders' ? 'bg-gray-200' : ''
                  }`}
                >
                  <FaClipboardList className="mr-2" /> Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('customers')}
                  className={`flex items-center p-2 w-full hover:bg-gray-200 ${
                    activeSection === 'customers' ? 'bg-gray-200' : ''
                  }`}
                >
                  <FaUsers className="mr-2" /> Customers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('revenue')}
                  className={`flex items-center p-2 w-full hover:bg-gray-200 ${
                    activeSection === 'revenue' ? 'bg-gray-200' : ''
                  }`}
                >
                  <FaChartLine className="mr-2" /> Revenue
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6">
        {activeSection === 'products' && <ProductsSection />}
        {activeSection === 'orders' && <OrdersSection />}
        {activeSection === 'customers' && <CustomersSection />}
        {activeSection === 'revenue' && <RevenueSection />}
      </main>
    </div>
  );
};

export default ProfilePage;
