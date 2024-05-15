"use client";

import { useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Appointments from './appointments';
import Availability from './availability';
import Consultations from './consultations';
import Prescriptions from './Prescriptions';
import Profile from './profile';
import { selectUser } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';

const DoctorDashBoard = () => {
  const [section, setSection] = useState<'profile' | 'availability' | 'appointments' | 'consultations' | 'prescriptions'>('profile');
  const user = useSelector((state: RootState) => selectUser(state));

  console.log("user ", user);

  const userId: number = user?.user_id ?? 0;
  console.log("userId ", userId);
  const username: string = user?.username ?? '';
  console.log("username ", username);

  const renderSection = () => {
    switch (section) {
      case 'profile':
        return <Profile userId={userId} username={username} />;
      case 'availability':
        return <Availability userId={userId} />;
      case 'appointments':
        return <Appointments userId={userId} />;
      case 'consultations':
        return <Consultations userId={userId} />;
      case 'prescriptions':
        return <Prescriptions userId={userId} />;
      default:
        return <Profile userId={userId} username={username} />;
    }
  };

  return (
    <div className="flex">
      <Sidebar setSection={setSection} />
      <main className="flex-1 p-6 bg-gray-100 ml-64 lg:ml-0">
        {renderSection()}
      </main>
    </div>
  );
};

export default DoctorDashBoard;
