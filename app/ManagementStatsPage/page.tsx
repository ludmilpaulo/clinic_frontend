"use client";
import { useState, useEffect } from "react";

interface Stats {
  count: number;
  revenue: number;
}

const ManagementStatsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    daily: Stats;
    weekly: Stats;
    monthly: Stats;
    yearly: Stats;
  } | null>(null);

  // Fetch doctors on component load
  useEffect(() => {
    async function fetchDoctors() {
      const response = await fetch("/api/doctors"); // Replace with actual endpoint
      const data = await response.json();
      setDoctors(data);
    }
    fetchDoctors();
  }, []);

  // Fetch stats based on the selected doctor
  useEffect(() => {
    if (!selectedDoctor) return;
    async function fetchStats() {
      const response = await fetch(
        `/api/management-stats?doctor=${selectedDoctor}`,
      );
      const data = await response.json();
      setStats(data);
    }
    fetchStats();
  }, [selectedDoctor]);

  return <div className="p-4"></div>;
};

export default ManagementStatsPage;
