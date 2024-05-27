"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { Drug } from '@/utils/types';
import { useDispatch, useSelector } from "react-redux";
import { updateBasket, selectCartItems, decreaseBasket } from '@/redux/slices/basketSlice'; // Update the import path as needed

type Props = {
  drug: Drug;
};

const DrugCard: React.FC<Props> = ({ drug }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const currentImageIndex = 0; // Assuming you handle image index somehow

  const [inCart, setInCart] = useState(false);

  const handleAdd = (drug: Drug) => {
    const currentCartQuantity = cartItems.find((item) => item.id === drug.id)?.quantity ?? 0;
    if (currentCartQuantity < drug.quantity_available) {
      dispatch(updateBasket(drug));
    } else {
      alert("Cannot add more than available stock");
    }
  };

  const handleDecrease = (drugId: number) => {
    dispatch(decreaseBasket(drugId));
  };

  useEffect(() => {
    if (drug) {
      const item = cartItems.find((item) => item.id === drug.id);
      setInCart(item ? (item.quantity ?? 0) > 0 : false);
    }
  }, [cartItems, drug]);

  if (!drug || drug.quantity_available <= 0) return null; // Don't display if drug is undefined or quantity is less than or equal to 0

  return (
    <div className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative h-48 rounded-t-lg overflow-hidden">
        {drug.image_urls && drug.image_urls[currentImageIndex] ? (
          <Image
            src={drug.image_urls[currentImageIndex]}
            alt={drug.name}
            layout="fill"
            objectFit="cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span>No Image Available</span>
          </div>
        )}
      </div>
      <div className="relative p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-semibold text-lg text-gray-900">{drug.name}</p>
          <p className="font-semibold text-lg text-gray-900">R{drug.price}</p>
        </div>
       
        {drug.quantity_available < 10 && (
          <p className="text-red-500 text-sm mt-2">
            Warning: Low stock, only {drug.quantity_available} left!
          </p>
        )}
      </div>
      <div className="relative flex justify-between items-center p-4">
        {inCart ? (
          <div className="flex space-x-2 items-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-300"
              onClick={() => handleDecrease(drug.id)}
            >
              -
            </button>
            <span className="text-lg">{cartItems.find((item) => item.id === drug.id)?.quantity ?? 0}</span>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
              onClick={() => handleAdd(drug)}
            >
              +
            </button>
          </div>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors duration-300"
            onClick={() => handleAdd(drug)}
          >
            Add to Cart
          </button>
        )}
      </div>
      <div className="relative p-4">
        {inCart ? (
          <Link
            href="/CartPage"
            className="mt-6 text-blue-500 hover:text-blue-700 transition-colors duration-300"
          >
            Go to Cart
          </Link>
        ) : (
          <Link
            href={{
              pathname: "/DrugPage",
              query: { id: drug.id },
            }}
            className="mt-6 text-blue-500 hover:text-blue-700 transition-colors duration-300"
          >
            View Product
          </Link>
        )}
      </div>
    </div>
  );
};

export default DrugCard;
