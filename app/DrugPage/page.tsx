"use client";
import React, { useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { FaShoppingCart, FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBasket, selectCartItems } from '@/redux/slices/basketSlice'; // Update the import path as needed
import { Drug } from '@/utils/types';
import { baseAPI } from '@/utils/variables';
import withActiveUser from '@/hoc/withActiveUser';

const DrugPage: React.FC = () => {
  const [drug, setDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  const drugId = searchParams.get('id');

  useEffect(() => {

    if (drugId) {
      axios.get(`${baseAPI}/pharmacy/pharmacy/detail/${drugId}/`)
        .then(response => {
          setDrug(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [drugId]);

  const handleAddToCart = (drug: Drug) => {
    dispatch(updateBasket(drug));
  };

  const isInCart = (drug: Drug) => {
    return cartItems.some(item => item.id === drug.id);
  };

  const nextSlide = () => {
    if (drug && drug.image_urls) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % drug.image_urls.length);
    }
  };

  const prevSlide = () => {
    if (drug && drug.image_urls) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? drug.image_urls.length - 1 : prevIndex - 1));
    }
  };

  return (
    <div className="container mx-auto pt-56">
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Transition>

      {!loading && (
        <>
          {error && <div className="text-center text-red-500 mb-4">Error: {error}</div>}
          {drug && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              <button
                className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300 mb-4"
                onClick={() => router.back()}
              >
                <FaArrowLeft className="mr-2" /> Back to Products
              </button>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 relative mb-4 md:mb-0">
                  {drug.image_urls && drug.image_urls.length > 0 ? (
                    <>
                      <Image
                        src={drug.image_urls[currentImageIndex]}
                        alt={drug.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded"
                      />
                      <button
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition-colors duration-300"
                        onClick={prevSlide}
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 transition-colors duration-300"
                        onClick={nextSlide}
                      >
                        <FaChevronRight />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                      <span>No Images Available</span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-1/2 md:pl-6">
                  <h1 className="text-2xl font-bold mb-2">{drug.name}</h1>
                  <p className="text-lg font-semibold text-gray-700 mb-4">R{drug.price}</p>
                  <p className="text-gray-600 mb-2"><strong>Category:</strong> {drug.category_name}</p>
                  <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: drug.description }} />
                  {drug.quantity_available < 10 && (
                    <p className="text-red-500 text-sm mb-4">
                      Warning: Low stock, only {drug.quantity_available} left!
                    </p>
                  )}
                  <button
                    className={`flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors duration-300 ${isInCart(drug) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleAddToCart(drug)}
                    disabled={isInCart(drug)}
                  >
                    <FaShoppingCart className="mr-2" /> {isInCart(drug) ? 'Already in Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const DrugPageDetails = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <DrugPage />
  </Suspense>
);


export default DrugPageDetails;
