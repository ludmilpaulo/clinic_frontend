import { useState } from 'react';
import { signup } from '../services/authService';
import { isAxiosError } from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/redux/slices/authSlice';
import { Transition } from '@headlessui/react';

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [documents, setDocuments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);
    setAlertType(null);

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('user_type', userType);
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('phone_number', phoneNumber);
    formData.append('id_number_or_passport', idNumber);
    formData.append('gender', gender);
    formData.append('date_of_birth', dateOfBirth);
    formData.append('address', address);
    if (userType === 'doctor') {
      formData.append('specialty', specialty);
      formData.append('years_of_experience', yearsOfExperience.toString());
      documents.forEach((document, index) => {
        formData.append(`documents[${index}]`, document);
      });
    }

    try {
      const data = await signup(formData);
     
      if (data.status === 201) {
        console.log('sign up data', data);
        dispatch(loginUser({ user_id: data.user_id, username: data.username, token: data.token }));
        alert('Signup successful, please verify your email.');
        // router.push('/'); // Redirect to login page
      } else {
        console.log('sign up data 2', data);
        alert('Something went wrong. Please try again later.');
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response && error.response.data && typeof error.response.data === 'object') {
          const errorMessage = (error.response.data as { error: string }).error;
          alert(`Error: ${errorMessage}`);
        } else {
          alert('An unknown error occurred during the signup process.');
        }
      } else {
        alert('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full">
          <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Transition>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Sign Up As</label>
            <div className="flex items-center">
              <input
                type="radio"
                id="patient"
                name="userType"
                value="patient"
                checked={userType === 'patient'}
                onChange={(e) => setUserType(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="patient" className="mr-4">Patient</label>
              <input
                type="radio"
                id="doctor"
                name="userType"
                value="doctor"
                checked={userType === 'doctor'}
                onChange={(e) => setUserType(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="doctor">Doctor</label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
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
            <label className="block text-sm font-bold mb-2">ID Number or Passport</label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          {userType === 'doctor' && (
            <>
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
                <label className="block text-sm font-bold mb-2">Upload Documents</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </>
          )}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
