'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, X } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface Exam {
  _id: string;
  examName: string;
  examDate: string;
}

interface ExamCountdownProps {
  subscribedExams: Exam[];
  isAuthenticated: boolean;
  userId: string | null;
}

const ExamCountdown: React.FC<ExamCountdownProps> = ({ subscribedExams, isAuthenticated, userId }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [nearestExam, setNearestExam] = useState<Exam | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [showExamsPopup, setShowExamsPopup] = useState(false);
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const router = useRouter();

  const formatDate = (dateString: string): string => {
    if (dateString.startsWith('Between')) {
      const [_, startMonth, __, endMonth, year] = dateString.split(' ');
      return `Between ${startMonth} and ${endMonth}, ${year}`;
    } else {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  const fetchAvailableExams = async () => {
    console.log('Fetching available exams...');
    try {
      const response = await fetch('/api/exams');
      if (response.ok) {
        const exams = await response.json();
        console.log('Available exams:', exams);
        setAvailableExams(exams);
      } else {
        console.error('Failed to fetch exams');
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const subscribeToExam = async (examId: string) => {
    console.log('Subscribing to exam:', examId);
    try {
      const response = await fetch(`/api/subscribe/${examId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: 'dummy-token' }), // Replace with actual FCM token if available
      });

      if (response.ok) {
        console.log('Successfully subscribed to exam');
        setShowExamsPopup(false);
        refreshExams();
      } else {
        console.error('Failed to subscribe to exam');
      }
    } catch (error) {
      console.error('Error subscribing to exam:', error);
    }
  };

  const refreshExams = async () => {
    console.log('Refreshing exams...');
    // This function should re-fetch the user's subscribed exams
    // You'll need to implement this based on your app's state management
    // For now, we'll just close the popup and re-run the initial effects
    setShowExamsPopup(false);
    findNearestExam();
  };

  const findNearestExam = () => {
    console.log('Finding nearest exam...');
    const now = new Date();
    let nearest: Exam | null = null as Exam | null;
    let nearestDate: Date | null = null;

    subscribedExams.forEach(exam => {
      let examDate: Date;
      if (exam.examDate.startsWith('Between')) {
        const [_, startMonth, __, endMonth, year] = exam.examDate.split(' ');
        const startDate = new Date(`${startMonth} 1, ${year}`);
        const endDate = new Date(`${endMonth} 28, ${year}`);
        examDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
      } else {
        examDate = new Date(exam.examDate);
      }

      if (examDate > now && (!nearestDate || examDate < nearestDate)) {
        nearest = exam;
        nearestDate = examDate;
      }
    });

    console.log('Nearest exam:', nearest);
    setNearestExam(nearest);
    if (nearest) {
      setFormattedDate(formatDate(nearest.examDate));
    }
  };

  useEffect(() => {
    console.log('ExamCountdown component mounted');
    findNearestExam();
  }, [subscribedExams]);

  useEffect(() => {
    if (!nearestExam) return;

    const timer = setInterval(() => {
      const now = new Date();
      let examDate: Date;

      if (nearestExam.examDate.startsWith('Between')) {
        const [_, startMonth, __, endMonth, year] = nearestExam.examDate.split(' ');
        const startDate = new Date(`${startMonth} 1, ${year}`);
        const endDate = new Date(`${endMonth} 28, ${year}`);
        examDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
      } else {
        examDate = new Date(nearestExam.examDate);
      }

      const difference = examDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        clearInterval(timer);
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nearestExam]);

  const handleSubscribeClick = () => {
    console.log('Subscribe button clicked');
    console.log('isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to sign-in');
      router.push('/sign-in');
    } else {
      console.log('Fetching available exams and showing popup');
      fetchAvailableExams();
      setShowExamsPopup(true);
    }
  };

  console.log('Rendering ExamCountdown component');
  console.log('showExamsPopup:', showExamsPopup);
  console.log('availableExams:', availableExams);

  return (
    <>
      <div className="bg-gradient-to-r from-[#1A2980] to-[#26D0CE] rounded-lg p-6 mt-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
          <Clock className="mr-2" size={24} />
          Exam Countdown
        </h2>
        {nearestExam && timeLeft ? (
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-white mb-2">{nearestExam.examName}</h3>
            <p className="text-white text-opacity-80 mb-4 flex items-center">
              <Calendar className="mr-2" size={16} />
              {formattedDate}
            </p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="bg-white bg-opacity-30 rounded-lg p-2">
                  <div className="text-3xl font-bold text-white">{value}</div>
                  <div className="text-xs uppercase text-white text-opacity-80">{unit}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-white text-center">
              Subscribe to any exam to start the countdown.
            </p>
            <button
              onClick={handleSubscribeClick}
              className="mt-4 bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-300"
            >
              Subscribe
            </button>
          </div>
        )}
      </div>

      {showExamsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Available Exams</h2>
              <button onClick={() => setShowExamsPopup(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {availableExams.map((exam) => (
                <div key={exam._id} className="flex justify-between items-center mb-2 p-2 hover:bg-[#2C2C2C] rounded">
                  <span className="text-[#E0E0E0]">{exam.examName} - {formatDate(exam.examDate)}</span>
                  <button
                    onClick={() => subscribeToExam(exam._id)}
                    className="bg-[#66BB6A] text-white px-3 py-1 rounded hover:bg-[#5CAD60] transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowExamsPopup(false)}
              className="mt-4 w-full bg-[#66BB6A] text-white p-2 rounded hover:bg-[#5CAD60] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamCountdown;