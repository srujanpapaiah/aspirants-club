import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Resource {
  _id: string;
  examTitle: string;
  examName: string;
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

const getExamLogo = (examName: string) => {
  const examLogos: { [key: string]: string } = {
    'UPSC': '/logos/upsc-logo.png',
    'GATE': '/logos/gate-logo.png',
    'CAT': '/logos/cat-logo.png',
    'NEET': '/logos/neet-logo.png',
    'JEE': '/logos/jee-logo.png',
    'RBI Grade B': '/logos/rbi-logo.png',
    // Add more exams here
  };

  return examLogos[examName] || '/logos/default-exam-logo.png';
};

const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'DOCX';
    case 'xls':
    case 'xlsx':
      return 'XLSX';
    case 'ppt':
    case 'pptx':
      return 'PPTX';
    default:
      return 'FILE';
  }
};

const ResourceGrid: React.FC<ResourceGridProps> = ({ resources }) => {
  const router = useRouter();

  const sortedResources = useMemo(() => {
    return [...resources].sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
  }, [resources]);

  const handlePreview = (url: string) => {
    router.push(`/pdfs?pdfUrl=${encodeURIComponent(url)}`);
  };

  return (
    <div className="bg-[#121717] rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Study Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedResources.map((resource) => (
          <div key={resource._id} className="bg-[#2C2C2C] rounded-lg overflow-hidden flex flex-col">
            <div className="h-40 bg-gradient-to-br from-[#4A90E2] to-[#1AA38C] flex items-center justify-center relative">
              <img 
                src={getExamLogo(resource.examName)} 
                alt={`${resource.examName} logo`}
                className="h-24 w-24 object-contain"
              />
              <div className="absolute bottom-0 right-0 bg-black bg-opacity-50 px-2 py-1 text-xs text-white">
                {getFileType(resource.fileName)}
              </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold mb-2 truncate">{resource.examTitle}</h3>
              <p className="text-sm text-[#1099ae] mb-1">{resource.examName}</p>
              <p className="text-xs text-gray-500 mb-2">{resource.examCategory}</p>
              <div className="mt-auto">
                <p className="text-xs text-gray-500 mb-2">
                 {resource.userName} {formatDistanceToNow(new Date(resource.uploadDate), { addSuffix: true })}
                </p>
                <div className="flex justify-between">
                  <a 
                    href={resource.s3Url} 
                    download 
                    className="text-[#4A90E2] hover:text-[#3A80D2] flex items-center text-sm"
                  >
                    <Download size={16} className="mr-1" />
                    Download
                  </a>
                  <button 
                    onClick={() => handlePreview(resource.s3Url)}
                    className="text-[#66BB6A] hover:text-[#5CAD60] flex items-center text-sm"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceGrid;