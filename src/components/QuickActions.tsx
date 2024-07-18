import React from 'react';
import { Upload, Edit, BookOpen, Target } from 'lucide-react';

interface QuickActionsProps {
  onUpload: () => void;
  onUpdateExam: () => void;
  isLoggedIn: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onUpload, onUpdateExam, isLoggedIn }) => {
  const actions = [
    { icon: Upload, label: 'Upload Resource', onClick: onUpload },
    { icon: Edit, label: 'Update Exam Info', onClick: onUpdateExam },
    // { icon: BookOpen, label: 'Study Planner', onClick: () => {} },
    // { icon: Target, label: 'Set Goals', onClick: () => {} },
  ];

  return (
    <div className="bg-[#121717] rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#E0E0E0]">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-300 group
              ${isLoggedIn 
                ? 'bg-[#2C2C2C] hover:bg-[#3A3A3A]' 
                : 'bg-[#1E1E1E] cursor-not-allowed opacity-50'}`}
            disabled={!isLoggedIn}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300
              ${isLoggedIn 
                ? 'bg-[#1E1E1E] group-hover:bg-[#4A90E2]' 
                : 'bg-[#2C2C2C]'}`}
            >
              <action.icon 
                size={24} 
                className={`transition-all duration-300
                  ${isLoggedIn 
                    ? 'text-[#4A90E2] group-hover:text-white' 
                    : 'text-[#666666]'}`}
              />
            </div>
            <span className={`text-sm font-medium transition-all duration-300
              ${isLoggedIn 
                ? 'text-[#E0E0E0] group-hover:text-white' 
                : 'text-[#999999]'}`}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;