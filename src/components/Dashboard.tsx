import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from './Header';
import Sidebar from './Sidebar';
import ResourceGrid from './ResourceGrid';
import ExamTimeline from './ExamTimeline';
import QuickActions from './QuickActions';
import UploadResourceModal from './UploadResourceModal';
import UpdateExamInfoModal from './UpdateExamInfoModal';
import ExamNamePills from './ExamNamePills';
import LoginPopup from './LoginPopup';

interface Resource {
  _id: string;
  examTitle: string;
  examName: string;
  examCategory: string;
  s3Url: string;
  uploadDate: string;
  userName: string;
  fileName: string;
  summary?: string;
}

interface ExamTitle {
  name: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUpdateExamModalOpen, setIsUpdateExamModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [examNames, setExamNames] = useState<ExamTitle[]>([]);
  const [activeExamName, setActiveExamName] = useState('All');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const filterResources = useCallback(() => {
    if (activeExamName === 'All') {
      setFilteredResources(resources);
    } else {
      const filtered = resources.filter(resource => resource.examName === activeExamName);
      setFilteredResources(filtered);
    }
  }, [activeExamName, resources]);

  useEffect(() => {
    fetchResources();
    fetchExamNames();

    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isSmallScreen);
      setIsSidebarOpen(!isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    filterResources();
  }, [filterResources]);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/get-resources');
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources);
      } else {
        console.error('Failed to fetch resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const fetchExamNames = async () => {
    try {
      const response = await fetch('/api/get-exam-names');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Exam Names:', data);
        setExamNames(data.examNames);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  const handleExamNameChange = (category: string) => {
    setActiveExamName(category);
  };

  const handleQuickAction = (action: 'upload' | 'updateExam') => {
    if (userId) {
      if (action === 'upload') {
        setIsUploadModalOpen(true);
      } else {
        setIsUpdateExamModalOpen(true);
      }
    } else {
      setIsLoginPopupOpen(true);
    }
  };

  const handleExamClick = (examId: string) => {
    router.push(`/exam/${examId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#040E12] text-white">
      <Header 
        toggleSidebar={toggleSidebar} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} />
        <main className={`flex-grow p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out
          ${isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}
          ${isMobile ? 'mb-16 pt-20' : 'mt-16'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <QuickActions 
                onUpload={() => handleQuickAction('upload')}
                onUpdateExam={() => handleQuickAction('updateExam')}
                isLoggedIn={!!userId}
              />
              <ExamNamePills 
                examNames={examNames}
                activeExamName={activeExamName} 
                onExamNameChange={handleExamNameChange} 
              />
              <ResourceGrid resources={filteredResources} />
            </div>
            <div className="space-y-6">
              <ExamTimeline 
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        </main>
      </div>
      {isUploadModalOpen && (
        <UploadResourceModal 
          onClose={() => setIsUploadModalOpen(false)} 
          onUploadSuccess={() => {
            fetchResources();
            fetchExamNames();
            setRefreshTrigger(prev => prev + 1);
          }} 
        />
      )}
      {isUpdateExamModalOpen && (
        <UpdateExamInfoModal 
          onClose={() => setIsUpdateExamModalOpen(false)} 
          onUpdateSuccess={() => {
            setRefreshTrigger(prev => prev + 1);
          }} 
        />
      )}
      {isLoginPopupOpen && (
        <LoginPopup onClose={() => setIsLoginPopupOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;