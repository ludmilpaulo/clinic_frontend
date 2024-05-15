"use client";

import React, { useState } from 'react';
import { fetchAvailableAppointments } from './fetchData';

const BookAppointment = ({ doctorId, categoryId }) => {
  const [dateTime, setDateTime] = useState('');
  const [availableAppointments, setAvailableAppointments] = useState([]);

  const checkAvailability = async () => {
    const appointments = await fetchAvailableAppointments(doctorId, dateTime);
    setAvailableAppointments(appointments);
  };

  return (
    <div className="book-appointment">
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={checkAvailability} className="bg-blue-500 text-white p-2 rounded ml-2">
        Check Availability
      </button>

      <div className="appointments-list">
        {availableAppointments.length === 0 ? (
          <p>No available appointments at the selected time.</p>
        ) : (
          availableAppointments.map((appointment) => (
            <div key={appointment.id} className="appointment-card p-4 border m-2 rounded">
              {appointment.appointment_time}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
