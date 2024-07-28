import React from 'react';
import { Clock, Upload, CheckCircle, Book } from 'lucide-react';

const Eligibility = () => {
  return (
    <div className="bg-[#121717] text-white p-6 rounded-lg max-w-2xl mx-auto shadow-lg mt-16">
      <div className="flex items-center justify-center mb-6">
        <Clock className="text-[#1AA38C] mr-2" size={32} />
        <h2 className="text-3xl font-bold">Coming Soon</h2>
      </div>
      <h3 className="text-xl font-semibold mb-6 text-center text-[#1AA38C]">
        AI-Powered Exam Eligibility Checker
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FeatureCard 
          icon={<Upload size={40} />}
          title="Upload Documents"
          description="Simply upload your educational documents"
        />
        <FeatureCard 
          icon={<svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16l4-4m0 0l-4-4m4 4H8" />
          </svg>}
          title="AI Analysis"
          description="Our AI analyzes your qualifications"
        />
        <FeatureCard 
          icon={<CheckCircle size={40} />}
          title="Get Results"
          description="Discover exams you're eligible for"
        />
      </div>
      
      <div className="bg-[#1E2A2F] p-4 rounded-md flex items-center justify-center">
        <Book className="text-[#1AA38C] mr-3" size={24} />
        <p className="text-sm text-center text-[#1AA38C]">
          Revolutionizing government exam eligibility checks in India
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-[#1AA38C] mb-2">{icon}</div>
    <h4 className="font-semibold mb-1">{title}</h4>
    <p className="text-sm text-gray-300">{description}</p>
  </div>
);

export default Eligibility;