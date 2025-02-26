import React, { memo } from 'react';
import { Vote, Users, FileText, Settings, UserPlus, MessageSquare, ListChecks, BarChart3, Code, Vote as HowToVote, Monitor, Info, Globe } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onClose?: () => void;
}

const menuItems = [
  { id: 'home', title: 'صفحه اصلی', icon: Vote },
  { id: 'improvement', title: 'پویش خدمات اتحادیه', icon: Globe },
  { id: 'voting', title: 'رای‌گیری آزمایشی', icon: HowToVote },
  { id: 'members', title: 'مدیریت اعضا', icon: Users },
  { id: 'candidates', title: 'نامزدهای انتخابات', icon: UserPlus },
  { id: 'expectations', title: 'انتظارات اعضا', icon: ListChecks },
  { id: 'surveys', title: 'نظرسنجی‌ها', icon: BarChart3 },
  { id: 'communication', title: 'تالار گفتگو', icon: MessageSquare },
  { id: 'cafe', title: 'مدیریت کافی‌نت', icon: Monitor },
  { id: 'reports', title: 'گزارش‌ها', icon: FileText },
  { id: 'about', title: 'درباره سیستم', icon: Info },
  { id: 'programmer', title: 'درباره برنامه‌نویس', icon: Code },
  { id: 'settings', title: 'تنظیمات', icon: Settings },
];

export const Sidebar = memo(({ currentPage, onPageChange, onClose }: SidebarProps) => {
  const handleItemClick = (itemId: string) => {
    onPageChange(itemId);
    onClose?.();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-card transition-colors duration-200">
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center space-x-4 space-x-reverse w-full px-4 py-3 text-right rounded-md transition-colors ${
                  currentPage === item.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-hover'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';