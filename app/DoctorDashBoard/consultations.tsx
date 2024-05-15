import React from 'react';

interface ConsultationsProps {
  userId: number | null;
}

const Consultations: React.FC<ConsultationsProps> = ({ userId }) => {
  return (
    <div>
      <h1>Consultations</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};

export default Consultations;
