"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaSearch,
  FaHome,
  FaInfo,
  FaEnvelope,
  FaUser,
  FaBars,
  FaShoppingCart,
  FaSignInAlt,
} from "react-icons/fa";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectCartItems } from "@/redux/slices/basketSlice"; // Update the import path as needed
import SearchResults from "./SearchResults";
import { fetchAboutUsData } from "@/services/adminService";
import { AboutUsData } from "@/utils/types";
import { selectUser } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";

const Navbar: React.FC = () => {
  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItems = useSelector(selectCartItems);
  const cartItemCount = cartItems.reduce(
    (count, item) => count + (item.quantity ?? 0),
    0,
  );

  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAboutUsData();
      console.log("Fetched header data:", data);
      setHeaderData(data?.about || null);
    };
    fetchData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 shadow-lg fixed w-full z-10 top-0">
        <div className="container mx-auto px-4">
          <div className="flex text-white text-bold justify-between items-center py-4">
            <div className="text-2xl font-bold">
              <Link href="/HomePage">
                <span className="cursor-pointer flex items-center">
                  {headerData?.logo && (
                    <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mr-2">
                      <Image
                        src={headerData.logo}
                        alt={headerData.title}
                        layout="fill"
                        objectFit="contain"
                        className="object-cover rounded-full"
                      />
                    </div>
                  )}
                </span>
              </Link>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link href="/HomePage">
                <span className="hover:text-gray-600 flex items-center cursor-pointer">
                  <FaHome className="mr-1" /> Home
                </span>
              </Link>
              <Link href="/AboutPage">
                <span className="hover:text-gray-600 flex items-center cursor-pointer">
                  <FaInfo className="mr-1" /> About
                </span>
              </Link>
              <Link href="/ContactPage">
                <span className="hover:text-gray-600 flex items-center cursor-pointer">
                  <FaEnvelope className="mr-1" /> Contact
                </span>
              </Link>
              <Link href="/CartPage">
                {cartItemCount > 0 && (
                  <span className="hover:text-gray-600 flex items-center relative cursor-pointer">
                    <FaShoppingCart className="mr-1" />
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                      {cartItemCount}
                    </span>
                    Cart
                  </span>
                )}
              </Link>
              {user?.is_staff && (
                <Link href="/Admin">
                  <span className="hover:text-gray-600 flex items-center cursor-pointer">
                    <FaUser className="mr-1" /> Staff Profile
                  </span>
                </Link>
              )}
              {user ? (
                <Link href="/UserProfile">
                  <span className="hover:text-gray-600 flex items-center cursor-pointer">
                    <FaUser className="mr-1" /> Profile
                  </span>
                </Link>
              ) : (
                <Link href="/Login">
                  <span className="hover:text-gray-600 flex items-center cursor-pointer">
                    <FaSignInAlt className="mr-1" /> Login
                  </span>
                </Link>
              )}
            </div>
            <div className="relative hidden md:flex items-center">
              <form className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border rounded py-1 px-3"
                  placeholder="Search..."
                />
                <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600" />
              </form>
            </div>
            <div className="md:hidden flex items-center">
              <Link href="/CartPage">
                {cartItemCount > 0 && (
                  <span className="hover:text-gray-600 flex items-center relative cursor-pointer mr-4">
                    <FaShoppingCart />
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                      {cartItemCount}
                    </span>
                  </span>
                )}
              </Link>
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-4 pt-2 pb-4">
              <Link href="/HomePage">
                <span
                  className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer"
                  onClick={handleMenuItemClick}
                >
                  <FaHome className="mr-1" /> Home
                </span>
              </Link>
              <Link href="/AboutPage">
                <span
                  className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer"
                  onClick={handleMenuItemClick}
                >
                  <FaInfo className="mr-1" /> About
                </span>
              </Link>
              <Link href="/ContactPage">
                <span
                  className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer"
                  onClick={handleMenuItemClick}
                >
                  <FaEnvelope className="mr-1" /> Contact
                </span>
              </Link>
              {user?.is_staff && (
                <Link href="/Admin">
                  <span
                    className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer"
                    onClick={handleMenuItemClick}
                  >
                    <FaUser className="mr-1" /> Staff Profile
                  </span>
                </Link>
              )}
              {user ? (
                <Link href="/UserProfile">
                  <span
                    className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer"
                    onClick={handleMenuItemClick}
                  >
                    <FaUser className="mr-1" /> Profile
                  </span>
                </Link>
              ) : (
                <Link href="/Login">
                  <span
                    className="block text-gray-800 hover:text-gray-600 py-2 flex items-center cursor-pointer"
                    onClick={handleMenuItemClick}
                  >
                    <FaSignInAlt className="mr-1" /> Login
                  </span>
                </Link>
              )}
              <div className="relative mt-2">
                <form className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border rounded py-1 px-3 w-full"
                    placeholder="Search..."
                  />
                  <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600" />
                </form>
              </div>
            </div>
          </div>
        )}
      </nav>
      {isSearchOpen && (
        <SearchResults
          query={searchQuery}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
