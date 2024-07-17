'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showAll, setShowAll] = useState(false);
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


  if (isLoading) {
    return <div className="text-[#E0E0E0]">Loading exam timeline...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const visibleExams = showAll ? examDates : examDates.slice(0, 3);

  return (
          <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center text-[#E0E0E0]">
        <Calendar className="mr-2" size={24} />
        Exam Timeline
      </h2>
      {examDates.length === 0 ? (
        <p className="text-[#A0A0A0]">No upcoming exams found.</p>
      ) : (
        <>
          <div className={`relative ${!showAll && examDates.length > 3 ? 'max-h-[400px] overflow-y-auto' : ''} pr-4`}>
            <div className="absolute left-[5px] top-0 bottom-0 w-px bg-[#4A90E2]/30"></div>
            {visibleExams.map((exam) => (
              <div key={exam._id} className="mb-4 pl-6 relative">
                <div className="w-3 h-3 bg-[#4A90E2] rounded-full absolute left-[-1.5px] top-[6px]"></div>
                <div className="text-[#4A90E2] text-sm font-semibold mb-1">
                  {formatDate(exam.examDate)}
                </div>
                <div className="bg-[#2C2C2C]/90 rounded-lg p-3 hover:bg-[#3A3A3A]/90 transition-all duration-300 cursor-pointer"
                onClick={() => handleExamClick(exam._id)}
                >
                  <h3 className="font-semibold text-[#E0E0E0]">{exam.examName}</h3>
                </div>
              </div>
            ))}
          </div>
          {examDates.length > 3 && (
            <button 
              onClick={() => setShowAll(!showAll)} 
              className="mt-4 text-[#4A90E2] hover:text-[#3A7FCF] transition-colors flex items-center justify-center w-full"
            >
              {showAll ? (
                <>
                  <ChevronUp size={20} className="mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={20} className="mr-1" />
                  See All
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
   
  );
};

export default ExamTimeline;