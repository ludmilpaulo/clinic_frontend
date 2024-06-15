"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ProductsSection: React.FC = () => {
  const [drugs, setDrugs] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    quantity_available: "",
  });
  const [selectedDrug, setSelectedDrug] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    fetchDrugs();
  }, []);

  const fetchDrugs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/drugs/");
      setDrugs(response.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedDrug) {
        await axios.put(`/api/drugs/${selectedDrug.id}/`, form);
      } else {
        await axios.post("/api/drugs/", form);
      }
      fetchDrugs();
      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        quantity_available: "",
      });
      setSelectedDrug(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (drug: any) => {
    setSelectedDrug(drug);
    setForm({
      name: drug.name,
      category: drug.category,
      description: drug.description,
      price: drug.price,
      quantity_available: drug.quantity_available,
    });
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await axios.delete(`/api/drugs/${id}/`);
      fetchDrugs();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 mb-6"
      >
        <h3 className="text-lg font-semibold mb-4">
          {selectedDrug ? "Edit Drug" : "Add Drug"}
        </h3>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text
            "
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            rows={4}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="text"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Quantity Available</label>
          <input
            type="text"
            name="quantity_available"
            value={form.quantity_available}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
      php Copy code
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Drugs List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drugs.map((drug) => (
                <tr key={drug.id}>
                  <td className="border px-4 py-2">{drug.name}</td>
                  <td className="border px-4 py-2">{drug.category}</td>
                  <td className="border px-4 py-2">{drug.price}</td>
                  <td className="border px-4 py-2">
                    {drug.quantity_available}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(drug)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(drug.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductsSection;
