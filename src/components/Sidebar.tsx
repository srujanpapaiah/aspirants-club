import React from 'react';
import { Home, Calendar, Compass, MessageCircle, BookPlusIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const sidebarItems = [
  { name: "Home", icon: Home},
  { name: "Notifications", icon: Calendar},
  { name: "Discover", icon: Compass },
  { name: "Books Shelf", icon: BookPlusIcon },
  { name: "chat", icon: MessageCircle },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return ( 
  <div 
    className={`bg-[#0F0F0F] text-[#E0E0E0] h-screen overflow-y-auto transition-all duration-300 ease-in-out fixed top-0 left-0 z-40 ${
      isOpen ? 'w-64' : 'w-16'
    } lg:w-64 pt-14`}
  >
    <div className="py-4 h-full flex flex-col">
      {sidebarItems.map((item, index) => (
        <div 
          key={index} 
          className="flex items-center px-4 py-3 hover:bg-[#2C2C2C] cursor-pointer transition-colors"
        >
          <item.icon size={24} className={`min-w-[24px]`} />
          <span className={`ml-4 ${isOpen ? 'block' : 'hidden'} lg:block`}>{item.name}</span>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Sidebar;