import React from 'react';
import { Upload, Edit, BookOpen, Target } from 'lucide-react';


interface QuickActionsProps {
  onUpload: () => void;
  onUpdateExam: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onUpload, onUpdateExam }) => {
  const actions = [
    { icon: Upload, label: 'Upload Resource', onClick: onUpload },
    { icon: Edit, label: 'Update Exam Info', onClick: onUpdateExam },
    { icon: BookOpen, label: 'Study Planner', onClick: () => {} },
    { icon: Target, label: 'Set Goals', onClick: () => {} },
  ];

  return (
    <div className="bg-[#1E1E1E] rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#E0E0E0]">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="bg-[#2C2C2C] p-4 rounded-lg flex flex-col items-center justify-center hover:bg-[#3A3A3A] transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#1E1E1E] flex items-center justify-center mb-3 group-hover:bg-[#4A90E2] transition-all duration-300">
              <action.icon size={24} className="text-[#4A90E2] group-hover:text-white transition-all duration-300" />
            </div>
            <span className="text-[#E0E0E0] text-sm font-medium group-hover:text-white transition-all duration-300">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;