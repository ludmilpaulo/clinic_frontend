"use client";

import { useState, useEffect } from 'react';

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
            const response = await fetch('/api/doctors'); // Replace with your actual endpoint
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

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Doctor Appointment Stats</h1>
            <select
                className="border p-2 mb-4"
                onChange={(e) => setSelectedDoctor(e.target.value)}
            >
                <option value="">Select a Doctor</option>
                {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
            </select>
            {stats && (
                <div>
                    <p>Daily: {stats.daily}</p>
                    <p>Weekly: {stats.weekly}</p>
                    <p>Monthly: {stats.monthly}</p>
                    <p>Yearly: {stats.yearly}</p>
                </div>
            )}
        </div>
    );
};

export default StatsPage;
