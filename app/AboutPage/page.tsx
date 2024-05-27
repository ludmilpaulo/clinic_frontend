"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Transition } from '@headlessui/react';
import { SocialIcon } from 'react-social-icons';
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
          {data && data.about && (
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
                <h1 className="text-4xl font-bold mb-4 text-gray-800">{data.about.title}</h1>
                <p className="text-gray-700 text-center mb-8" dangerouslySetInnerHTML={{ __html: data.about.about }} />
                <div className="flex space-x-4 mb-8">
                  {data.about.github && (
                    <SocialIcon url={data.about.github} className="cursor-pointer" target="_blank" fgColor="#fff" style={{ height: 35, width: 35 }} />
                  )}
                  {data.about.linkedin && (
                    <SocialIcon url={data.about.linkedin} className="cursor-pointer" target="_blank" fgColor="#fff" style={{ height: 35, width: 35 }} />
                  )}
                  {data.about.facebook && (
                    <SocialIcon url={data.about.facebook} className="cursor-pointer" target="_blank" fgColor="#fff" style={{ height: 35, width: 35 }} />
                  )}
                  {data.about.twitter && (
                    <SocialIcon url={data.about.twitter} className="cursor-pointer" target="_blank" fgColor="#fff" style={{ height: 35, width: 35 }} />
                  )}
                  {data.about.instagram && (
                    <SocialIcon url={data.about.instagram} className="cursor-pointer" target="_blank" fgColor="#fff" style={{ height: 35, width: 35 }} />
                  )}
                </div>
                <div className="w-full md:w-2/3 lg:w-1/2 mt-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Testimonials</h2>
                  {data.testimonials && data.testimonials.length > 0 ? (
                    data.testimonials.map((testimonial: any) => (
                      <div key={testimonial.author} className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
                        <p className="text-gray-700 italic">{"&quot;" + testimonial.content + "&quot;"}</p>
                        <p className="text-gray-900 font-semibold mt-2">- {testimonial.author}</p>
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
