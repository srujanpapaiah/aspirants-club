'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';

interface Exam {
  _id: string;
  examName: string;
  examDate: string;
}

interface ExamCountdownProps {
  subscribedExams: Exam[];
}

const ExamCountdown: React.FC<ExamCountdownProps> = ({ subscribedExams }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [nearestExam, setNearestExam] = useState<Exam | null>(null);

  useEffect(() => {
    const findNearestExam = () => {
      const now = new Date();
      let nearest: Exam | null = null;
      let nearestDate: Date | null = null;

      subscribedExams.forEach(exam => {
        let examDate: Date;
        if (exam.examDate.startsWith('Between')) {
          const [_, startMonth, __, endMonth, year] = exam.examDate.split(' ');
          const startDate = new Date(`${startMonth} 1, ${year}`);
          const endDate = new Date(`${endMonth} 28, ${year}`); // Using 28 as an average end of month
          examDate = new Date((startDate.getTime() + endDate.getTime()) / 2);
        } else {
          examDate = new Date(exam.examDate);
        }

        if (examDate > now && (!nearestDate || examDate < nearestDate)) {
          nearest = exam;
          nearestDate = examDate;
        }
      });

      setNearestExam(nearest);
    };

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

  if (!nearestExam || !timeLeft) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-[#1A2980] to-[#26D0CE] rounded-lg p-6 mt-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center">
        <Clock className="mr-2" size={24} />
        Exam Countdown
      </h2>
      <div className="bg-white bg-opacity-20 rounded-lg p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{nearestExam.examName}</h3>
        <p className="text-white text-opacity-80 mb-4 flex items-center">
          <Calendar className="mr-2" size={16} />
          {nearestExam.examDate}
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
    </div>
  );
};

export default ExamCountdown;