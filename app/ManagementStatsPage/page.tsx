"use client";
import { useState, useEffect } from 'react';

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
            const response = await fetch('/api/doctors'); // Replace with actual endpoint
            const data = await response.json();
            setDoctors(data);
        }
        fetchDoctors();
    }, []);

    // Fetch stats based on the selected doctor
    useEffect(() => {
        if (!selectedDoctor) return;
        async function fetchStats() {
            const response = await fetch(`/api/management-stats?doctor=${selectedDoctor}`);
            const data = await response.json();
            setStats(data);
        }
        fetchStats();
    }, [selectedDoctor]);

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Management Stats</h1>
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
                    <p>Daily: {stats.daily.count} appointments, Revenue: ${stats.daily.revenue.toFixed(2)}</p>
                    <p>Weekly: {stats.weekly.count} appointments, Revenue: ${stats.weekly.revenue.toFixed(2)}</p>
                    <p>Monthly: {stats.monthly.count} appointments, Revenue: ${stats.monthly.revenue.toFixed(2)}</p>
                    <p>Yearly: {stats.yearly.count} appointments, Revenue: ${stats.yearly.revenue.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default ManagementStatsPage;
