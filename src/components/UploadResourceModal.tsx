import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

interface Exam {
  _id: string;
  examName: string;
  examDate: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const { user } = useUser();
  const [examName, setExamName] = useState('');
  const [customExamName, setCustomExamName] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examCategory, setExamCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isExamsLoading, setIsExamsLoading] = useState(true);
  const [examsError, setExamsError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch('/api/exams');
        if (response.ok) {
          const data = await response.json();
          setExams(data.exams);
        } else {
          throw new Error('Failed to fetch exams');
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        setExamsError('Failed to load exams. Please try again later.');
      } finally {
        setIsExamsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size <= 10 * 1024 * 1024) { // 10MB in bytes
        setFile(selectedFile);
      } else {
        alert('File size must be 10MB or less');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleExamNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExamName(e.target.value);
    if (e.target.value !== 'Other') {
      setCustomExamName('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    setIsLoading(true);
    const finalExamName = examName === 'Other' ? customExamName : examName;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('examName', finalExamName);
    formData.append('examTitle', examTitle);
    formData.append('examCategory', examCategory);
    formData.append('userName', user?.fullName ?? 'Anonymous');

    try {
      const response = await fetch('/api/upload-resource', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload response:', data);
        alert(`Resource uploaded successfully! S3 URL: ${data.s3Url}`);
        onUploadSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to upload resource:', errorData);
        alert(`Failed to upload resource: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error uploading resource:', error);
      alert('An error occurred while uploading the resource.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isExamsLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#121717] rounded-lg p-6">
          <Loader2 className="animate-spin h-8 w-8 text-white" />
          <p className="mt-2 text-white">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (examsError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#121717] rounded-lg p-6">
          <p className="text-red-500">{examsError}</p>
          <button 
            onClick={onClose}
            className="mt-4 bg-[#1AA38C] text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#121717] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Upload Resource</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label htmlFor="examName" className="block text-sm font-medium text-gray-300 mb-1">Exam Name</label>
            <select
              id="examName"
              value={examName}
              onChange={handleExamNameChange}
              required
              className="w-full bg-[#1E2A2F] text-white border border-[#1AA38C] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1AA38C] transition-colors"
            >
              <option value="">Select Exam Name</option>
              {exams.map((exam) => (
                <option key={exam._id} value={exam.examName}>{exam.examName}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          {examName === 'Other' && (
            <div>
              <label htmlFor="customExamName" className="block text-sm font-medium text-gray-300 mb-1">Custom Exam Name</label>
              <input
                id="customExamName"
                type="text"
                value={customExamName}
                onChange={(e) => setCustomExamName(e.target.value)}
                placeholder="Enter Custom Exam Name"
                required
                className="w-full bg-[#1E2A2F] text-white border border-[#1AA38C] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1AA38C] transition-colors"
              />
            </div>
          )}
          <div>
            <label htmlFor="examTitle" className="block text-sm font-medium text-gray-300 mb-1">Resource Title</label>
            <input
              id="examTitle"
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="Resource Title"
              required
              className="w-full bg-[#1E2A2F] text-white border border-[#1AA38C] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1AA38C] transition-colors"
            />
          </div>
          <div>
            <label htmlFor="examCategory" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              id="examCategory"
              value={examCategory}
              onChange={(e) => setExamCategory(e.target.value)}
              required
              className="w-full bg-[#1E2A2F] text-white border border-[#1AA38C] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1AA38C] transition-colors"
            >
              <option value="">Select Category</option>
              <option value="Syllabus">Syllabus</option>
              <option value="Previous Year Papers">Previous Year Papers</option>
              <option value="Mock Tests">Mock Tests</option>
              <option value="Study Material">Study Material</option>
              <option value="Current Affairs">Current Affairs</option>
            </select>
          </div>
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-1">Upload File</label>
            <input
              id="file"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              required
              className="w-full bg-[#1E2A2F] text-white border border-[#1AA38C] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1AA38C] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1AA38C] file:text-white hover:file:bg-[#158F7A]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#1AA38C] text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#158F7A]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2" size={20} />
                Upload Resource
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;