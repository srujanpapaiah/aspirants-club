import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

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

interface ResourceGridProps {
  resources: Resource[];
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ resources }) => {
  return (
    <div className="bg-[#1E1E1E] rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Study Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div key={resource._id} className="bg-[#2C2C2C] rounded-lg p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <FileText className="text-[#4A90E2] mr-2" size={20} />
              <h3 className="text-lg font-semibold truncate">{resource.examTitle}</h3>
            </div>
            <p className="text-sm text-gray-400 mb-2">{resource.examCategory}</p>
            <p className="text-xs text-gray-500 mb-4">Uploaded by {resource.userName} on {new Date(resource.uploadDate).toLocaleDateString()}</p>
            <div className="mt-auto flex justify-between">
              <a 
                href={resource.s3Url} 
                download 
                className="text-[#4A90E2] hover:text-[#3A80D2] flex items-center"
              >
                <Download size={16} className="mr-1" />
                Download
              </a>
              <button className="text-[#66BB6A] hover:text-[#5CAD60] flex items-center">
                <ExternalLink size={16} className="mr-1" />
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceGrid;