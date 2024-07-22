import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUser } from "@clerk/nextjs";
import { Calendar, Book, Link as LinkIcon, ArrowLeft, Bell, BookOpen, Users, FileText, PenTool, Globe, Newspaper, Briefcase, Video, ExternalLink, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';
import LoginPopup from './LoginPopup';

interface ExamDetail {
  _id: string;
  examName: string;
  examDate: string | null;
  examDetails: string;
  source: string;
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
  const [activeTab, setActiveTab] = useState('overview');
  const [channelInfo, setChannelInfo] = useState<YouTubeChannelInfo[]>([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchExamDetail(examId);
    if (user) {
      checkSubscriptionStatus(examId);
    }

    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isSmallScreen);
      setIsSidebarOpen(!isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [examId, user]);

  useEffect(() => {
    if (exam?.youtubeChannels) {
      fetchChannelInfo(exam.youtubeChannels);
    }
  }, [exam]);

  const fetchExamDetail = async (examId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/exams/${examId}`);
      if (response.ok) {
        const data = await response.json();
        setExam(data);
      } else {
        throw new Error('Failed to fetch exam details');
      }
    } catch (error) {
      console.error('Error fetching exam details:', error);
      setError('Failed to load exam details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return 'Date not available';
    }
    if (dateString.startsWith('Between')) {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const checkSubscriptionStatus = async (examId: string) => {
    try {
      const response = await fetch(`/api/subscribe/${examId}`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.isSubscribed);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const handleSubscribe = async () => {
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
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        toast.success('Subscribed to exam updates successfully');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing to exam:', error);
      toast.error('Failed to subscribe to exam updates');
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
      <Header 
        toggleSidebar={toggleSidebar} 
        isMobile={isMobile}
      />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} />
        <main className={`flex-grow p-4 md:p-6 overflow-y-auto transition-all duration-300 ease-in-out
          ${isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}
          ${isMobile ? 'mb-16 pt-4' : 'mt-16'}`}>
          <button
            onClick={() => router.back()}
            className="mb-6 text-[#4A90E2] hover:text-[#3A7FCF] transition-colors flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Timeline
          </button>
          <div className="bg-[#121717] rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {exam.logoUrl ? (
                    <img src={exam.logoUrl} alt={`${exam.examName} logo`} className="h-16 w-16 object-contain rounded-full border-2 border-[#1AA38C] mr-4" />
                  ) : (
                    <div className="h-16 w-16 rounded-full border-2 border-[#1AA38C] mr-4 flex items-center justify-center bg-[#1E2A2F]">
                      <BookOpen size={32} className="text-[#1AA38C]" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-[#FFFFFF]">{exam.examName}</h1>
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
                  onClick={handleSubscribe}
                  className={`px-4 py-2 rounded-full flex items-center ${
                    isSubscribed ? 'bg-[#1AA38C]' : 'bg-[#121717] border-2 border-[#1AA38C]'
                  }`}
                >
                  <Bell size={16} className="mr-2" />
                  {isSubscribed ? 'Subscribed' : 'Subscribe for Updates'}
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex border-b border-gray-700 overflow-x-auto">
                {['overview', 'Notification', 'Resources', 'News', 'Toppers', 'Documents', 'YouTube'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 font-medium whitespace-nowrap ${
                      activeTab === tab ? 'border-b-2 border-[#4A90E2] text-[#4A90E2]' : 'text-gray-400'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-[#1E2A2F] p-4 rounded-lg">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Exam Overview</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-[#4A90E2]" size={20} />
                      <span>{formatDate(exam.examDate)}</span>
                    </div>
                    <div className="flex items-start">
                      <Book className="mr-2 text-[#4A90E2] mt-1" size={20} />
                      <p className="flex-1">{exam.examDetails}</p>
                    </div>
                    <div className="flex items-center">
                      <LinkIcon className="mr-2 text-[#4A90E2]" size={20} />
                      <a href={exam.source} target="_blank" rel="noopener noreferrer" className="text-[#4A90E2] hover:underline">
                        Official Source
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'Notification' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Exam Preparation</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 text-[#4A90E2]" size={20} />
                        <span>Study Progress</span>
                      </div>
                      <div className="w-1/2 bg-gray-700 rounded-full h-2.5">
                        <div className="bg-[#4A90E2] h-2.5 rounded-full" style={{ width: '33%' }}></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <PenTool className="mr-2 text-[#4A90E2]" size={20} />
                      <span>Next Mock Test: July 25, 2024</span>
                    </div>
                    <button className="w-full bg-[#4A90E2] text-white py-2 rounded hover:bg-[#3A7FCF] transition-colors">
                      Access Study Materials
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Resources' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Globe className="mr-2 text-[#4A90E2]" size={20} />
                      <span>Language Learning Modules</span>
                    </div>
                    <div className="flex items-center">
                      <Newspaper className="mr-2 text-[#4A90E2]" size={20} />
                      <span>Latest Exam News and Updates</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="mr-2 text-[#4A90E2]" size={20} />
                      <span>Career Guidance</span>
                    </div>
                    <button className="w-full bg-[#4A90E2] text-white py-2 rounded hover:bg-[#3A7FCF] transition-colors">
                      Explore All Resources
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'News' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Latest News</h2>
                  <div className="space-y-4">
                  <div className="flex items-center">
                      <Newspaper className="mr-2 text-[#4A90E2]" size={20} />
                      <span>Exam Date Announced</span>
                    </div>
                    <div className="flex items-center">
                      <Newspaper className="mr-2 text-[#4A90E2]" size={20} />
                      <span>New Syllabus Released</span>
                    </div>
                    <button className="w-full bg-[#4A90E2] text-white py-2 rounded hover:bg-[#3A7FCF] transition-colors">
                      Read More News
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Toppers' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Users className="mr-2 text-[#4A90E2]" size={20} />
                      <span>View success stories of previous exam toppers</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="mr-2 text-[#4A90E2]" size={20} />
                      <span>Topper Interviews: Learn from the best</span>
                    </div>
                    <button className="w-full bg-[#4A90E2] text-white py-2 rounded hover:bg-[#3A7FCF] transition-colors">
                      Explore Topper Insights
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'Documents' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Important Documents</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FileText className="mr-2 text-[#4A90E2]" size={20} />
                      <span>Exam Syllabus</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="mr-2 text-[#4A90E2]" size={20} />
                      <span>Previous Year Question Papers</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="mr-2 text-[#4A90E2]" size={20} />
                      <span>Study Material</span>
                    </div>
                    <button className="w-full bg-[#4A90E2] text-white py-2 rounded hover:bg-[#3A7FCF] transition-colors">
                      Download Documents
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'YouTube' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Recommended YouTube Channels</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {channelInfo.map((channel) => (
                      <div key={channel.id} className="bg-[#121717] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="relative">
                          <Image
                            src={channel.thumbnailUrl}
                            alt={`${channel.name} thumbnail`}
                            width={320}
                            height={180}
                            layout="responsive"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <a
                              href={`https://www.youtube.com/channel/${channel.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-600 text-white py-2 px-4 rounded-full flex items-center hover:bg-red-700 transition-colors duration-300"
                            >
                              <Youtube size={20} className="mr-2" />
                              Visit Channel
                            </a>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 truncate">{channel.name}</h3>
                          <p className="text-gray-400 flex items-center">
                            <Users size={16} className="mr-2" />
                            {channel.subscriberCount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {isLoginPopupOpen && (
        <LoginPopup onClose={() => setIsLoginPopupOpen(false)} />
      )}
    </div>
  );
};

export default ExamInformationPage;