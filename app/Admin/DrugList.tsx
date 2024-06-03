import React, { useEffect, useState } from 'react';
import DrugForm from './DrugForm';
import { deleteDrug, fetchDrugs } from '@/services/adminService';
import Image from 'next/image';

// Define the Drug type
interface Drug {
  id: number;
  name: string;
  category_name: string;
  price: number;
  quantity_available: number;
  image_urls: string[];
}

const DrugList: React.FC = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentDrug, setCurrentDrug] = useState<Drug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const drugsData = await fetchDrugs();
      setDrugs(drugsData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    await deleteDrug(id);
    setDrugs(drugs.filter((drug) => drug.id !== id));
  };

  const handleAddDrug = () => {
    setCurrentDrug(null);
    setShowPopup(true);
  };

  const handleEditDrug = (drug: Drug) => {
    setCurrentDrug(drug);
    setShowPopup(true);
  };

  const closeModal = () => {
    setShowPopup(false);
    loadData();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
        onClick={handleAddDrug}
      >
        Add New Product
      </button>
      <table className="w-full table-auto bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Quantity Available</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((drug) => (
            <tr key={drug.id} className="border-b">
              <td className="px-4 py-2">
                {drug.image_urls && drug.image_urls.length > 0 && (
                  <Image
                    src={drug.image_urls[0]}
                    alt={drug.name}
                    width={64}
                    height={64}
                    className="object-cover rounded"
                  />
                )}
              </td>
              <td className="px-4 py-2">{drug.name}</td>
              <td className="px-4 py-2">{drug.category_name}</td>
              <td className="px-4 py-2">{drug.price}</td>
              <td className="px-4 py-2">{drug.quantity_available}</td>
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
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-auto">
          <div className="bg-white p-8 rounded shadow-md w-1/2 overflow-auto max-h-full">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded mb-4"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
            <DrugForm drug={currentDrug} onClose={closeModal} loadDrugs={loadData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugList;
