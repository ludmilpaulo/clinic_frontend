"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/BannerPage"); // Adjust the path to the HeroSection page
  }, [router]);

  return <div>Redirecting...</div>;
};

export default Page;
