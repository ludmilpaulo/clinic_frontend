import React from 'react';

interface AppointmentsProps {
  userId: number | null;
}

const Appointments: React.FC<AppointmentsProps> = ({ userId }) => {
  return (
    <div>
      <h1>Appointments</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default Appointments;
