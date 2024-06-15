import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectUser } from "@/redux/slices/authSlice";
import axios from "axios";
import { baseAPI } from "@/utils/variables";
import dayjs from "dayjs";

// Define the Appointment type
interface Appointment {
  id: number;
  appointment_time: string;
  patient_name: string;
}

interface AppointmentsProps {
  userId: number | null;
}

const Appointments: React.FC<AppointmentsProps> = ({ userId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  useEffect(() => {
    if (token && userId) {
      axios
        .get(`${baseAPI}/appointment/doctor-appointments/${userId}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          console.log("appointment data", response.data);
          setAppointments(response.data);
        })
        .catch((error) => {
          console.error("Error fetching appointments:", error);
        });
    }
  }, [token, userId]);

  return (
    <div className="container mx-auto p-4">
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold mb-2">
                {dayjs(appointment.appointment_time).format("MMMM D, YYYY")}
              </h3>
              <p className="text-sm text-gray-600">
                Patient: {appointment.patient_name}
              </p>
              <p className="text-sm text-gray-600">
                Time: {dayjs(appointment.appointment_time).format("h:mm A")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
