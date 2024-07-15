import React, { useState } from 'react';
import { TrendingUp, FileText } from 'lucide-react';

interface Resource {
  _id: string;
  examTitle: string;
  examCategory: string;
  s3Url: string;
  uploadDate: string;
  userName: string;
  fileName: string;
  summary?: string;
}

interface RecentUploadsProps {
  resources: Resource[];
  setResources: React.Dispatch<React.SetStateAction<Resource[]>>;
}

const RecentUploads: React.FC<RecentUploadsProps> = ({ resources, setResources }) => {
  const [summarizing, setSummarizing] = useState<{ [key: string]: boolean }>({});

  const handleSummarize = async (resourceId: string, s3Url: string) => {
    setSummarizing({ ...summarizing, [resourceId]: true });
    try {
      const response = await fetch('/api/summarize-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ s3Url }),
      });

      if (response.ok) {
        const data = await response.json();
        setResources(resources.map(resource => 
          resource._id === resourceId ? { ...resource, summary: data.summary } : resource
        ));
      } else {
        console.error('Failed to summarize PDF');
      }
    } catch (error) {
      console.error('Error summarizing PDF:', error);
    } finally {
      setSummarizing({ ...summarizing, [resourceId]: false });
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-lg overflow-hidden">
      <h2 className="text-lg font-semibold p-4 border-b border-[#2C2C2C] flex items-center text-white">
        <TrendingUp className="mr-2" size={20} color="#4A90E2" />Recent Uploads
      </h2>
      <ul className="divide-y divide-[#2C2C2C]">
        {resources.map((resource) => (
          <li key={resource._id} className="p-4 hover:bg-[#2C2C2C] transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText size={20} color="#66BB6A" />
                <div>
                  <div className="font-medium text-white">{resource.examTitle}</div>
                  <div className="text-sm text-[#E0E0E0]">{resource.examCategory}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a href={resource.s3Url} target="_blank" rel="noopener noreferrer" className="text-[#4A90E2] hover:underline text-sm">
                  Download
                </a>
                {resource.fileName.toLowerCase().endsWith('.pdf') && (
                  <button
                    onClick={() => handleSummarize(resource._id, resource.s3Url)}
                    disabled={summarizing[resource._id]}
                    className="bg-[#4A90E2] text-white px-2 py-1 rounded text-sm hover:bg-[#3A80D2] transition-colors"
                  >
                    {summarizing[resource._id] ? 'Summarizing...' : 'Summarize'}
                  </button>
                )}
              </div>
            </div>
            {resource.summary && (
              <div className="mt-2 p-2 bg-[#2C2C2C] rounded text-sm">
                <h4 className="font-semibold mb-1 text-[#FFA726]">Summary:</h4>
                <p className="text-[#E0E0E0]">{resource.summary}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentUploads;