import React, { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import Link from 'next/link';

interface SearchResult {
  type: 'resource' | 'exam';
  examTitle?: string;
  examName: string;
  s3Url?: string;
  _id?: string;
}

interface MobileSearchComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSearchComponent: React.FC<MobileSearchComponentProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchSearchResults();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 bg-white dark:bg-[#07080B] z-50 flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <FiSearch className="text-gray-400 mr-2" size={20} />
        <input 
          type="text" 
          className="flex-grow bg-transparent focus:outline-none text-black dark:text-white"
          placeholder="Search.." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={onClose}>
          <FiX className="text-gray-400" size={20} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {isLoading && <div className="p-4 text-gray-600 dark:text-gray-400">Loading...</div>}
        {error && <div className="p-4 text-red-500">{error}</div>}
        {!isLoading && !error && searchResults.length > 0 ? (
          <>
            {searchResults.filter(result => result.type === 'resource').length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Resources</h3>
                {searchResults.filter(result => result.type === 'resource').map((result, index) => (
                  <Link key={index} href={result.s3Url || '#'} className="block py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <p className="text-black dark:text-white">{result.examTitle}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{result.examName}</p>
                  </Link>
                ))}
              </div>
            )}
            {searchResults.filter(result => result.type === 'exam').length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Exams</h3>
                {searchResults.filter(result => result.type === 'exam').map((result, index) => (
                  <Link key={index} href={`/exam/${result._id}`} className="block py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <p className="text-black dark:text-white">{result.examName}</p>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="p-4 text-gray-600 dark:text-gray-400">No results found</div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchComponent;