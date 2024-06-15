"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import { SocialIcon } from "react-social-icons";
import { baseAPI } from "@/utils/variables";

const AboutPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${baseAPI}/info/about-us/`)
      .then((response) => {
        console.log("about data", response.data);
        const aboutData = response.data[0]; // Access the first element of the array
        setData(aboutData);
        setLoading(false);
      })
      .catch((error) => {
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
          <div className="w-32 h-32 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Transition>

      {!loading && (
        <>
          {error && (
            <div className="text-center text-red-500 mb-4">Error: {error}</div>
          )}
          {data && (
            <div className="relative bg-white shadow-lg rounded-lg p-6">
              {data.backgroundImage && (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={data.backgroundImage}
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg opacity-20"
                  />
                </div>
              )}
              <div className="relative flex flex-col items-center z-10">
                {data.logo && (
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={data.logo}
                      alt="Logo"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                )}
                <h1 className="text-4xl font-bold mb-4 text-gray-800">
                  {data.title}
                </h1>
                <p
                  className="text-gray-700 text-center mb-8 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data.about }}
                />
                <div className="flex space-x-4 mb-8">
                  {data.linkedin && (
                    <SocialIcon
                      url={data.linkedin}
                      className="cursor-pointer"
                      target="_blank"
                      fgColor="#fff"
                      style={{ height: 35, width: 35 }}
                    />
                  )}
                  {data.facebook && (
                    <SocialIcon
                      url={data.facebook}
                      className="cursor-pointer"
                      target="_blank"
                      fgColor="#fff"
                      style={{ height: 35, width: 35 }}
                    />
                  )}
                  {data.twitter && (
                    <SocialIcon
                      url={data.twitter}
                      className="cursor-pointer"
                      target="_blank"
                      fgColor="#fff"
                      style={{ height: 35, width: 35 }}
                    />
                  )}
                  {data.instagram && (
                    <SocialIcon
                      url={data.instagram}
                      className="cursor-pointer"
                      target="_blank"
                      fgColor="#fff"
                      style={{ height: 35, width: 35 }}
                    />
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
