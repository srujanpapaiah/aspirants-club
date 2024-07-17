import React from 'react';
import { UserButton } from "@clerk/nextjs";
import { Menu, Search } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DiscordIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

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
    <div className="flex items-center space-x-8">
      <a
        href="https://discord.gg/DRtueZpH4F"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#4A90E2] hover:text-[#3A7FCF] transition-colors"
      >
        
        <DiscordIcon size={24} />
      </a>
      <UserButton />
    </div>
  </header>
  );
};

export default Header;