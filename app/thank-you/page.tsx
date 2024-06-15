"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";

const ThankYouPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-10 text-center">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mb-8">
          Your order has been received and is being processed. You will receive
          an email confirmation shortly.
        </p>
        <p className="text-gray-600 mb-8">
          You will be redirected to the homepage in 5 seconds.
        </p>
        <button
          onClick={() => router.push("/HomePage")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Go to Homepage Now
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
