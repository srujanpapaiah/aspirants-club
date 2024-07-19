'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ExamDate {
  _id: string;
  examName: string;
  examDate: string;
}

interface ExamTimelineProps {
  refreshTrigger: number;
}

const ExamTimeline: React.FC<ExamTimelineProps> = ({ refreshTrigger }) => {
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchExamDates();
  }, [refreshTrigger]);

  const fetchExamDates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/get-exam-dates');
      if (response.ok) {
        const data = await response.json();
        setExamDates(data.exams);
      } else {
        throw new Error('Failed to fetch exam dates');
      }
    } catch (error) {
      console.error('Error fetching exam dates:', error);
      setError('Failed to load exam dates. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString.startsWith('Between')) {
      const [_, startMonth, __, endMonth, year] = dateString.split(' ');
      return `${startMonth} - ${endMonth} ${year}`;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleExamClick = (examId: string) => {
    router.push(`/exam/${examId}`);
  };

  const sortedExamDates = useMemo(() => {
    return [...examDates].sort((a, b) => {
      const dateA = a.examDate.startsWith('Between') ? new Date(a.examDate.split(' ').pop()!) : new Date(a.examDate);
      const dateB = b.examDate.startsWith('Between') ? new Date(b.examDate.split(' ').pop()!) : new Date(b.examDate);
      return dateA.getTime() - dateB.getTime();
    });
  }, [examDates]);

  if (isLoading) {
    return <div className="text-[#E0E0E0]">Loading exam timeline...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#121717]/80 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-[#E0E0E0]">
        <Calendar className="mr-2" size={24} />
        Upcoming Exams
      </h2>
      {sortedExamDates.length === 0 ? (
        <p className="text-[#A0A0A0]">No upcoming exams found.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-[5px] top-0 bottom-0 w-px bg-[#4A90E2]/30"></div>
          <div className="max-h-[330px] overflow-y-auto pr-4">
            {sortedExamDates.map((exam, index) => (
              <div key={exam._id} className={`mb-4 pl-6 relative ${index >= 3 ? 'mt-2' : ''}`}>
                <div className="w-3 h-3 bg-[#1099AE] rounded-full absolute left-[-0px] top-[6px]"></div>
                <div className="text-[#1099AE] text-sm font-semibold mb-1">
                  {formatDate(exam.examDate)}
                </div>
                <div 
                  className="bg-[#2C2C2C]/90 rounded-lg p-3 hover:bg-[#3A3A3A]/90 transition-all duration-300 cursor-pointer"
                  onClick={() => handleExamClick(exam._id)}
                >
                  <h3 className="font-semibold text-[#E0E0E0]">{exam.examName}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTimeline;