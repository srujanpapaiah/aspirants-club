'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Book, Link, ArrowLeft, Bell } from 'lucide-react';
import { useUser } from "@clerk/nextjs";
import { requestForToken, onMessageListener } from '@/lib/firebase';
import toast from 'react-hot-toast';



interface ExamDetail {
  _id: string;
  examName: string;
  examDate: string | null;
  examDetails: string;
  source: string;
  logoUrl?: string;
}

const ExamDetailPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchExamDetail(params.id);
      checkSubscriptionStatus(params.id);
    }
  }, [params.id, user]);

  useEffect(() => {
    onMessageListener().then((payload) => {
      toast(payload.notification.title);
    });
  }, []);

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
    try {
      const token = await requestForToken();
      if (!token) {
        toast.error('Failed to get notification permission');
        return;
      }

      const response = await fetch(`/api/subscribe/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, userId: user?.id }),
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
    <div className="bg-[#0F0F0F] min-h-screen text-[#E0E0E0] p-6">
      <button
        onClick={() => router.back()}
        className="mb-6 text-[#4A90E2] hover:text-[#3A7FCF] transition-colors flex items-center"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Timeline
      </button>
      <div className="bg-[#2C2C2C]/90 rounded-lg p-6 max-w-3xl mx-auto shadow-lg">
        {exam.logoUrl && (
          <div className="flex justify-center mb-4">
            <img src={exam.logoUrl} alt={`${exam.examName} logo`} className="h-20 w-20 object-contain" />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-4 text-[#4A90E2]">{exam.examName}</h1>
        <button
            onClick={handleSubscribe}
            className={`mb-4 px-4 py-2 rounded-full flex items-center ${
              isSubscribed ? 'bg-green-500' : 'bg-[#4A90E2]'
            }`}
          >
            <Bell size={20} className="mr-2" />
            {isSubscribed ? 'Subscribed' : 'Subscribe for Updates'}
          </button>
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
            <Link className="mr-2 text-[#4A90E2]" size={20} />
            <a href={exam.source} target="_blank" rel="noopener noreferrer" className="text-[#4A90E2] hover:underline">
              Official Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
