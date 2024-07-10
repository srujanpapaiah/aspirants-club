import React, { useState } from 'react';
import { Search, Upload, BookOpen, Users, TrendingUp, Award, Download, Eye } from 'lucide-react';

// Note: In a real application, you'd install and import a markdown library
// For this example, we'll use a placeholder function
const renderMarkdown = (text) => {
  return text.split('\n').map((line, index) => <p key={index}>{line}</p>);
};

const AspirantsClub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);
  const [activeTab, setActiveTab] = useState('recent');

  const examCategories = [
    { name: "JEE (Main & Advanced)", icon: "🧮" },
    { name: "NEET", icon: "🧬" },
    { name: "UPSC Civil Services", icon: "🏛️" },
    { name: "CAT", icon: "📊" },
    { name: "Bank PO", icon: "🏦" },
    { name: "GATE", icon: "⚙️" },
  ];

  const recentUploads = [
    { 
      id: 1, 
      title: "JEE Maths Formula Sheet", 
      user: "MathWhiz", 
      downloads: 1200, 
      avatar: "M",
      content: `
# JEE Maths Formula Sheet

1. Quadratic Equation: ax^2 + bx + c = 0
   x = [-b ± √(b^2 - 4ac)] / 2a

2. Pythagorean Theorem: a^2 + b^2 = c^2

3. Trigonometric Identities:
   sin^2(θ) + cos^2(θ) = 1
   tan(θ) = sin(θ) / cos(θ)

4. Differentiation:
   d/dx(x^n) = nx^(n-1)
   d/dx(e^x) = e^x

5. Integration:
   ∫ x^n dx = (x^(n+1))/(n+1) + C (where n ≠ -1)
   ∫ e^x dx = e^x + C
      `
    },
    { 
      id: 2, 
      title: "UPSC History Notes", 
      user: "HistoryBuff", 
      downloads: 890, 
      avatar: "H",
      content: `
# UPSC History Notes - Ancient India

1. Indus Valley Civilization (3300-1300 BCE):
   - Major cities: Harappa, Mohenjo-daro
   - Features: Great Bath, Grid system, Drainage system

2. Vedic Period (1500-600 BCE):
   - Early Vedic (1500-1000 BCE)
   - Later Vedic (1000-600 BCE)
   - Texts: Rigveda, Samaveda, Yajurveda, Atharvaveda

3. Mauryan Empire (322-185 BCE):
   - Chandragupta Maurya
   - Ashoka the Great
   - Edicts of Ashoka

4. Gupta Empire (320-550 CE):
   - Golden Age of India
   - Chandragupta I, Samudragupta, Chandragupta II
      `
    },
    { 
      id: 3, 
      title: "NEET Biology MCQs", 
      user: "BioExpert", 
      downloads: 1500, 
      avatar: "B",
      content: `
# NEET Biology MCQs

1. Which of the following is not a function of the liver?
   a) Protein synthesis
   b) Detoxification
   c) Glycogen storage
   d) Insulin production
   Answer: d) Insulin production

2. Which of these is not a greenhouse gas?
   a) Carbon dioxide
   b) Methane
   c) Water vapor
   d) Nitrogen
   Answer: d) Nitrogen

3. The human heart is:
   a) Neurogenic
   b) Myogenic
   c) Autorhythmic
   d) Both b and c
   Answer: d) Both b and c

4. Which of the following is not a function of the kidney?
   a) Osmoregulation
   b) Excretion
   c) Hormone production
   d) Digestion
   Answer: d) Digestion
      `
    },
  ];

  const trendingTopics = ["Quantum Mechanics", "Indian Constitution", "Organic Chemistry", "Data Structures"];

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    alert(`Selected category: ${category.name}`);
  };

  const handleDownload = (resource) => {
    const element = document.createElement("a");
    const file = new Blob([resource.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${resource.title}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Update download count
    resource.downloads += 1;
    alert(`Downloaded ${resource.title}. New download count: ${resource.downloads}`);
  };

  const handlePreview = (resource) => {
    setPreviewContent({ title: resource.title, content: resource.content });
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Upload Resource</h2>
        <input type="text" placeholder="Resource Title" className="w-full p-2 mb-4 border rounded" />
        <textarea placeholder="Resource Content (Markdown supported)" className="w-full p-2 mb-4 border rounded h-40" />
        <div className="flex justify-end">
          <button onClick={() => setShowUploadModal(false)} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={() => {
            alert('Resource uploaded successfully!');
            setShowUploadModal(false);
          }} className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Upload</button>
        </div>
      </div>
    </div>
  );

  const PreviewModal = ({ title, content, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 h-3/4 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="markdown-content">
          {renderMarkdown(content)}
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">Close</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-teal-700 mb-2">Aspirants Club</h1>
        <p className="text-lg text-gray-600">Empowering Your Exam Journey</p>
      </header>
      
      <form onSubmit={handleSearch} className="flex items-center mb-8 bg-white rounded-full shadow-md p-2">
        <input
          type="text"
          placeholder="Search for resources, topics, or exams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow border-none focus:ring-0 outline-none px-4"
        />
        <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-full flex items-center hover:bg-teal-700">
          <Search className="mr-2" size={20} />Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center text-teal-700">
              <TrendingUp className="mr-2" size={24} />Trending Resources
            </h2>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 rounded ${activeTab === 'recent' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('recent')}
              >
                Recent
              </button>
              <button 
                className={`px-3 py-1 rounded ${activeTab === 'popular' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('popular')}
              >
                Popular
              </button>
            </div>
          </div>
          <ul className="space-y-4">
            {recentUploads.map((upload) => (
              <li key={upload.id} className="flex items-center space-x-4 bg-teal-50 p-3 rounded-lg">
                <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                  {upload.avatar}
                </div>
                <div className="flex-grow">
                  <div className="font-semibold text-teal-700">{upload.title}</div>
                  <div className="text-sm text-gray-600">By: {upload.user}</div>
                </div>
                <div className="text-sm text-gray-500">{upload.downloads} downloads</div>
                <button onClick={() => handlePreview(upload)} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 mr-2">
                  <Eye size={20} />
                </button>
                <button onClick={() => handleDownload(upload)} className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
                  <Download size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-teal-700">
            <Award className="mr-2" size={24} />Top Exam Categories
          </h2>
          <ul className="space-y-2">
            {examCategories.map((category, index) => (
              <li 
                key={index} 
                className="flex items-center bg-teal-50 p-2 rounded-md hover:bg-teal-100 transition-colors cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <span className="mr-2 text-2xl">{category.icon}</span>
                <span>{category.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-teal-700">
          <BookOpen className="mr-2" size={24} />Trending Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic, index) => (
            <span key={index} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-teal-200">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => setShowUploadModal(true)} 
          className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-full flex items-center hover:from-teal-600 hover:to-blue-700"
        >
          <Upload className="mr-2" size={20} />Upload Resource
        </button>
        <button 
          onClick={() => alert('Joining study group...')} 
          className="border border-teal-500 text-teal-700 px-6 py-2 rounded-full flex items-center hover:bg-teal-50"
        >
          <Users className="mr-2" size={20} />Join Study Group
        </button>
      </div>
      
      {showUploadModal && <UploadModal />}
      {previewContent && <PreviewModal title={previewContent.title} content={previewContent.content} onClose={() => setPreviewContent(null)} />}
    </div>
  );
};

export default AspirantsClub;