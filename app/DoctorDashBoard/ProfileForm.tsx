import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getDoctorProfile,
  updateDoctorProfile,
  createDoctorProfile,
} from "@/services/doctorProfileService";
import { RootState } from "@/redux/store";
import { selectUser } from "@/redux/slices/authSlice";
import { getConsultationCategories } from "@/services/consultationCategoryService";

const ProfileForm = ({ doctorId }: { doctorId: number | null }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [consultationCategory, setConsultationCategory] = useState<
    number | null
  >(null);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  useEffect(() => {
    if (token) {
      getConsultationCategories(token)
        .then((response) => {
          setCategories(response);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    }
  }, [token]);

  useEffect(() => {
    if (doctorId && token) {
      getDoctorProfile(doctorId, token)
        .then((profile) => {
          setName(profile.name);
          setSurname(profile.surname);
          setPhoneNumber(profile.phone_number);
          setSpecialty(profile.specialty);
          setYearsOfExperience(profile.years_of_experience);
          setConsultationCategory(profile.consultation_category); // Ensure this is set correctly
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, [doctorId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = {
      name,
      surname,
      phone_number: phoneNumber,
      specialty,
      years_of_experience: yearsOfExperience,
      consultation_category: consultationCategory,
    };
    console.log("Submitting profile data:", profileData);
    try {
      if (doctorId && token) {
        await updateDoctorProfile(doctorId, profileData, token);
      } else if (token) {
        await createDoctorProfile(profileData, token);
      }
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error saving profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Surname</label>
        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Specialty</label>
        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">
          Years of Experience
        </label>
        <input
          type="number"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">
          Consultation Category
        </label>
        <select
          value={consultationCategory || ""}
          onChange={(e) => setConsultationCategory(Number(e.target.value))}
          className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="" disabled>
            Select category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Save
      </button>
    </form>
  );
};

export default ProfileForm;
