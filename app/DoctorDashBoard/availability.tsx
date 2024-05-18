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
  const [consultationCategory, setConsultationCategory] = useState<string>('');
  const [recurringMonthly, setRecurringMonthly] = useState<boolean>(false);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let categoryId = categories.find(category => category.name === consultationCategory)?.id;

    if (!categoryId) {
      try {
        if (token) {
          const addedCategory = await createConsultationCategory(consultationCategory, token);
          setCategories(prevCategories => [...prevCategories, addedCategory]);
          categoryId = addedCategory.id;
        }
      } catch (error) {
        console.error('Error adding category:', error);
        alert('Error adding category.');
        return;
      }
    }

    const availabilityData = {
      user_id: user?.user_id,
      consultation_category: categoryId,
      days_of_week: daysOfWeek,
      start_time: startTime,
      end_time: endTime,
      recurring_monthly: recurringMonthly,
    };

    console.log('Submitting availability data:', availabilityData);

    try {
      if (token) {
        await createDoctorAvailability(availabilityData, token);
        alert('Availability saved successfully!');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      alert(`Error saving availability: ${error.response.data}`);
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
          <input
            type="text"
            list="consultationCategories"
            value={consultationCategory}
            onChange={(e) => setConsultationCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Type to add or select category"
          />
          <datalist id="consultationCategories">
            {categories.map(category => (
              <option key={category.id} value={category.name} />
            ))}
          </datalist>
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

