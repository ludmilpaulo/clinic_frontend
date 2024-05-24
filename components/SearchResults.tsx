// components/SearchResults.tsx
"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Drug } from '@/utils/types';
import DrugCard from './DrugCard';
import { baseAPI } from '@/utils/variables';
import { FaTimes } from 'react-icons/fa';
import { Transition } from '@headlessui/react';

type SearchResultsProps = {
  query: string;
  onClose: () => void;
};

const SearchResults: React.FC<SearchResultsProps> = ({ query, onClose }) => {
  const [results, setResults] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setLoading(true);
        axios.get(`${baseAPI}/pharmacy/search/?query=${query}`)
          .then(response => {
            console.log("search =>", response.data)
            setResults(response.data);
            setLoading(false);
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
          });
      } else {
        setResults([]);
      }
    }, 300); // Adjust debounce delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-4xl p-4 rounded-lg shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
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
            {error && <div className="text-red-500 text-center mb-4">Error: {error}</div>}
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((drug: Drug) => (
                <DrugCard key={drug.id} drug={drug} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults
