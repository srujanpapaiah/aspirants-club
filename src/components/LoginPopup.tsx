import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, X } from 'lucide-react';

const LoginPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/sign-in'); // Make sure this matches your sign-in route
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121717] p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Login Required</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <p className="mb-6 text-gray-300">You need to be logged in to perform this action.</p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-full bg-[#121717] border-2 border-[#1AA38C] text-white text-sm font-medium hover:bg-[#1AA38C] transition-colors duration-300 flex items-center justify-center"
          >
            <Bell size={20} className="mr-2" />
            Sign In
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-[#2C2C2C] text-white text-sm font-medium hover:bg-[#3A3A3A] transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;