"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './Sidebar';
import withStaff from '@/hoc/withStaff';

const UserList = dynamic(() => import('./UserList'), { ssr: false });
const OrderList = dynamic(() => import('./OrderList'), { ssr: false });
const SiteInfo = dynamic(() => import('./info/SiteInfo'));
const DrugList = dynamic(() => import('./DrugList'), { ssr: false });
const Revenue = dynamic(() => import('./Revenue'), { ssr: false });
const UserStatistics = dynamic(() => import('./UserStatistics'), { ssr: false });
const LocationStatistics = dynamic(() => import('./LocationStatistics'), { ssr: false });

const Layout: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState('users');

  let componentToRender;
  switch (activeComponent) {
    case 'users':
      componentToRender = <UserList />;
      break;
    case 'site-info':
      componentToRender = <SiteInfo />;
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
