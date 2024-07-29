import React, { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface PDFUploaderProps {
  onUpload: (file: File) => void;
}

export const PDFUploader: React.FC<PDFUploaderProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="bg-[#121717] text-white p-6 rounded-lg max-w-2xl mx-auto shadow-lg ">
      <div className="flex items-center justify-center mb-6">
        <Upload className="text-[#1AA38C] mr-2" size={32} />
        <h2 className="text-3xl font-bold">Upload PDF</h2>
      </div>
      <h3 className="text-xl font-semibold mb-6 text-center text-[#1AA38C]">
        AI-Powered Exam Recommendation
      </h3>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-[#1E2A2F] p-6 rounded-md mb-6">
          <label htmlFor="pdf-upload" className="flex flex-col items-center justify-center cursor-pointer">
            <FileText className="text-[#1AA38C] mb-2" size={48} />
            <span className="text-[#1AA38C] font-semibold mb-2">
              {file ? file.name : 'Choose a PDF file'}
            </span>
            <span className="text-sm text-gray-300">
              or drag and drop it here
            </span>
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <button
          type="submit"
          disabled={!file}
          className="w-full bg-[#1AA38C] text-white px-4 py-3 rounded font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 ease-in-out hover:bg-[#158F7A]"
        >
          Upload and Get Recommendation
        </button>
      </form>
      
      <div className="bg-[#1E2A2F] p-4 rounded-md flex items-center justify-center">
        <CheckCircle className="text-[#1AA38C] mr-3" size={24} />
        <p className="text-sm text-center text-[#1AA38C]">
          Get personalized exam recommendations based on your PDF
        </p>
      </div>
    </div>
  );
};