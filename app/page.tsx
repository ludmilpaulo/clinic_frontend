"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Transition } from '@headlessui/react';
import DrugCard from '../components/DrugCard';
import { Drug } from '@/utils/types';
import { baseAPI } from '@/utils/variables';

const HomePage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    axios.get(`${baseAPI}/pharmacy/pharmacy/drugs/`)
      .then(response => {
        setDrugs(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });

    axios.get(`${baseAPI}/pharmacy/pharmacy/categories/`)
      .then(response => {
        setCategories(['All', ...response.data.map((category: { name: string }) => category.name)]);
      })
      .catch(error => {
        console.error("Error fetching categories", error);
      });
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredDrugs = selectedCategory === 'All' 
    ? drugs 
    : drugs.filter(drug => drug.category_name === selectedCategory);

  return (
    <div className="container mx-auto p-4 pt-48">
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div>
          {loading && (
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
              <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </Transition>

      {!loading && (
        <>
          {error && <div className="text-red-500 mb-4">Error: {error}</div>}
          <div className="mb-4">
            <label className="font-semibold text-lg mr-2">Filter by Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e.target.value)} 
              className="border rounded px-4 py-2"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDrugs.map((drug: Drug) => (
              <DrugCard key={drug.id} drug={drug} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
