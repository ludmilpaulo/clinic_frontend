import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDoctorProfile, updateDoctorProfile, createDoctorProfile } from '@/services/doctorProfileService';
import { RootState } from '@/redux/store';
import { selectUser } from '@/redux/slices/authSlice';

const ProfileForm = ({ doctorId }: { doctorId: number | null }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [consultationCategory, setConsultationCategory] = useState('');

  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  useEffect(() => {
    if (doctorId && token) {
      getDoctorProfile(doctorId, token).then(profile => {
        setName(profile.name);
        setSurname(profile.surname);
        setPhoneNumber(profile.phone_number);
        setSpecialty(profile.specialty);
        setYearsOfExperience(profile.years_of_experience);
        setConsultationCategory(profile.consultation_category);
      }).catch(error => {
        console.error('Error fetching profile:', error);
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
      consultation_category: consultationCategory 
    };
    try {
      if (doctorId && token) {
        await updateDoctorProfile(doctorId, profileData, token);
      } else if (token) {
        await createDoctorProfile(profileData, token);
      }
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile.');
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
        <label className="block text-sm font-bold mb-2">Years of Experience</label>
        <input
          type="number"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Consultation Category</label>
        <input
          type="text"
          value={consultationCategory}
          onChange={(e) => setConsultationCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
    </form>
  );
};

export default ProfileForm;
