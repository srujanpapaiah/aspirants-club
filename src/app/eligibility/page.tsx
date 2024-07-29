'use client';

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import MobileNavbar from "../../components/MobileNavbar";
import SearchComponent from "../../components/Search";
import {PDFUploader} from '../../components/PDFUploader';
import {RecommendationDisplay} from '../../components/RecommendationDisplay';

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [recommendations, setRecommendations] = useState<string[]>([]);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
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

const handlePDFUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch('/api/extract-and-recommend', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    setRecommendations(data.recommendations);
  } else {
    console.error('Error processing PDF');
  }
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
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
      />
      <div className={`flex-grow ${isMobile ? 'mb-16' : ''}`}>
        {!isMobile && (
          <div className="mb-4 px-4 md:px-6">
            <SearchComponent isMobile={false} isOpen={true} onClose={() => {}} />
          </div>
        )}
       <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <PDFUploader onUpload={handlePDFUpload} />
      <RecommendationDisplay recommendations={recommendations} />
    </main>
      </div>
      {isMobile && (
        <>
          <MobileNavbar 
            onQuickActionsClick={handleQuickActionsClick}
            onTimelineClick={handleTimelineClick}
          />
          <SearchComponent 
            isMobile={true} 
            isOpen={isSearchOpen} 
            onClose={handleCloseSearch} 
          />
        </>
      )}
    </div>
  );
}