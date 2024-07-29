import React, { useEffect } from 'react';

interface ExamName{
  name: string;
  count: number;
}

interface ExamNamePillsProps {
  examNames: ExamName[];
  activeExamName: string;
  onExamNameChange: (examName: string) => void;
}

const ExamNamePills: React.FC<ExamNamePillsProps> = ({ examNames, activeExamName, onExamNameChange }) => {
  useEffect(() => {
    console.log('ExamNamePills received exam names:', examNames);
  }, [examNames]);

  const allCount = examNames?.reduce((sum, examName) => sum + examName.count, 0);

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        <button
          onClick={() => onExamNameChange('All')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeExamName === 'All'
              ? 'bg-[#1099AE] text-white'
              : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
        >
          All ({allCount})
        </button>
        {examNames?.map((examName, index) => (
          <button
            key={index}
            onClick={() => onExamNameChange(examName.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeExamName === examName.name
                ? 'bg-[#1099AE] text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {examName.name} ({examName.count})
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamNamePills;