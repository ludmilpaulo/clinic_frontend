import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchAboutUsData } from "@/services/adminService";
import { AboutUsData, ApiResponse } from "@/utils/types";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Transition } from "@headlessui/react";

const HeroSection: React.FC = () => {
  const [headerData, setHeaderData] = useState<AboutUsData | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      const data: ApiResponse | null = await fetchAboutUsData();
      if (data && Array.isArray(data) && data.length > 0) {
        setHeaderData(data[0]);
      }
    };
    fetchData();
  }, []);

  const backgroundImage =
    headerData?.backgroundApp ??
    "https://ludmil.pythonanywhere.com/media/logo/logo2_w3URzZg.png"; // Provide a fallback image path

  const handleViewProducts = () => {
    router.push("/HomePage"); // Replace with the path to your products page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 p-4">
      <Transition
        show={!isMounted || !headerData}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        </div>
      </Transition>

      {headerData && (
        <div className="relative w-full h-full">
          <div className="absolute inset-0">
            <Image
              src={backgroundImage}
              alt="Background"
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center bg-black bg-opacity-50 p-4">
            <motion.h2
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-2xl md:text-4xl font-semibold text-white mb-2"
            >
              THE BEST
            </motion.h2>
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-4xl md:text-6xl font-bold text-blue-500 mb-4"
            >
              MEDICAL
            </motion.h1>
            <motion.h3
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="text-2xl md:text-4xl font-semibold text-white mb-4"
            >
              HEALTHY CENTRE
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
              className="text-lg md:text-xl text-gray-300 mb-6 max-w-xl"
            >
              At Men&apos;s Clinic, we are dedicated to providing specialized
              products and treatments designed exclusively for men&apos;s
              health.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.5 }}
              className="mt-4 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
              onClick={handleViewProducts}
            >
              VIEW OUR PRODUCTS
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
