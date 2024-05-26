"use client";
import axios from 'axios';
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
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
  const currentDay = new Date().getDate();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [dayOfMonth, setDayOfMonth] = useState<number | ''>(currentDay);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
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
      }).catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching categories:', error.response?.data);
        } else {
          console.error('Error fetching categories:', error);
        }
      });

      getDoctorAvailabilities(token).then(response => {
        setAvailabilities(response);
      }).catch((error: unknown) => {
        if (axios.isAxiosError(error)) {
          console.error('Error fetching availabilities:', error.response?.data);
        } else {
          console.error('Error fetching availabilities:', error);
        }
      });
    }
  }, [token]);

  const handleDayChange = (day: string) => {
    setDayOfMonth(''); // Clear day of the month if selecting days of the week
    setDaysOfWeek(prevDays => 
      prevDays.includes(day) ? prevDays.filter(d => d !== day) : [...prevDays, day]
    );
  };

  const handleDayOfMonthChange = (day: number) => {
    setDaysOfWeek([]); // Clear days of the week if selecting day of the month
    setDayOfMonth(day);
  };

  const handleEdit = (availability: any) => {
    setEditingAvailability(availability);
    setDaysOfWeek(availability.days_of_week ? availability.days_of_week.split(',').map(String) : []);
    setDayOfMonth(availability.day_of_month || '');
    setStartTime(availability.start_time);
    setEndTime(availability.end_time);
    setYear(availability.year || currentYear);
    setMonth(availability.month || currentMonth);
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

  const handleCalendarClick = (date: Date) => {
    setSelectedDate(date);
    setDayOfMonth(date.getDate());
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1); // JavaScript months are 0-based
    setDaysOfWeek([date.getDay().toString()]);
    setShowForm(true);
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
      user_id: user?.id,
      consultation_category: categoryId,
      days_of_week: daysOfWeek.length > 0 ? daysOfWeek : null,
      day_of_month: dayOfMonth || null,
      start_time: startTime,
      end_time: endTime,
      year: year || null,
      month: month || null,
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
      if (axios.isAxiosError(error)) {
        console.error('Error saving availability:', error.response?.data);
        alert(`Error saving availability: ${error.response?.data || error.message}`);
      } else {
        console.error('Error saving availability:', error);
        alert(`Error saving availability: `);
      }
    }
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const day = date.getDay().toString();
      const availability = availabilities.find(avail => avail.days_of_week?.includes(day) || avail.day_of_month === date.getDate());
      if (availability) {
        return 'bg-green-200';
      }
    }
    return '';
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Doctor&apos;s Availability</h1>
      <div className="calendar-container mb-6">
        <Calendar
          className="w-full"
          tileClassName={tileClassName}
          onClickDay={handleCalendarClick}
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const day = date.getDay().toString();
              const availability = availabilities.find(avail => avail.days_of_week?.includes(day) || avail.day_of_month === date.getDate());
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {availabilities.map(availability => (
          <div key={availability.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-start">
            <div className="text-lg font-semibold mb-2">
              {availability.year && <span>{availability.year}</span>}
              {availability.month && <span>/{availability.month}</span>}
              {availability.day_of_month && <span>/{availability.day_of_month}</span>}
            </div>
            <div className="text-sm mb-4">
              <p>Start: {availability.start_time}</p>
              <p>End: {availability.end_time}</p>
            </div>
            <div className="flex space-x-2 mt-auto">
              <button
                onClick={() => handleEdit(availability)}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(availability.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
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
                      <span>{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][parseInt(day)]}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Day of the Month</label>
                <select
                  value={dayOfMonth}
                  onChange={(e) => handleDayOfMonthChange(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
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
                <label className="block text-sm font-bold mb-2">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {Array.from({ length: 10 }, (_, i) => currentYear + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Month</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
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
