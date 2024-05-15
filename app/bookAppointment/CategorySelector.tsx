// CategorySelector.tsx

import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchDoctors } from './fetchData';

const CategorySelector = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
    };
    getCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const getDoctors = async () => {
        const doctorsData = await fetchDoctors(selectedCategory);
        setDoctors(doctorsData);
      };
      getDoctors();
    }
  }, [selectedCategory]);

  return (
    <div className="category-selector">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Select Category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <div className="doctors-list">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card p-4 border m-2 rounded">
            {doctor.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
