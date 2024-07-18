import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

type SidebarItem = {
  src: string;
  text: string;
  link: string;
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

const Sidebar = ({ isOpen, isMobile }: { isOpen: boolean; isMobile: boolean }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [subscribedExams, setSubscribedExams] = useState<SidebarItem[]>([]);

  const staticCategories: Category[] = [
    {
      title: '',
      items: [{ src: '/icons/sidebar/home-icon.svg', text: 'Home', link: '/' }],
    },
    {
      title: 'You',
      items: [
        { src: '/icons/sidebar/book-icon.svg', text: 'Resources', link: '/resources' },
        { src: '/icons/sidebar/save-icon.svg', text: 'Saved', link: '/saved' },
      ],
    },
  ];

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

  const isActive = (itemLink: string) => pathname === itemLink;

  const handleNavigation = (link: string) => {
    router.push(link);
  };

  const categories: Category[] = [
    ...staticCategories,
    {
      title: 'Subscribed Exams',
      items: subscribedExams,
    },
  ];

  return (
    <div
      className={`transform bg-white text-[#6F6F6F] dark:bg-[#00090B] dark:text-[#E1E1E1] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed left-0 z-40 h-full w-64 border-r-2 border-[#ECECEC] transition-transform duration-300 dark:border-[#051013] ${
        isMobile ? 'top-10' : 'top-16'
      }`}
    >
      <div className="p-4 h-full overflow-y-auto">
        <nav className="flex flex-col space-y-6">
          {categories.map((category, index) => (
            <div key={index} className="w-full">
              <h3 className="mb-3 text-sm font-semibold tracking-wider">{category.title}</h3>
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => {
                  const active = isActive(item.link);
                  return (
                    <button
                      key={itemIndex}
                      onClick={() => handleNavigation(item.link)}
                      className={`flex w-full items-center space-x-3 rounded-md py-2 px-3 transition-colors duration-200 ${
                        active ? 'bg-gray-100 text-teal-600 dark:bg-gray-800 dark:text-teal-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt=""
                        width={20}
                        height={20}
                        className={`${active ? 'text-teal-600 dark:text-teal-400' : ''}`}
                      />
                      <span className="text-sm font-medium">{item.text}</span>
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
  );
};

export default Sidebar;