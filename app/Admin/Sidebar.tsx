import React from 'react';

interface SidebarProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent, activeComponent }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">Admin Panel</div>
      <nav className="mt-10 flex-1">
        <ul>
          <li className={`px-4 py-2 cursor-pointer ${activeComponent === 'users' ? 'bg-gray-700' : ''}`} onClick={() => setActiveComponent('users')}>
            <span className="block">Users</span>
          </li>
          <li className={`px-4 py-2 cursor-pointer ${activeComponent === 'orders' ? 'bg-gray-700' : ''}`} onClick={() => setActiveComponent('orders')}>
            <span className="block">Orders</span>
          </li>
          <li className={`px-4 py-2 cursor-pointer ${activeComponent === 'drugs' ? 'bg-gray-700' : ''}`} onClick={() => setActiveComponent('drugs')}>
            <span className="block">Drugs</span>
          </li>
          <li className={`px-4 py-2 cursor-pointer ${activeComponent === 'revenue' ? 'bg-gray-700' : ''}`} onClick={() => setActiveComponent('revenue')}>
            <span className="block">Revenue</span>
          </li>
          <li className={`px-4 py-2 cursor-pointer ${activeComponent === 'user_statistics' ? 'bg-gray-700' : ''}`} onClick={() => setActiveComponent('user_statistics')}>
            <span className="block">User Statistics</span>
          </li>
          <li className={`px-4 py-2 cursor-pointer ${activeComponent === 'location_statistics' ? 'bg-gray-700' : ''}`} onClick={() => setActiveComponent('location_statistics')}>
            <span className="block">Location Statistics</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
