import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { UserButton, useAuth } from '@clerk/nextjs';

const Header = ({ toggleSidebar, searchQuery, setSearchQuery, isMobile, isSidebarOpen }: {
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobile: boolean;
  isSidebarOpen: boolean;
}) => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/icons/logo-dark.svg' : '/icons/logo-light.svg';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#07080B] py-2 px-4 flex items-center shadow-md">
          <h1 className="text-black dark:text-white font-semibold text-lg">Aspirants Club</h1>
        </div>
      )}
      <nav className={`fixed ${isMobile ? 'bottom-0' : 'top-0'} left-0 right-0 z-50 flex items-center justify-between bg-white py-4 px-4 text-white dark:border-t dark:border-t-[#131620] dark:bg-[#07080B] transition-all duration-300 ease-in-out`}
           style={{ boxShadow: isMobile ? '0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="text-gray-400 hover:text-white z-50">
            <FiMenu size={32} className="text-black dark:text-white" />
          </button>
          {!isMobile && (
            <div className="text-black dark:text-white font-semibold text-lg">
              Aspirants Club
            </div>
          )}
        </div>
        {isMobile ? (
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-400 hover:text-white">
              <FiSearch size={24} className="text-black dark:text-white" />
            </button>
            {isSignedIn ? (
              <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full", userButtonTrigger: "focus:shadow-none" } }} />
            ) : (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 rounded-full bg-[#121717] border-2 border-[#1AA38C] text-white text-sm font-medium hover:bg-[#1AA38C] transition-colors duration-300"
              >
                Sign In
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="mx-4 flex max-w-xl flex-1 items-center">
              <div className="relative w-full">
                <input 
                  type="text" 
                  className="w-full rounded-md bg-[#F1F6FF] px-4 py-1.5 pl-10 text-black focus:outline-none focus:ring-1 focus:ring-gray-700 dark:bg-[#0F1618] dark:text-white" 
                  placeholder="Search.." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={16} />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative flex items-center">
                {isSignedIn ? (
                  <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full", userButtonTrigger: "focus:shadow-none" } }} />
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="px-4 py-2 rounded-full bg-[#121717] border-2 border-[#1AA38C] text-white text-sm font-medium hover:bg-[#1AA38C] transition-colors duration-300"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </>
        )}
        {isMobile && isSearchOpen && (
          <div className="absolute bottom-full left-0 right-0 bg-white dark:bg-[#07080B] p-4">
            <div className="relative w-full">
              <input 
                type="text" 
                className="w-full rounded-md bg-[#F1F6FF] px-4 py-1.5 pl-10 text-black focus:outline-none focus:ring-1 focus:ring-gray-700 dark:bg-[#0F1618] dark:text-white" 
                placeholder="Search.." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" size={16} />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;