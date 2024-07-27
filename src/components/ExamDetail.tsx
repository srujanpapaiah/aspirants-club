import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from "@clerk/nextjs";
import { Calendar, Book, Link as LinkIcon, ArrowLeft, Bell, BookOpen, Users, FileText, PenTool, Globe, Newspaper, Briefcase, Video, ExternalLink, Youtube, CheckCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';

import Header from './Header';
import Sidebar from './Sidebar';
import LoginPopup from './LoginPopup';
import ExamCountdown from './ExamCountdown';
import MobileNavbar from './MobileNavbar';

interface ExamDetail {
  _id: string;
  examName: string;
  examDate: string;
  examDetails?: string;
  source?: string;
  logoUrl?: string;
  youtubeChannels?: string[];
}

interface YouTubeChannelInfo {
  id: string;
  name: string;
  thumbnailUrl: string;
  subscriberCount: string;
}

const ExamInformationPage: React.FC<{ examId: string }> = ({ examId }) => {
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [channelInfo, setChannelInfo] = useState<YouTubeChannelInfo[]>([]);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [subscribedExams, setSubscribedExams] = useState([]);

  const { user } = useUser();
  const router = useRouter();

  const fetchExamDetail = useCallback(async (examId: string) => {
    setIsLoading(true);
    setError(null);
    try {

      const response = await fetch(`/api/exams/${examId}`);

      if (response.ok) {
        const data = await response.json();
        setExam(data);

        const [subscribedExamsRes] = await Promise.all([
          fetch('/api/get-subscribed-exams-details')
        ]);

        if (subscribedExamsRes.ok) {
          const [subscribedExamsData] = await Promise.all([
            subscribedExamsRes.json()
          ]);
  
          setSubscribedExams(subscribedExamsData.subscribedExams);
        } else {
          console.error('Failed to fetch data');
        }
      } else {
        throw new Error('Failed to fetch exam details');
      }
    } catch (error) {
      console.error('Error fetching exam details:', error);
      setError('Failed to load exam details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/subscribe/${examId}`);
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.isSubscribed);
      } else {
        throw new Error('Failed to fetch subscription status');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    }
  }, [examId, user]);

  useEffect(() => {
    fetchExamDetail(examId);
    if (user) {
      fetchSubscriptionStatus();
    }

    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isSmallScreen);
      setIsSidebarOpen(!isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [examId, user, fetchExamDetail, fetchSubscriptionStatus]);

  useEffect(() => {
    if (exam?.youtubeChannels) {
      fetchChannelInfo(exam.youtubeChannels);
    }
  }, [exam]);

  const toggleSubscription = async () => {
    if (!user) {
      setIsLoginPopupOpen(true);
      return;
    }

    try {
      const response = await fetch(`/api/subscribe/${examId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id, 
          token: 'dummy-token',
          phoneNumber: user.primaryPhoneNumber?.phoneNumber || ''
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.isSubscribed);
        toast.success(data.message);
        await fetchSubscriptionStatus();
      } else {
        throw new Error('Failed to toggle subscription');
      }
    } catch (error) {
      console.error('Error toggling exam subscription:', error);
      toast.error('Failed to update exam subscription');
    }
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prevState => !prevState);
  }, []);

  const getChannelId = (url: string) => {
    const match = url.match(/youtube\.com\/@?([\w-]+)/);
    return match ? match[1] : null;
  };

  const fetchChannelInfo = async (channelUrls: string[]) => {
    const channelInfoPromises = channelUrls.map(async (url) => {
      const channelId = getChannelId(url);
      if (!channelId) return null;

      // In a real application, you would call your backend API here
      // which would then use the YouTube Data API to fetch channel info
      // For this example, we'll simulate the API call
      const mockApiCall = async () => {
        return {
          id: channelId,
          name: `Channel ${channelId}`,
          thumbnailUrl: `/placeholder-thumbnail.jpg`,
          subscriberCount: `${Math.floor(Math.random() * 1000000)} subscribers`
        };
      };

      return await mockApiCall();
    });

    const channelInfoResults = await Promise.all(channelInfoPromises);
    setChannelInfo(channelInfoResults.filter((info): info is YouTubeChannelInfo => info !== null));
  };

  const handleTimelineClick = () => {
    setIsTimelineModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#121717]">
        <div className="text-[#E0E0E0]">Loading exam details...</div>
        <svg className="animate-spin h-5 w-5 ml-3 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  if (!exam) {
    return <div className="text-[#E0E0E0] text-center mt-8">Exam not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#040E12] text-white">
      <Header toggleSidebar={toggleSidebar} isMobile={isMobile} />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} />
        <main className={`flex-grow p-6 overflow-y-auto transition-all duration-300 ease-in-out
          ${isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}
          ${isMobile ? 'mb-16' : 'mt-4'}`}>
          <button
            onClick={() => router.back()}
            className="mb-6 text-[#4A90E2] hover:text-[#3A7FCF] transition-colors flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Timeline
          </button>
          <div className="bg-[#121717] rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  {exam.logoUrl ? (
                    <Image src={exam.logoUrl} alt={`${exam.examName} logo`} width={80} height={80} className="rounded-full border-2 border-[#1AA38C] mr-4" />
                  ) : (
                    <div className="h-20 w-20 rounded-full border-2 border-[#1AA38C] mr-4 flex items-center justify-center bg-[#1E2A2F]">
                      <BookOpen size={40} className="text-[#1AA38C]" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-white">{exam.examName}</h1>
                    <a 
                      href={exam.source} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-[#4A90E2] hover:text-[#3A7FCF] transition-colors mt-1 flex items-center"
                    >
                      Official Website
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
                <button
                  onClick={toggleSubscription}
                  className={`px-6 py-2 rounded-full flex items-center transition-colors duration-200 ${
                    isSubscribed 
                      ? 'bg-[#1AA38C] hover:bg-[#158F7A]' 
                      : 'bg-[#1E2A2F] border-2 border-[#1AA38C] hover:bg-[#1AA38C]'
                  } text-white font-medium`}
                >
                  <Bell size={18} className="mr-2" />
                  {isSubscribed ? 'Unsubscribe' : 'Subscribe for Updates'}
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-[#1E2A2F] border-t border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4">Exam Overview</h2>
              <ExamCountdown 
                subscribedExams={[exam]} 
                isAuthenticated={!!user} 
                userId={user?.id || null}
              />
            </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Preparation Card */}
            <div className="bg-[#121717] rounded-lg shadow-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                <span className="text-white text-2xl font-bold bg-[#1AA38C] px-4 py-2 rounded-full">Coming Soon</span>
              </div>
              <div className="p-6 filter blur-sm">
                <h2 className="text-2xl font-semibold text-white mb-4">Exam Preparation</h2>
                <div className="space-y-4">
                  <div className="bg-[#1E2A2F] p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <BookOpen className="mr-3 text-[#1AA38C]" size={24} />
                        <h3 className="text-lg font-medium">Study Progress</h3>
                      </div>
                      <span className="text-[#1AA38C] font-medium">33%</span>
                    </div>
                    <div className="w-full bg-[#121717] rounded-full h-2.5">
                      <div className="bg-[#1AA38C] h-2.5 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                  <div className="bg-[#1E2A2F] p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <PenTool className="mr-3 text-[#1AA38C]" size={24} />
                      <h3 className="text-lg font-medium">Next Mock Test</h3>
                    </div>
                    <p className="text-gray-300">July 25, 2024</p>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Resources Card */}
            <div className="bg-[#121717] rounded-lg shadow-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                <span className="text-white text-2xl font-bold bg-[#1AA38C] px-4 py-2 rounded-full">Coming Soon</span>
              </div>
              <div className="p-6 filter blur-sm">
                <h2 className="text-2xl font-semibold text-white mb-4">Resources</h2>
                <div className="space-y-4">
                  {[
                    { icon: Globe, text: 'Language Learning Modules' },
                    { icon: Newspaper, text: 'Latest Exam News and Updates' },
                    { icon: Briefcase, text: 'Career Guidance' },
                    { icon: BookOpen, text: 'Study Materials' },
                  ].map((item, index) => (
                    <div key={index} className="bg-[#1E2A2F] p-3 rounded-lg flex items-center">
                      <item.icon className="mr-3 text-[#1AA38C]" size={20} />
                      <span className="text-gray-200">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Toppers Card */}
            <div className="bg-[#121717] rounded-lg shadow-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                <span className="text-white text-2xl font-bold bg-[#1AA38C] px-4 py-2 rounded-full">Coming Soon</span>
              </div>
              <div className="p-6 filter blur-sm">
                <h2 className="text-2xl font-semibold text-white mb-4">Learn from Top Performers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((_, index) => (
                    <div key={index} className="bg-[#1E2A2F] p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-gray-600 rounded-full mr-3"></div>
                        <div>
                          <h3 className="font-semibold">Top Performer</h3>
                          <span className="text-[#1AA38C]">Rank {index + 1}</span>
                        </div>
                      </div>
                      <p className="text-gray-400">Expert in subject area</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Documents Card */}
            <div className="bg-[#121717] rounded-lg shadow-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                <span className="text-white text-2xl font-bold bg-[#1AA38C] px-4 py-2 rounded-full">Coming Soon</span>
              </div>
              <div className="p-6 filter blur-sm">
                <h2 className="text-2xl font-semibold text-white mb-4">Important Documents</h2>
                <div className="space-y-4">
                  {[
                    'Exam Syllabus',
                    'Previous Year Question Papers',
                    'Study Material',
                    'Exam Guidelines',
                  ].map((doc, index) => (
                    <div key={index} className="bg-[#1E2A2F] p-3 rounded-lg flex items-center">
                      <FileText className="mr-3 text-[#1AA38C]" size={20} />
                      <span className="text-gray-200">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* YouTube Channels Card */}
            <div className="bg-[#121717] rounded-lg shadow-lg overflow-hidden relative md:col-span-2">
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                <span className="text-white text-2xl font-bold bg-[#1AA38C] px-4 py-2 rounded-full">Coming Soon</span>
              </div>
              <div className="p-6 filter blur-sm">
                <h2 className="text-2xl font-semibold text-white mb-4">Recommended YouTube Channels</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {channelInfo.map((channel) => (
                    <div key={channel.id} className="bg-[#1E2A2F] p-4 rounded-lg">
                      <div className="w-full h-32 bg-gray-600 rounded-lg mb-3">
                        <Image
                          src={channel.thumbnailUrl}
                          alt={`${channel.name} thumbnail`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{channel.name}</h3>
                      <p className="text-gray-400 flex items-center">
                        <Users size={16} className="mr-2 text-[#1AA38C]" />
                        {channel.subscriberCount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {isMobile && (
        <MobileNavbar 
          onQuickActionsClick={() => {/* Handle quick actions */}}
          onTimelineClick={handleTimelineClick}
        />
      )}
      {isLoginPopupOpen && (
        <LoginPopup onClose={() => setIsLoginPopupOpen(false)} />
      )}
      {isTimelineModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#121717] p-4 rounded-lg w-full max-w-md overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Exam Timeline</h2>
            {/* Add your timeline content here */}
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

export default ExamInformationPage;