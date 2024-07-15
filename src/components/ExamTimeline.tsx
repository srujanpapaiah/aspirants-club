import React, { useEffect, useState } from 'react';
import { Calendar, Clock, ExternalLink } from 'lucide-react';

interface ExamDate {
  _id: string;
  examName: string;
  examDate: string;
  examDetails: string;
  source: string;
}

const ExamTimeline: React.FC = () => {
  const [examDates, setExamDates] = useState<ExamDate[]>([]);

  useEffect(() => {
    fetchExamDates();
  }, []);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-[#1E1E1E]/80 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center text-[#E0E0E0]">
        <Calendar className="mr-2" size={24} />
        Upcoming Exams
      </h2>
      <div className="space-y-4">
        {examDates.map((exam) => (
          <div key={exam._id} className="bg-[#2C2C2C]/90 rounded-lg p-4 hover:bg-[#3A3A3A]/90 transition-all duration-300">
            <h3 className="font-semibold text-[#E0E0E0]">{exam.examName}</h3>
            <p className="text-sm text-[#B0B0B0] flex items-center mt-1">
              <Clock size={14} className="mr-1" />
              {formatDate(exam.examDate)}
            </p>
            <p className="text-sm text-[#A0A0A0] mt-2">{exam.examDetails}</p>
            <p className="text-xs text-[#808080] mt-2 flex items-center">
              <ExternalLink size={12} className="mr-1" />
              Source: {exam.source}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamTimeline;