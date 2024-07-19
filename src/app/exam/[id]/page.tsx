'use client';

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExamDetailComponent from "../../../components/ExamDetail";
import Header from "../../../components/Header";
import MobileNavbar from "../../../components/MobileNavbar";

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  const handleQuickActionsClick = () => {
    // Implement quick actions logic for exam detail page if needed
  };

  const handleTimelineClick = () => {
    router.push('/'); // Assuming timeline is on the home page
  };

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-[#E0E0E0]">Loading exam details...</div>
      <svg className="animate-spin h-5 w-5 ml-3 text-white" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path>
      </svg>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#040E12] text-white">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
      />
      <div className={`flex-grow ${isMobile ? 'mb-16' : ''}`}>
        <ExamDetailComponent examId={params.id} />
      </div>
      {isMobile && (
        <MobileNavbar 
          onSearchClick={handleSearchClick}
          onQuickActionsClick={handleQuickActionsClick}
          onTimelineClick={handleTimelineClick}
        />
      )}
      {isMobile && isSearchModalOpen && (
        <div className="fixed inset-x-0 top-0 bg-white dark:bg-[#07080B] z-50 p-4">
          <input 
            type="text" 
            className="w-full rounded-md bg-[#F1F6FF] px-4 py-2 text-black focus:outline-none focus:ring-1 focus:ring-gray-700 dark:bg-[#0F1618] dark:text-white" 
            placeholder="Search.." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={() => setIsSearchModalOpen(false)}
            className="mt-4 w-full bg-[#1AA38C] text-white py-2 rounded-md"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}