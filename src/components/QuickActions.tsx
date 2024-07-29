import React from 'react';
import { Upload, Edit, BookOpen, Target } from 'lucide-react';

interface QuickActionsProps {
  onUpload: () => void;
  isLoggedIn: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onUpload, isLoggedIn }) => {
  const actions = [
    { icon: Upload, label: 'Upload', onClick: onUpload },
    // { icon: Edit, label: 'Update Exam Info', onClick: () => {} },
    // { icon: BookOpen, label: 'Study Planner', onClick: () => {} },
    // { icon: Target, label: 'Set Goals', onClick: () => {} },
  ];

  return (
    <div>
      <div className="">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${
              index === 0
                ? "hidden rounded-[4px] border border-[#ECECEC]  py-2 text-black hover:bg-slate-100 dark:border-[#131620] dark:text-white dark:hover:bg-inherit lg:inline"
                : "rounded-[4px] border border-[#ECECEC]  py-2 text-black hover:bg-slate-100 dark:border-[#131620] dark:text-white dark:hover:bg-inherit"
            } ${
              isLoggedIn 
                ? '' 
                : 'cursor-not-allowed opacity-50'
            }`}
            disabled={!isLoggedIn}
          >
            <div className={`flex items-center gap-2 ${index === 0 ? '' : 'flex-col'}`}>
              <action.icon 
                size={index === 0 ? 18 : 24} 
                className={`${
                  index === 0 ? 'text-black dark:text-white' : 'mb-2'
                }`}
              />
              <span className={`${
                index === 0 ? 'hidden text-sm lg:inline' : 'text-sm'
              }`}>
                {action.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;