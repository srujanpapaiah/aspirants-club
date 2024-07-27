import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiHome, FiSearch, FiPlusCircle, FiClock, FiBookOpen, FiX } from 'react-icons/fi';
import SearchComponent from './Search';
import UploadModal from './UploadResourceModal';
import ExamTimeline from './ExamTimeline';

interface MobileNavbarProps {
  onQuickActionsClick: () => void;
  onTimelineClick: () => void;
}

type SidebarItem = {
  src: string;
  text: string;
  link?: string;
  comingSoon?: boolean;
};

type Category = {
  title: string;
  items: SidebarItem[];
};

type SubscribedExam = {
  examId: string;
  examName: string;
  examLogo: string;
};

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  onQuickActionsClick,
  onTimelineClick,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [subscribedExams, setSubscribedExams] = useState<SidebarItem[]>([]);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  const staticCategories: Category[] = [
    {
      title: 'You',
      items: [
        { src: '/icons/sidebar/book-icon.svg', text: 'Resources', comingSoon: true },
        { src: '/icons/sidebar/save-icon.svg', text: 'Saved', comingSoon: true },
      ],
    },
  ];

  const handleTimelineClick = () => {
    setIsTimelineOpen(!isTimelineOpen);
  };

  const fetchSubscribedExams = async () => {
    try {
      const response = await fetch('/api/subscribed-exams', {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        const formattedExams = data.subscribedExams.map((exam: SubscribedExam) => ({
          src: exam.examLogo ? exam.examLogo : '/icons/sidebar/book-icon.svg',
          text: exam.examName,
          link: `/exam/${exam.examId}`,
        }));
        setSubscribedExams(formattedExams);
      }
    } catch (error) {
      console.error('Error fetching subscribed exams:', error);
    }
  };

  useEffect(() => {
    fetchSubscribedExams();
  }, []);

  const toggleLibrary = () => {
    setIsLibraryOpen(!isLibraryOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleActionsClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = () => {
    console.log('Resource uploaded successfully');
  };

  const isActive = (itemLink?: string) => pathname === itemLink;

  const handleNavigation = (link?: string) => {
    if (link) {
      router.push(link);
      setIsLibraryOpen(false);
    }
  };

  const categories: Category[] = [
    ...staticCategories,
    {
      title: 'Subscribed Exams',
      items: subscribedExams,
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#00090B] py-2 px-4 flex justify-between items-center shadow-lg">
        <button onClick={() => router.push('/')} className="flex flex-col items-center">
          <FiHome size={24} className="text-[#6F6F6F] dark:text-[#E1E1E1]" />
          <span className="text-xs mt-1 text-[#241c1c] dark:text-[#E1E1E1]">Home</span>
        </button>
        <button onClick={toggleSearch} className="flex flex-col items-center">
          <FiSearch size={24} className="text-[#6F6F6F] dark:text-[#E1E1E1]" />
          <span className="text-xs mt-1 text-[#6F6F6F] dark:text-[#E1E1E1]">Search</span>
        </button>
        <button onClick={handleActionsClick} className="flex flex-col items-center">
          <FiPlusCircle size={32} className="text-[#1AA38C]" />
          <span className="text-xs mt-1 text-[#6F6F6F] dark:text-[#E1E1E1]">Actions</span>
        </button>
        <button onClick={handleTimelineClick} className="flex flex-col items-center">
  <FiClock size={24} className="text-[#6F6F6F] dark:text-[#E1E1E1]" />
  <span className="text-xs mt-1 text-[#6F6F6F] dark:text-[#E1E1E1]">Timeline</span>
</button>
        <button onClick={toggleLibrary} className="flex flex-col items-center">
          <FiBookOpen size={24} className="text-[#6F6F6F] dark:text-[#E1E1E1]" />
          <span className="text-xs mt-1 text-[#6F6F6F] dark:text-[#E1E1E1]">Library</span>
        </button>
      </nav>

      {isTimelineOpen && (
  <div className="fixed inset-x-0 top-0 bottom-16 bg-[#040E12] z-50 flex flex-col overflow-y-auto">
    <div className="p-4">
      <button onClick={() => setIsTimelineOpen(false)} className="mb-4 text-[#6F6F6F] dark:text-[#E1E1E1]">
        <FiX size={24} />
      </button>
      <ExamTimeline refreshTrigger={0} />
    </div>
  </div>
)}

      {isSearchOpen && (
        <div className="fixed inset-x-0 top-0 bottom-16 bg-white dark:bg-[#00090B] z-50 flex flex-col">
          <div className="p-4 border-b border-[#ECECEC] dark:border-[#051013]">
            <SearchComponent 
              isMobile={true}
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />
          </div>
          <div className="flex-grow overflow-y-auto">
            {/* Search results will be displayed here */}
          </div>
        </div>
      )}

      {isLibraryOpen && (
        <div className="fixed inset-0 bg-white dark:bg-[#00090B] z-50 overflow-y-auto">
          <div className="p-4">
            <button onClick={toggleLibrary} className="mb-4 text-[#6F6F6F] dark:text-[#E1E1E1]">
              <FiX size={24} />
            </button>
            <nav className="flex flex-col space-y-6">
              {categories.map((category, index) => (
                <div key={index} className="w-full">
                  <h3 className="mb-3 text-sm font-semibold tracking-wider text-[#6F6F6F] dark:text-[#E1E1E1]">{category.title}</h3>
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => {
                      const active = isActive(item.link);
                      return (
                        <button
                          key={itemIndex}
                          onClick={() => handleNavigation(item.link)}
                          className={`flex w-full items-center justify-between rounded-md py-2 px-3 transition-colors duration-200 ${
                            active ? 'bg-gray-100 text-teal-600 dark:bg-gray-800 dark:text-teal-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          } ${item.comingSoon ? 'cursor-default' : 'cursor-pointer'}`}
                          disabled={item.comingSoon}
                        >
                          <div className="flex items-center space-x-3">
                            <Image
                              src={item.src}
                              alt=""
                              width={20}
                              height={20}
                              className={`${active ? 'text-teal-600 dark:text-teal-400' : ''}`}
                            />
                            <span className="text-sm font-medium">{item.text}</span>
                          </div>
                          {item.comingSoon && (
                            <span className="text-xs font-semibold text-teal-500 dark:text-teal-400">
                              Coming Soon
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {index < categories.length - 1 && (
                    <div className="my-4 h-px bg-[#D9D9D9] dark:bg-[#131620]"></div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
};

export default MobileNavbar;