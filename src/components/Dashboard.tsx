import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Header from './Header';
import Sidebar from './Sidebar';
import ResourceGrid from './ResourceGrid';
import ExamTimeline from './ExamTimeline';
import ExamCountdown from './ExamCountdown';
import QuickActions from './QuickActions';
import UploadResourceModal from './UploadResourceModal';
import UpdateExamInfoModal from './UpdateExamInfoModal';
import ExamNamePills from './ExamNamePills';
import LoginPopup from './LoginPopup';
import MobileNavbar from './MobileNavbar';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [examNames, setExamNames] = useState<ExamTitle[]>([]);
  const [activeExamName, setActiveExamName] = useState('All');
  const [isMobile, setIsMobile] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQuickActionsModalOpen, setIsQuickActionsModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [subscribedExams, setSubscribedExams] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      setIsAuthenticated(!!userId);
    }
  }, [isLoaded, userId]);

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
    fetchSubscribedExams();

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
        setExamNames(data.examNames);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubscribedExams = async () => {
    try {
      const response = await fetch('/api/get-subscribed-exams-details');
      if (response.ok) {
        const data = await response.json();
        setSubscribedExams(data.subscribedExams);
      } else {
        console.error('Failed to fetch subscribed exams');
      }
    } catch (error) {
      console.error('Error fetching subscribed exams:', error);
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

  const handleSearchClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleQuickActionsClick = () => {
    setIsQuickActionsModalOpen(true);
  };

  const handleTimelineClick = () => {
    setIsTimelineModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#040E12] text-white">
      <Header 
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-grow flex overflow-hidden">
        {!isMobile && <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} />}
        <main className={`flex-grow p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out
          ${isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}
          ${isMobile ? 'mb-16 pt-20' : 'mt-16'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {isMobile && (
                <ExamCountdown 
                  subscribedExams={subscribedExams} 
                  isAuthenticated={isAuthenticated} 
                  userId={userId as string}
                />              )}
              <ExamNamePills 
                examNames={examNames}
                activeExamName={activeExamName} 
                onExamNameChange={handleExamNameChange} 
              />
              <ResourceGrid resources={filteredResources} />
            </div>
            {!isMobile && (
              <div className="space-y-6">
                <ExamTimeline 
                  refreshTrigger={refreshTrigger}
                />
<ExamCountdown 
                  subscribedExams={subscribedExams} 
                  isAuthenticated={isAuthenticated} 
                  userId={userId as string}
                />              </div>
            )}
          </div>
        </main>
      </div>
      {isMobile && (
        <MobileNavbar 
          onQuickActionsClick={handleQuickActionsClick}
          onTimelineClick={handleTimelineClick}
        />
      )}
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
      {isMobile && isQuickActionsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#07080B] p-4 rounded-lg w-full max-w-md">
            <QuickActions 
              onUpload={() => handleQuickAction('upload')}
              // onUpdateExam={() => handleQuickAction('updateExam')}
              isLoggedIn={!!userId}
            />
            <button 
              onClick={() => setIsQuickActionsModalOpen(false)}
              className="mt-4 w-full bg-[#1AA38C] text-white py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {isMobile && isTimelineModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#07080B] p-4 rounded-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
            <ExamTimeline refreshTrigger={refreshTrigger} />
            <button 
              onClick={() => setIsTimelineModalOpen(false)}
              className="mt-4 w-full bg-[#1AA38C] text-white py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;