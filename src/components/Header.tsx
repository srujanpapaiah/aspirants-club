import React from 'react';
import { UserButton } from "@clerk/nextjs";
import { Menu, Search } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, searchQuery, setSearchQuery }) => {
  return(
  <header className="bg-[#0F0F0F] text-white py-2 px-4 flex justify-between items-center sticky top-0 z-50">
    <div className="flex items-center">
      <button onClick={toggleSidebar} className="mr-4 p-2 hover:bg-[#2C2C2C] rounded-full transition-colors">
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-bold text-[#4A90E2]">Aspirants Club</h1>
    </div>
    <div className="flex-grow max-w-2xl mx-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1E1E1E] text-[#E0E0E0] border border-[#303030] rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-[#4A90E2]" />
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <UserButton />
    </div>
  </header>
  );
};

export default Header;