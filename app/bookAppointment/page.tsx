"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectUser } from '@/redux/slices/authSlice';
import axios from 'axios';
import { baseAPI } from '@/utils/variables';
import { getConsultationCategories } from '@/services/consultationCategoryService';

interface AppointmentsProps {
  userId: number | null;
}

const Appointments: React.FC<AppointmentsProps> = () => {
  const [category, setCategory] = useState<string>('');
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  useEffect(() => {
    if (token) {
      getConsultationCategories(token).then(response => {
        setCategories(response);
      }).catch(error => {
        console.error('Error fetching categories:', error);
      });
    }
  }, [token]);

  useEffect(() => {
    if (category && token) {
      console.log(`Fetching availabilities for category: ${category}`);
      axios.get(`${baseAPI}/appointment/doctor-availability/${category}/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        console.log('Availabilities fetched:', response.data);
        setAvailabilities(response.data);
      })
      .catch(error => {
        console.error('Error fetching availabilities:', error);
      });
    }
  }, [category, token]);

  const generateSlots = (availability) => {
    const slots = [];
    const startTime = new Date(`1970-01-01T${availability.start_time}Z`);
    const endTime = new Date(`1970-01-01T${availability.end_time}Z`);
    const currentTime = new Date(startTime);

    while (currentTime < endTime) {
      slots.push(new Date(currentTime));
      currentTime.setHours(currentTime.getHours() + 1);
    }

    return slots;
  };

  const handleBooking = async () => {
    if (selectedSlot && token) {
      const appointmentData = {
        doctor: selectedSlot.doctor,
        category: category,
        appointment_time: selectedSlot.time.toISOString(), // Use ISO string for datetime
        status: 'scheduled',
        paid: false,
        fee: 0.00, // or any logic to set the fee
      };

      try {
        await axios.post(`${baseAPI}/appointment/appointments/`, appointmentData, {
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
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Consultation Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <h2>Available Slots</h2>
        {availabilities.length > 0 ? (
          availabilities.map((availability) => (
            <div key={availability.id} className="mt-4">
              <h3 className="text-lg font-semibold">{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseInt(availability.days_of_week)]}</h3>
              <div className="grid grid-cols-3 gap-2">
                {generateSlots(availability).map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot({ doctor: availability.doctor, time: slot })}
                    className={`p-2 rounded ${selectedSlot?.time.getTime() === slot.getTime() ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No availabilities found for the selected category.</p>
        )}
      </div>
      {selectedSlot && (
        <div className="mt-4">
          <h3>Selected Slot: {selectedSlot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h3>
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
