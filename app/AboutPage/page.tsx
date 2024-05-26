"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Transition } from '@headlessui/react';
import { baseAPI } from '@/utils/variables';

const AboutPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${baseAPI}/info/about-us/`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

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
          <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Transition>

      {!loading && (
        <>
          {error && <div className="text-center text-red-500 mb-4">Error: {error}</div>}
          {data && (
            <div className="bg-white shadow-lg rounded-lg p-6">
              {data.about.backgroundImage && (
                <div className="relative h-64 w-full mb-4">
                  <Image
                    src={data.about.backgroundImage}
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}
              <div className="flex flex-col items-center">
                {data.about.logo && (
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={data.about.logo}
                      alt="Logo"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                )}
                <h1 className="text-3xl font-bold mb-2">{data.about.title}</h1>
                <p className="text-gray-700 text-center mb-4" dangerouslySetInnerHTML={{ __html: data.about.about }} />
                <div className="flex space-x-4 mb-4">
                  {data.about.github && (
                    <a href={data.about.github} target="_blank" rel="noopener noreferrer">
                      <FaGithub className="text-gray-800 hover:text-gray-600 transition-colors duration-300" />
                    </a>
                  )}
                  {data.about.linkedin && (
                    <a href={data.about.linkedin} target="_blank" rel="noopener noreferrer">
                      <FaLinkedin className="text-blue-700 hover:text-blue-500 transition-colors duration-300" />
                    </a>
                  )}
                  {data.about.facebook && (
                    <a href={data.about.facebook} target="_blank" rel="noopener noreferrer">
                      <FaFacebook className="text-blue-600 hover:text-blue-400 transition-colors duration-300" />
                    </a>
                  )}
                  {data.about.twitter && (
                    <a href={data.about.twitter} target="_blank" rel="noopener noreferrer">
                      <FaTwitter className="text-blue-500 hover:text-blue-300 transition-colors duration-300" />
                    </a>
                  )}
                  {data.about.instagram && (
                    <a href={data.about.instagram} target="_blank" rel="noopener noreferrer">
                      <FaInstagram className="text-pink-500 hover:text-pink-300 transition-colors duration-300" />
                    </a>
                  )}
                </div>
               
                <div className="w-full md:w-2/3 lg:w-1/2 mt-6">
                  <h2 className="text-2xl font-bold mb-2">Testimonials</h2>
                  {data.testimonials.length > 0 ? (
                    data.testimonials.map((testimonial: any) => (
                      <div key={testimonial.author} className="mb-4">
                        <p className="text-gray-700 italic">{"&quot;" + testimonial.content + "&quot;"}</p>
                        <p className="text-gray-900 font-semibold">- {testimonial.author}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-700">No testimonials available.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AboutPage;
