"use client";
import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { motion } from "framer-motion";
import Image from 'next/image';
import { fetchAboutUsData } from '@/services/adminService';
import { AboutUsData, ApiResponse } from '@/utils/types';

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data: ApiResponse | null = await fetchAboutUsData();
      if (data) {
        setHeaderData(data[0]);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900
    text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-white mb-2">Download our App</h4>
            <div className="flex space-x-4">
              
              
              <Link href="https://play.google.com/store/apps/details?id=com.ludmil.kudyaclient">
                <span className="flex items-center space-x-2 hover:opacity-75 transition duration-300 cursor-pointer">
                  <Image src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Google Play" width={128} height={40} />
                </span>
              </Link>
            </div>
          </div>

          <div className="text-center  text-white md:text-left">
            <div className="space-y-2">
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <FaEnvelope className="w-5 h-5" />
                <span className="font-bold">{headerData?.email}</span>
              </p>
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <FaPhone className="w-5 h-5" />
                <span className="font-bold ">{headerData?.phone}</span>
              </p>
              <p className="flex items-center justify-center md:justify-start space-x-2">
                <FaMapMarkerAlt className="w-5 h-5" />
                <span className="font-bold ">{headerData?.address}</span>
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="flex space-x-4 text-white justify-center md:justify-end"
          >
            <>
              {headerData?.facebook && <SocialIcon url={headerData.facebook} />}
              {headerData?.linkedin && <SocialIcon url={headerData.linkedin} />}
              {headerData?.twitter && <SocialIcon url={headerData.twitter} />}
              {headerData?.instagram && <SocialIcon url={headerData.instagram} />}
            </>
          </motion.div>

          <div className="text-center md:text-right  text-white">
            <ul className="space-y-2">
              <li>
                <Link href="/ContactPage">
                  <span className="hover:opacity-75 transition duration-300 cursor-pointer font-bold ">Contact-us</span>
                </Link>
              </li>
              <li>
                <Link href="/AboutPage">
                  <span className="hover:opacity-75 transition duration-300 cursor-pointer font-bold">About Us</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-sm font-bold text-white">&copy; {currentYear} All rights reserved  </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
