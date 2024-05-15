import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectUser } from '@/redux/slices/authSlice';
import { createDoctorAvailability } from '@/services/doctorAvailabilityService';
import { getConsultationCategories, createConsultationCategory } from '@/services/consultationCategoryService';

interface AvailabilityProps {
  userId: number | null;
}

const Availability: React.FC<AvailabilityProps> = ({ userId }) => {
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [consultationCategory, setConsultationCategory] = useState<number | null>(null);
  const [recurringMonthly, setRecurringMonthly] = useState<boolean>(false);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');

  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  useEffect(() => {
    if (token) {
      getConsultationCategories(token).then(response => {
        console.log('Categories fetched:', response);
        setCategories(response);
      }).catch(error => {
        console.error('Error fetching categories:', error);
      });
    }
  }, [token]);

  const handleDayChange = (day: string) => {
    setDaysOfWeek(prevDays => 
      prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
    );
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (token && newCategory) {
        const addedCategory = await createConsultationCategory(newCategory, token);
        setCategories(prevCategories => [...prevCategories, addedCategory]);
        setNewCategory('');
        alert('Category added successfully!');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const availabilityData = {
      doctor: userId,
      consultation_category: consultationCategory,
      days_of_week: daysOfWeek.join(','),
      start_time: startTime,
      end_time: endTime,
      recurring_monthly: recurringMonthly,
    };
    try {
      if (token) {
        await createDoctorAvailability(availabilityData, token);
        alert('Availability saved successfully!');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      alert('Error saving availability.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Set Your Availability</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Days of the Week</label>
          <div className="grid grid-cols-7 gap-2">
            {['0', '1', '2', '3', '4', '5', '6'].map(day => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={day}
                  checked={daysOfWeek.includes(day)}
                  onChange={() => handleDayChange(day)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][parseInt(day)]}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Consultation Category</label>
          <div className="relative">
            <select
              onChange={(e) => setConsultationCategory(Number(e.target.value))}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="" disabled selected>Select category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.59 7.41L10 11.83l4.41-4.42L16 8l-6 6-6-6z"/></svg>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Add New Category</label>
          <form onSubmit={handleAddCategory} className="flex items-center space-x-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Add
            </button>
          </form>
        </div>
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={recurringMonthly}
              onChange={() => setRecurringMonthly(!recurringMonthly)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Recurring Monthly</span>
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Save Availability
        </button>
      </form>
    </div>
  );
};

export default Availability;
