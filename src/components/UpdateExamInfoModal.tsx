import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useUser } from "@clerk/nextjs";

interface UpdateExamInfoModalProps {
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const popularExams = [
  "UPSC Civil Services",
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
  "Other"
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const UpdateExamInfoModal: React.FC<UpdateExamInfoModalProps> = ({ onClose, onUpdateSuccess }) => {
  const { user } = useUser();
  const [examName, setExamName] = useState('');
  const [customExamName, setCustomExamName] = useState('');
  const [exactDate, setExactDate] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [examDetails, setExamDetails] = useState('');
  const [source, setSource] = useState('');
  const [isExactDate, setIsExactDate] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const checkLastUpdate = async () => {
      try {
        const response = await fetch('/api/check-last-update');
        const data = await response.json();
        if (!data.canUpdate) {
          setErrorMessage("You can only update exam information once per day.");
        }
      } catch (error) {
        console.error('Error checking last update:', error);
      }
    };

    checkLastUpdate();
  }, []);

  const validateDateRange = () => {
    const currentDate = new Date();
    const selectedStartDate = new Date(year, months.indexOf(startMonth));
    const selectedEndDate = new Date(year, months.indexOf(endMonth));

    if (selectedEndDate < selectedStartDate) {
      setErrorMessage("End month cannot be before start month.");
      return false;
    }

    if (selectedEndDate < currentDate) {
      setErrorMessage("The selected date range has already passed.");
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errorMessage) return;

    const finalExamName = examName === 'Other' ? customExamName : examName;
    let examDate = exactDate;
    if (!isExactDate) {
      if (!validateDateRange()) return;
      examDate = `Between ${startMonth} to ${endMonth} ${year}`;
    } else {
      if (new Date(exactDate) < new Date()) {
        setErrorMessage("The selected date has already passed.");
        return;
      }
    }

    try {
      const response = await fetch('/api/update-exam-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examName: finalExamName,
          examDate,
          examDetails,
          source,
          updatedBy: user?.id,
        }),
      });

      if (response.ok) {
        alert('Exam information updated successfully!');
        onUpdateSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update exam information');
      }
    } catch (error) {
      console.error('Error updating exam information:', error);
      setErrorMessage('An error occurred while updating exam information.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Update Exam Information</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        {errorMessage && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={examName}
            onChange={(e) => {
              setExamName(e.target.value);
              if (e.target.value !== 'Other') setCustomExamName('');
            }}
            required
            className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#66BB6A] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
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
              className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#66BB6A] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
            />
          )}
          <div>
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={isExactDate}
                onChange={() => setIsExactDate(!isExactDate)}
                className="form-checkbox h-5 w-5 text-[#66BB6A]"
              />
              <span>Exact Date Known</span>
            </label>
          </div>
          {isExactDate ? (
            <input
              type="date"
              value={exactDate}
              onChange={(e) => setExactDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#66BB6A] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
            />
          ) : (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  required
                  className="w-1/2 bg-[#2C2C2C] text-[#E0E0E0] border border-[#66BB6A] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
                >
                  <option value="">Start Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  required
                  className="w-1/2 bg-[#2C2C2C] text-[#E0E0E0] border border-[#66BB6A] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
                >
                  <option value="">End Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min={new Date().getFullYear()}
                required
                className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#66BB6A] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
              />
            </div>
          )}
          <textarea
            value={examDetails}
            onChange={(e) => setExamDetails(e.target.value)}
            placeholder="Exam Details"
            rows={4}
            className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#66BB6A] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
          ></textarea>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Information Source"
            required
            className="w-full bg-[#2C2C2C] text-[#E0E0E0] border border-[#66BB6A] rounded p-2 focus:outline-none focus:ring-2 focus:ring-[#66BB6A]"
          />
          <button
            type="submit"
            className="w-full bg-[#66BB6A] text-white p-2 rounded hover:bg-[#5CAD60] transition-colors flex items-center justify-center"
            disabled={!!errorMessage}
          >
            <Save className="mr-2" size={20} />
            Update Exam Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateExamInfoModal;