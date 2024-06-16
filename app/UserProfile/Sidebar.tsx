// components/Sidebar.tsx
import React from "react";

const Sidebar = ({ setActiveComponent }: { setActiveComponent: (component: string) => void }) => (
  <div className="bg-gray-800 text-white w-64 h-full fixed">
    <div className="p-4 text-2xl font-bold">Profile Menu</div>
    <ul className="mt-4">
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
