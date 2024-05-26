"use client";
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DrugList from './DrugList';
import LocationStatistics from './LocationStatistics';
import OrderList from './OrderList';
import Revenue from './Revenue';
import UserList from './UserList';
import UserStatistics from './UserStatistics';

const Layout: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('users');

  let componentToRender;
  switch (activeComponent) {
    case 'users':
      componentToRender = <UserList />;
      break;
    case 'orders':
      componentToRender = <OrderList />;
      break;
    case 'drugs':
      componentToRender = <DrugList />;
      break;
    case 'revenue':
      componentToRender = <Revenue />;
      break;
    case 'user_statistics':
      componentToRender = <UserStatistics />;
      break;
    case 'location_statistics':
      componentToRender = <LocationStatistics />;
      break;
    default:
      componentToRender = <UserList />;
      break;
  }

  return (
    <div className="flex">
      <Sidebar setActiveComponent={setActiveComponent} activeComponent={activeComponent} />
      <main className="flex-1 p-4 bg-gray-100 min-h-screen">{componentToRender}</main>
    </div>
  );
};

export default Layout;
