import React, { useEffect, useState } from 'react';

import DrugForm from './DrugForm';
import { deleteDrug, fetchDrugs } from '@/services/adminService';

const DrugList: React.FC = () => {
  const [drugs, setDrugs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDrug, setCurrentDrug] = useState<any>(null);

  useEffect(() => {
    async function loadDrugs() {
      const data = await fetchDrugs();
      setDrugs(data);
    }

    loadDrugs();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDrug(id);
    setDrugs(drugs.filter((drug: any) => drug.id !== id));
  };

  const handleAddDrug = () => {
    setCurrentDrug(null);
    setShowPopup(true);
  };

  const handleEditDrug = (drug: any) => {
    setCurrentDrug(drug);
    setShowPopup(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Drugs</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={handleAddDrug}
      >
        Add New Drug
      </button>
      <table className="w-full table-auto bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((drug: any) => (
            <tr key={drug.id} className="border-b">
              <td className="px-4 py-2">{drug.name}</td>
              <td className="px-4 py-2">{drug.category_name}</td>
              <td className="px-4 py-2">{drug.price}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 mr-2 rounded"
                  onClick={() => handleEditDrug(drug)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(drug.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-md w-1/2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mb-4"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
            <DrugForm drug={currentDrug} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugList;
