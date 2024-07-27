import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [examNames, setExamNames] = useState<ExamTitle[]>([]);
  const [activeExamName, setActiveExamName] = useState('All');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUpdateExamModalOpen, setIsUpdateExamModalOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQuickActionsModalOpen, setIsQuickActionsModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [subscribedExams, setSubscribedExams] = useState([]);


  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  const isAuthenticated = useMemo(() => isLoaded && !!userId, [isLoaded, userId]);

  const filteredResources = useMemo(() => {
    return activeExamName === 'All' 
      ? resources 
      : resources.filter(resource => resource.examName === activeExamName);
  }, [activeExamName, resources]);

  const fetchData = useCallback(async () => {
    try {
      const [resourcesRes, examNamesRes, subscribedExamsRes] = await Promise.all([
        fetch('/api/get-resources'),
        fetch('/api/get-exam-names'),
        fetch('/api/get-subscribed-exams-details')
      ]);

      if (resourcesRes.ok && examNamesRes.ok && subscribedExamsRes.ok) {
        const [resourcesData, examNamesData, subscribedExamsData] = await Promise.all([
          resourcesRes.json(),
          examNamesRes.json(),
          subscribedExamsRes.json()
        ]);

        setResources(resourcesData.resources);
        setExamNames(examNamesData.examNames);
        setSubscribedExams(subscribedExamsData.subscribedExams);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isSmallScreen);
      setIsSidebarOpen(!isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [fetchData]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  const handleExamNameChange = useCallback((category: string) => {
    setActiveExamName(category);
  }, []);

  const handleQuickAction = useCallback((action: 'upload' | 'updateExam') => {
    if (userId) {
      if (action === 'upload') {
        setIsUploadModalOpen(true);
      } else {
        setIsUpdateExamModalOpen(true);
      }
    } else {
      setIsLoginPopupOpen(true);
    }
  }, [userId]);

  const handleSearchClick = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  const handleQuickActionsClick = useCallback(() => {
    setIsQuickActionsModalOpen(true);
  }, []);

  const handleTimelineClick = useCallback(() => {
    setIsTimelineModalOpen(true);
  }, []);

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
                />
              )}
              <ExamNamePills 
                examNames={examNames}
                activeExamName={activeExamName} 
                onExamNameChange={handleExamNameChange} 
              />
              <ResourceGrid resources={filteredResources} />
            </div>
            {!isMobile && (
              <div className="space-y-6">
                <ExamTimeline refreshTrigger={refreshTrigger} />
                <ExamCountdown 
                  subscribedExams={subscribedExams} 
                  isAuthenticated={isAuthenticated} 
                  userId={userId as string}
                />
              </div>
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
            fetchData();
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
        <div className="fixed inset-x-0 top-0 bottom-16 bg-white dark:bg-[#07080B] z-50 p-4">
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