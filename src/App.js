import React, { useState, useEffect } from 'react';
import { Search, Upload, BookOpen, Users, TrendingUp, Award, Calendar } from 'lucide-react';

const AspirantsClub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [exams, setExams] = useState([
    { name: "UPSC Civil Services Prelims", date: "2024-06-15", type: "government" },
    { name: "JEE Main", date: "2024-04-10", type: "entrance" },
    { name: "NEET UG", date: "2024-05-05", type: "entrance" },
    { name: "SSC CGL", date: "2024-03-20", type: "government" },
  ]);

  const [newExam, setNewExam] = useState({ name: '', date: '', type: '', source: '' });

  const examCategories = [
    { name: "JEE (Main & Advanced)", icon: "🧮" },
    { name: "NEET", icon: "🧬" },
    { name: "UPSC Civil Services", icon: "🏛️" },
    { name: "CAT", icon: "📊" },
    { name: "Bank PO", icon: "🏦" },
    { name: "GATE", icon: "⚙️" },
  ];

  const trendingTopics = ["Quantum Mechanics", "Indian Constitution", "Organic Chemistry", "Data Structures"];

  useEffect(() => {
    sortExams();
  }, [exams]);

  const sortExams = () => {
    setExams(prevExams => [...prevExams].sort((a, b) => new Date(a.date) - new Date(b.date)));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysLeft = (dateString) => {
    const examDate = new Date(dateString);
    const today = new Date();
    const timeDiff = examDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysLeft > 0 ? `${daysLeft} days` : 'Exam has passed';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

  const handleExamSubmit = (e) => {
    e.preventDefault();
    setExams(prevExams => [...prevExams, newExam]);
    setNewExam({ name: '', date: '', type: '', source: '' });
    alert('Thank you for submitting exam information!');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-700 mb-2">Aspirants Club</h1>
          <p className="text-lg text-gray-600">Empowering Your Exam Journey</p>
        </header>
        
        {/* Search and action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <form onSubmit={handleSearch} className="w-full md:w-2/3 flex items-center mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-r-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <Search size={20} />
            </button>
          </form>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowUploadModal(true)} 
              className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-full hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Upload size={20} className="inline mr-2" />Upload
            </button>
            <button 
              onClick={() => alert('Joining study group...')} 
              className="border border-teal-500 text-teal-700 px-4 py-2 rounded-full hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <Users size={20} className="inline mr-2" />Join Group
            </button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-teal-700 mb-2 sm:mb-0">
                <TrendingUp size={24} className="inline mr-2" />Trending Resources
              </h2>
              <div className="flex space-x-2">
                <button 
                  className={`px-4 py-2 rounded ${activeTab === 'recent' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveTab('recent')}
                >
                  Recent
                </button>
                <button 
                  className={`px-4 py-2 rounded ${activeTab === 'popular' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveTab('popular')}
                >
                  Popular
                </button>
              </div>
            </div>
            {/* Add content for trending resources here */}
            <p>Trending resources content goes here...</p>
          </div>

          {/* Top Exam Categories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">
              <Award size={24} className="inline mr-2" />Top Exam Categories
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {examCategories.map((category, index) => (
                <li key={index} className="flex items-center bg-teal-50 p-3 rounded-md hover:bg-teal-100 transition-colors cursor-pointer">
                  <span className="mr-2 text-2xl">{category.icon}</span>
                  <span>{category.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">
              <Calendar size={24} className="inline mr-2" />Upcoming Exams
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 bg-teal-600 text-white">Exam Name</th>
                    <th className="text-left p-2 bg-teal-600 text-white">Date</th>
                    <th className="text-left p-2 bg-teal-600 text-white">Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-2">{exam.name}</td>
                      <td className="p-2">{formatDate(exam.date)}</td>
                      <td className="p-2">{calculateDaysLeft(exam.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Submit Exam Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-teal-700">
              <Upload size={24} className="inline mr-2" />Submit Exam Information
            </h2>
            <form onSubmit={handleExamSubmit}>
              <input
                type="text"
                placeholder="Exam Name"
                value={newExam.name}
                onChange={(e) => setNewExam({...newExam, name: e.target.value})}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <select
                value={newExam.type}
                onChange={(e) => setNewExam({...newExam, type: e.target.value})}
                className="w-full p-2 mb-4 border rounded"
                required
              >
                <option value="">Select Type</option>
                <option value="government">Government</option>
                <option value="entrance">Entrance</option>
                <option value="competitive">Competitive</option>
                <option value="other">Other</option>
              </select>
              <input
                type="url"
                placeholder="Information Source URL"
                value={newExam.source}
                onChange={(e) => setNewExam({...newExam, source: e.target.value})}
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <button type="submit" className="w-full bg-teal-600 text-white p-2 rounded hover:bg-teal-700">
                Submit Exam Info
              </button>
            </form>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-teal-700">
            <BookOpen size={24} className="inline mr-2" />Trending Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, index) => (
              <span key={index} className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-teal-200">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AspirantsClub;