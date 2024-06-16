// components/Sidebar.tsx
import React from "react";

const Sidebar = ({ setActiveComponent }: { setActiveComponent: (component: string) => void }) => (
    <div
    className="w-64 bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900
  shadow-md min-h-screen"
  >
    <div className="p-4 text-2xl font-bold">Profile Menu</div>
    <ul className="mt-4 text-white">
      <li className="hover:bg-gray-700">
        <button onClick={() => setActiveComponent("ProfileInformation")} className="block p-4 w-full text-left">
          Profile Information
        </button>
      </li>
      <li className="hover:bg-gray-700">
        <button onClick={() => setActiveComponent("OrderHistory")} className="block p-4 w-full text-left">
          Order History
        </button>
      </li>
    </ul>
  </div>
);

export default Sidebar;
