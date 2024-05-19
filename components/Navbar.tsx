"use client";
import React, { useState } from 'react';
import { FaSearch, FaHome, FaInfo, FaEnvelope, FaUser, FaBars, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectCartItems } from '@/redux/slices/basketSlice'; // Update the import path as needed

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useSelector(selectCartItems);
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-10 top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold">
            <Link href="/">
              <span className="cursor-pointer">MyLogo</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link href="/">
              <span className="text-gray-800 hover:text-gray-600 flex items-center cursor-pointer">
                <FaHome className="mr-1" /> Home
              </span>
            </Link>
            <Link href="/AboutPage">
              <span className="text-gray-800 hover:text-gray-600 flex items-center cursor-pointer">
                <FaInfo className="mr-1" /> About
              </span>
            </Link>
            <Link href="/ContactPage">
              <span className="text-gray-800 hover:text-gray-600 flex items-center cursor-pointer">
                <FaEnvelope className="mr-1" /> Contact
              </span>
            </Link>
            <Link href="/profile">
              <span className="text-gray-800 hover:text-gray-600 flex items-center cursor-pointer">
                <FaUser className="mr-1" /> Profile
              </span>
            </Link>
            <Link href="/CartPage">
              <span className="text-gray-800 hover:text-gray-600 flex items-center relative cursor-pointer">
                <FaShoppingCart className="mr-1" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                    {cartItemCount}
                  </span>
                )}
                Cart
              </span>
            </Link>
          </div>
          <div className="relative md:flex items-center hidden">
            <input
              type="text"
              className="border rounded py-1 px-3"
              placeholder="Search..."
            />
            <FaSearch className="absolute right-2 text-gray-600" />
          </div>
          <div className="md:hidden flex items-center">
            <Link href="/cart">
              <span className="text-gray-800 hover:text-gray-600 flex items-center relative cursor-pointer mr-4">
                <FaShoppingCart />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                    {cartItemCount}
                  </span>
                )}
              </span>
            </Link>
            <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
              <FaBars />
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-4">
            <Link href="/">
              <span className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer">
                <FaHome className="mr-1" /> Home
              </span>
            </Link>
            <Link href="/about">
              <span className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer">
                <FaInfo className="mr-1" /> About
              </span>
            </Link>
            <Link href="/contact">
              <span className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer">
                <FaEnvelope className="mr-1" /> Contact
              </span>
            </Link>
            <Link href="/profile">
              <span className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer">
                <FaUser className="mr-1" /> Profile
              </span>
            </Link>
            <div className="relative mt-2">
              <input
                type="text"
                className="border rounded py-1 px-3 w-full"
                placeholder="Search..."
              />
              <FaSearch className="absolute right-2 text-gray-600" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
