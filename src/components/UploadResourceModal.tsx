import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { useUser } from '@clerk/nextjs';


interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

const popularExams = [
  "UPSC Civil Services",
  "IAS",
  "IPS",
  "IFS",
  "SSC CGL",
  "SSC CHSL",
  "IBPS PO",
  "IBPS Clerk",
  "RBI Grade B",
  "SBI PO",
  "Railway RRB",
  "GATE",
  "UGC NET",
  "CTET",
  "NDA",
  "CDS",
  "CAPF",
  "State PSC",
  "Other"
];

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const { user } = useUser();
  const [examName, setExamName] = useState('');
  const [customExamName, setCustomExamName] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examCategory, setExamCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const finalExamName = examName === 'Other' ? customExamName : examName;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('examName', finalExamName);
    formData.append('examTitle', examTitle);
    formData.append('examCategory', examCategory);
    formData.append('userName', user?.fullName || 'Anonymous');

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
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Upload Resource</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleUpload} className="space-y-4">
          <select
            value={examName}
            onChange={handleExamNameChange}
            required
            className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#4A90E2] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          >
            <option value="">Select Exam Name</option>
            {popularExams.map((exam) => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
          {examName === 'Other' && (
            <input
              type="text"
              value={customExamName}
              onChange={(e) => setCustomExamName(e.target.value)}
              placeholder="Enter Custom Exam Name"
              required
              className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#4A90E2] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
          )}
          <input
            type="text"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            placeholder="Resource Title"
            required
            className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#4A90E2] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          />
          <select
            value={examCategory}
            onChange={(e) => setExamCategory(e.target.value)}
            required
            className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#4A90E2] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          >
            <option value="">Select Category</option>
            <option value="Syllabus">Syllabus</option>
            <option value="Previous Year Papers">Previous Year Papers</option>
            <option value="Mock Tests">Mock Tests</option>
            <option value="Study Material">Study Material</option>
            <option value="Current Affairs">Current Affairs</option>
          </select>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            required
            className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#4A90E2] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          />
          <button
            type="submit"
            className="w-full bg-[#4A90E2] text-white p-2 rounded hover:bg-[#3A80D2] transition-colors flex items-center justify-center"
          >
            <Upload className="mr-2" size={20} />
            Upload Resource
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;