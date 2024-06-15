import { useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaClipboardList,
  FaStethoscope,
  FaPrescriptionBottleAlt,
  FaBars,
} from "react-icons/fa";

type SidebarProps = {
  setSection: React.Dispatch<
    React.SetStateAction<
      | "profile"
      | "availability"
      | "appointments"
      | "consultations"
      | "prescriptions"
    >
  >;
};

const Sidebar: React.FC<SidebarProps> = ({ setSection }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className="lg:hidden text-white p-4 fixed top-0 left-0 z-20"
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>
      <div
        className={`fixed lg:static h-screen w-64 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
      >
        <div className="p-4 text-lg font-bold">Doctor Dashboard</div>
        <nav className="mt-10">
          <button
            onClick={() => setSection("profile")}
            className="flex items-center w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <FaUser className="mr-3" /> Profile
          </button>
          <button
            onClick={() => setSection("availability")}
            className="flex items-center w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <FaCalendarAlt className="mr-3" /> Availability
          </button>
          <button
            onClick={() => setSection("appointments")}
            className="flex items-center w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <FaClipboardList className="mr-3" /> Appointments
          </button>
          <button
            onClick={() => setSection("consultations")}
            className="flex items-center w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <FaStethoscope className="mr-3" /> Consultations
          </button>
          <button
            onClick={() => setSection("prescriptions")}
            className="flex items-center w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <FaPrescriptionBottleAlt className="mr-3" /> Prescriptions
          </button>
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-0"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
