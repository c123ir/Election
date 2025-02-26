import React, { memo } from 'react';
import { BarChart3, UserCheck, Award, AlertTriangle, Vote, Users, ListChecks, MessageSquare, Vote as HowToVote, Monitor, Info, Globe, TicketCheck } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns-jalali';

const ELECTION_DATE = new Date('2025-03-01T05:00:00.000Z'); // ۱۱ اسفند ۱۴۰۳ ساعت ۸:۳۰

interface HomePageProps {
  onPageChange?: (page: string) => void;
}

// تعریف بخش‌های اصلی صفحه
const mainSections = [
  {
    id: 'improvement',
    title: 'پویش خدمات اتحادیه',
    description: 'دسترسی به خدمات جامع اتحادیه',
    icon: Globe,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  {
    id: 'cafe',
    title: 'مدیریت کافی‌نت',
    description: 'سیستم مدیریت یکپارچه کافی‌نت',
    icon: Monitor,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  {
    id: 'candidates',
    title: 'نامزدهای انتخاباتی',
    description: 'مشاهده لیست کاندیداها و برنامه‌های آنها',
    icon: Vote,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  },
  {
    id: 'communication',
    title: 'تالار گفتگوی انتخاباتی',
    description: 'گفتگو با کاندیداها و اعضای صنف',
    icon: MessageSquare,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
  },
  {
    id: 'expectations',
    title: 'انتظارات اعضا',
    description: 'ثبت و پیگیری انتظارات اعضای صنف',
    icon: ListChecks,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
  },
  {
    id: 'surveys',
    title: 'نظرسنجی‌ها',
    description: 'شرکت در نظرسنجی‌های صنفی',
    icon: BarChart3,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20'
  },
  {
    id: 'voting',
    title: 'رای‌گیری آزمایشی',
    description: 'آشنایی با سیستم رای‌گیری الکترونیکی',
    icon: HowToVote,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20'
  },
  {
    id: 'reports',
    title: 'گزارشات',
    description: 'مشاهده آمار و گزارش‌های انتخابات',
    icon: BarChart3,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-100 dark:bg-teal-900/20'
  },
  {
    id: 'about',
    title: 'درباره سیستم',
    description: 'آشنایی با امکانات و قابلیت‌های سامانه',
    icon: Info,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/20'
  },
  {
    id: 'feedback',
    title: 'نظرات و پیشنهادات',
    description: 'ارسال نظر و پیشنهاد به برنامه‌نویس سیستم',
    icon: TicketCheck,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-100 dark:bg-rose-900/20'
  }
];

// Memoize the HomePage component for better performance
export const HomePage = memo(({ onPageChange }: HomePageProps) => {
  const timeRemaining = formatDistanceToNow(ELECTION_DATE, { addSuffix: true });
  const currentDate = format(new Date(), 'yyyy/MM/dd');

  const handleSectionClick = (sectionId: string) => {
    if (onPageChange) {
      onPageChange(sectionId);
    }
  };

  return (
    <div className="space-y-8">
      {/* هشدار مهم */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
          </div>
          <div className="mr-3">
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">
              هشدار مهم درباره انتخابات
            </h3>
            <div className="mt-2 text-yellow-700 dark:text-yellow-200">
              <p>
                با توجه به عدم به حد نصاب رسیدن انتخابات در دوره اول، این دوره از اهمیت ویژه‌ای برخوردار است.
                در صورت عدم مشارکت کافی در این دوره، طبق قوانین موجود، صنف ما با یک صنف دیگر ادغام خواهد شد.
              </p>
              <p className="mt-2 font-medium">
                از همه اعضای محترم صنف درخواست می‌شود با مشارکت حداکثری خود، از حقوق صنفی خود دفاع کنند.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* شعار صنفی */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">مشارکت ما، ضامن پویایی صنف ماست</h2>
        <p className="text-lg opacity-90">
          با رای دادن به کاندیدای اصلح، در ساختن آینده‌ای بهتر برای صنف خود سهیم باشیم
        </p>
        <div className="mt-6 text-xl font-bold">
          زمان باقیمانده تا انتخابات: {timeRemaining}
        </div>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">تعداد کل آرا</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">۱۲۳۴</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6 transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400">کاندیداهای تایید شده</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">۱۲</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* بخش‌های اصلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainSections.map(section => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer group text-right w-full"
            >
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className={`${section.bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-8 w-8 ${section.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {section.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

HomePage.displayName = 'HomePage';