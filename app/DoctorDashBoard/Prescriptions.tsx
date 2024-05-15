import React from 'react';

interface PrescriptionsProps {
  userId: number | null;
}

const Prescriptions: React.FC<PrescriptionsProps> = ({ userId }) => {
  return (
    <div>
      <h1>Prescriptions</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default Prescriptions;
