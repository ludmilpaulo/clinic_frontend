import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectUser } from '@/redux/slices/authSlice';
import axios from 'axios';
import { baseAPI } from '@/utils/variables';

interface AppointmentsProps {
  userId: number | null;
}

const Appointments: React.FC<AppointmentsProps> = ({ userId }) => {
  const [category, setCategory] = useState<string>('');
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  useEffect(() => {
    if (category && token) {
      axios.get(`${baseAPI}/manager/doctor-availability/${category}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        setAvailabilities(response.data);
      })
      .catch(error => {
        console.error('Error fetching availabilities:', error);
      });
    }
  }, [category, token]);

  const handleBooking = async () => {
    if (selectedSlot && token) {
      const appointmentData = {
        doctor: selectedSlot.doctor,
        category: category,
        appointment_time: selectedSlot.start_time, // or any logic to set appointment time
        status: 'scheduled',
        paid: false,
        fee: 0.00, // or any logic to set the fee
      };

      try {
        await axios.post(`${baseAPI}/manager/appointments/`, appointmentData, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        alert('Appointment booked successfully!');
      } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Error booking appointment.');
      }
    }
  };

  return (
    <div>
      <h1>Appointments</h1>
      <p>User ID: {userId}</p>
      <div>
        <label className="block text-sm font-bold mb-2">Consultation Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          {/* Replace with actual categories */}
          <option value="">Select Category</option>
          <option value="1">General</option>
          <option value="2">Cardiology</option>
          <option value="3">Neurology</option>
        </select>
      </div>
      <div className="mt-4">
        <h2>Available Slots</h2>
        {availabilities.map((availability) => (
          <div key={availability.id} className="mt-2">
            <button
              onClick={() => setSelectedSlot(availability)}
              className={`p-2 rounded ${selectedSlot === availability ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              {availability.start_time} - {availability.end_time}
            </button>
          </div>
        ))}
      </div>
      {selectedSlot && (
        <div className="mt-4">
          <h3>Selected Slot: {selectedSlot.start_time} - {selectedSlot.end_time}</h3>
          <button
            onClick={handleBooking}
            className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default Appointments;
