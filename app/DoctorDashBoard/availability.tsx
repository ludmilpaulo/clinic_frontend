import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectUser } from '@/redux/slices/authSlice';
import { createDoctorAvailability, getDoctorAvailabilities, updateDoctorAvailability, deleteDoctorAvailability } from '@/services/doctorAvailabilityService';
import { getConsultationCategories, createConsultationCategory } from '@/services/consultationCategoryService';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css'; // Custom CSS for additional styling

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
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingAvailability, setEditingAvailability] = useState<any | null>(null);

  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  useEffect(() => {
    if (token) {
      getConsultationCategories(token).then(response => {
        setCategories(response);
      }).catch(error => {
        console.error('Error fetching categories:', error);
      });

      getDoctorAvailabilities(token).then(response => {
        setAvailabilities(response);
      }).catch(error => {
        console.error('Error fetching availabilities:', error);
      });
    }
  }, [token]);

  const handleDayChange = (day: string) => {
    setDaysOfWeek(prevDays => 
      prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
    );
  };

  const handleEdit = (availability: any) => {
    setEditingAvailability(availability);
    setDaysOfWeek(availability.days_of_week.map(String));
    setStartTime(availability.start_time);
    setEndTime(availability.end_time);
    setConsultationCategory(categories.find(category => category.id === availability.consultation_category)?.name || '');
    setRecurringMonthly(availability.recurring_monthly);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (token) {
      try {
        await deleteDoctorAvailability(id, token);
        setAvailabilities(availabilities.filter(avail => avail.id !== id));
        alert('Availability deleted successfully!');
      } catch (error) {
        console.error('Error deleting availability:', error);
        alert('Error deleting availability.');
      }
    }
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
        if (editingAvailability) {
          await updateDoctorAvailability(editingAvailability.id, availabilityData, token);
          setAvailabilities(availabilities.map(avail => (avail.id === editingAvailability.id ? { ...availabilityData, id: editingAvailability.id } : avail)));
          setEditingAvailability(null);
        } else {
          const newAvailability = await createDoctorAvailability(availabilityData, token);
          setAvailabilities([...availabilities, newAvailability]);
        }
        setShowForm(false);
        alert('Availability saved successfully!');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      alert(`Error saving availability: ${error.response?.data || error.message}`);
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const day = date.getDay().toString();
      const availability = availabilities.find(avail => avail.days_of_week.includes(day));
      if (availability) {
        return 'bg-green-200';
      }
    }
    return '';
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Doctor's Availability</h1>
      <div className="calendar-container mb-6">
        <Calendar
          className="w-full"
          tileClassName={tileClassName}
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const day = date.getDay().toString();
              const availability = availabilities.find(avail => avail.days_of_week.includes(day));
              if (availability) {
                return (
                  <div className="text-center text-black bg-green-400 rounded p-1">
                    <p>{availability.start_time} <br /> {availability.end_time}</p>
                  </div>
                );
              }
            }
          }}
        />
      </div>
      <button 
        onClick={() => setShowForm(true)}
        className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Add Availability
      </button>
      {availabilities.map(availability => (
        <div key={availability.id} className="mt-4 flex justify-between items-center">
         
          <div>
            <button
              onClick={() => handleEdit(availability)}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(availability.id)}
              className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Set Your Availability</h2>
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
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingAvailability(null);
                }}
                className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;
