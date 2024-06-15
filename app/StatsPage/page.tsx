"use client";

import { useState, useEffect } from "react";

interface Stats {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

const StatsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch doctors on component load
  useEffect(() => {
    async function fetchDoctors() {
      const response = await fetch("/api/doctors"); // Replace with your actual endpoint
      const data = await response.json();
      setDoctors(data);
    }
    fetchDoctors();
  }, []);

  // Fetch stats based on selected doctor
  useEffect(() => {
    if (!selectedDoctor) return;
    async function fetchStats() {
      const response = await fetch(`/api/stats?doctor=${selectedDoctor}`);
      const data = await response.json();
      setStats(data);
    }
    fetchStats();
  }, [selectedDoctor]);

  return <div className="p-4"></div>;
};

export default StatsPage;
