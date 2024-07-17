import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ResourceGrid from './ResourceGrid';
import ExamTimeline from './ExamTimeline';
import QuickActions from './QuickActions';
import UploadResourceModal from './UploadResourceModal';
import UpdateExamInfoModal from './UpdateExamInfoModal';
import ExamNamePills from './ExamNamePills';


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

interface ExamDate {
  _id: string;
  examName: string;
  date: string;
  importance: 'high' | 'medium' | 'low';
}

interface ExamTitle {
  name: string;
  count: number;
}

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUpdateExamModalOpen, setIsUpdateExamModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [examNames, setExamNames] = useState<ExamTitle[]>([]);
  const [activeExamName, setActiveExamName] = useState('All');

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
    fetchExamDates();
    fetchExamNames();
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

  const fetchExamDates = async () => {
    try {
      const response = await fetch('/api/get-exam-dates');
      if (response.ok) {
        const data = await response.json();
        setExamDates(data.examDates);
      } else {
        console.error('Failed to fetch exam dates');
      }
    } catch (error) {
      console.error('Error fetching exam dates:', error);
    }
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);


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

  const handleExamNameChange = (category: string) => {
    setActiveExamName(category);
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-white">
      <Header 
        toggleSidebar={toggleSidebar} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
      />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`flex-grow p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        } lg:ml-64`}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <QuickActions 
                onUpload={() => setIsUploadModalOpen(true)}
                onUpdateExam={() => setIsUpdateExamModalOpen(true)}
              />
              <ExamNamePills 
              examNames={examNames}
              activeExamName={activeExamName} 
              onExamNameChange={handleExamNameChange} 
            />
              <ResourceGrid resources={filteredResources} />
            </div>
            <div className="space-y-6">
              <ExamTimeline refreshTrigger={0} />
            </div>
          </div>
        </main>
      </div>
      {isUploadModalOpen && (
        <UploadResourceModal onClose={() => setIsUploadModalOpen(false)} onUploadSuccess={() => {
          fetchResources();
          fetchExamNames();
        }} />
      )}
      {isUpdateExamModalOpen && (
        <UpdateExamInfoModal onClose={() => setIsUpdateExamModalOpen(false)} onUpdateSuccess={fetchExamDates} />
      )}
    </div>
  );
};

export default Dashboard;