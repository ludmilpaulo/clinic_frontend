"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { fetchAboutUsData } from "@/services/adminService";
import { AboutUsData, ApiResponse } from "@/utils/types";
import { motion } from "framer-motion";
import { baseAPI } from "@/utils/variables";
import { Transition } from "@headlessui/react";
import Link from "next/link";

const ContactPage: React.FC = () => {
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data: ApiResponse | null = await fetchAboutUsData();
      if (data) {
        setHeaderData(data.about);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${baseAPI}/info/contacts/`, formData);
      setSuccess(true);
      setFormData({
        subject: "",
        email: "",
        phone: "",
        message: "",
      });
      setLoading(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
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
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Transition>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Contact Us
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Have any questions or feedback? We&apos;d love to hear from you!
        </p>
        {success && (
          <p className="text-green-500 mb-4 text-center">
            Thank you for contacting us. We will get back to you soon.
          </p>
        )}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows={4}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center mt-12">
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <FaMapMarkerAlt className="text-blue-500 text-4xl mb-2" />
          <p className="text-gray-700">{headerData?.address}</p>
        </div>
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <FaPhone className="text-blue-500 text-4xl mb-2" />
          <p className="text-gray-700">
            <Link href={`tel:${headerData?.phone}`}>
              <span>{headerData?.phone}</span>
            </Link>
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FaEnvelope className="text-blue-500 text-4xl mb-2" />
          <p className="text-gray-700">
            <Link href={`mailto:${headerData?.email}`}>
              <span>{headerData?.email}</span>
            </Link>
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-8 space-x-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="flex space-x-4 text-white justify-center md:justify-end"
        >
          <>
            {headerData?.facebook && (
              <Link
                href={headerData.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-4xl text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  <FaFacebook />
                </span>
              </Link>
            )}
            {headerData?.linkedin && (
              <Link
                href={headerData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-4xl text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  <FaLinkedin />
                </span>
              </Link>
            )}
            {headerData?.twitter && (
              <Link
                href={headerData.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-4xl text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  <FaTwitter />
                </span>
              </Link>
            )}
            {headerData?.instagram && (
              <Link
                href={headerData.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-4xl text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  <FaInstagram />
                </span>
              </Link>
            )}
            {headerData?.phone && (
              <Link
                href={`https://wa.me/${headerData.phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-4xl text-green-600 hover:text-green-800 transition-colors duration-300">
                  <FaWhatsapp />
                </span>
              </Link>
            )}
          </>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
