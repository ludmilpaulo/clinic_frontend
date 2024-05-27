import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/services/authService';
import Link from 'next/link';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from "@/redux/slices/authSlice";

const SignupForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signup(username, email, password);
      dispatch(loginUser(data));
      alert('Signup successful. Please log in.');
      router.push('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        const errorMessage = err.response.data.error;
        setError(errorMessage);
        alert(errorMessage);  // Display alert with error message
      } else {
        setError('Failed to sign up. Please try again.');
        alert('Failed to sign up. Please try again.');  // Display generic error message
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        </div>
      </Transition>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Sign Up</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition duration-200">
            Sign Up
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/Login">
            <span className="text-blue-500 hover:underline cursor-pointer">Already have an account? Log in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
