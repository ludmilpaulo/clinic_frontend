"use client";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectUser } from '@/redux/slices/authSlice';
import axios from 'axios';
import { baseAPI } from '@/utils/variables';
import { getConsultationCategories } from '@/services/consultationCategoryService';

const daysOfWeekMap = {
  '0': 'Sunday',
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
};

const Appointments = () => {
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
        const updatedAvailabilities = response.data.map(availability => {
          return {
            ...availability,
            slots: generateSlots(availability).map(slot => ({
              time: slot,
              booked: false
            }))
          };
        });
        setAvailabilities(updatedAvailabilities);
      })
      .catch(error => {
        console.error('Error fetching availabilities:', error);
      });
    }
  }, [category, token]);

  const generateSlots = (availability) => {
    const slots = [];
    const startTime = new Date(`${availability.year}-${String(availability.month).padStart(2, '0')}-${String(availability.day_of_month).padStart(2, '0')}T${availability.start_time}`);
    const endTime = new Date(`${availability.year}-${String(availability.month).padStart(2, '0')}-${String(availability.day_of_month).padStart(2, '0')}T${availability.end_time}`);
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
        patient: user?.user_id,
        doctor: selectedSlot.doctor_user_id,
        category: parseInt(category),
        appointment_time: selectedSlot.time.toISOString(),
        status: 'scheduled',
        paid: false,
        fee: 0.00,
      };

      console.log('Sending appointment data:', appointmentData);

      try {
        const response = await axios.post(`${baseAPI}/appointment/appointments/`, appointmentData, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        alert('Appointment booked successfully!');
        console.log('Appointment response:', response.data);
        // Mark slot as booked
        setAvailabilities(availabilities.map(avail => 
          avail.id === selectedSlot.availability_id ? {
            ...avail,
            slots: avail.slots.map(slot => 
              slot.time.getTime() === selectedSlot.time.getTime() ? { ...slot, booked: true } : slot
            )
          } : avail
        ));
        setSelectedSlot(null);
      } catch (error) {
        console.error('Error booking appointment:', error.response?.data || error.message);
        alert('An appointment with this doctor at this time already exists.');
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
          availabilities.map((availability) => {
            const days = availability.days_of_week ? availability.days_of_week.split(',').map(day => daysOfWeekMap[day.trim()]).join(', ') : '';
            return (
              <div key={availability.id} className="mt-4">
                <h3 className="text-lg font-semibold">{availability.doctor_name} {availability.doctor_surname} available on {days} {availability.day_of_month ? `and day ${availability.day_of_month}` : ''} in {availability.month}/{availability.year}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {availability.slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot({ availability_id: availability.id, doctor_user_id: availability.doctor_user_id, time: slot.time })}
                      className={`p-2 rounded ${slot.booked ? 'bg-red-500' : selectedSlot?.availability_id === availability.id && selectedSlot?.time.getTime() === slot.time.getTime() ? 'bg-green-500' : 'bg-gray-300'}`}
                      disabled={slot.booked}
                    >
                      {slot.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
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
