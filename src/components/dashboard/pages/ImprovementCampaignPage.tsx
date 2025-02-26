import React from 'react';
import { Newspaper, Heart, AlertTriangle, Building2, GraduationCap as Graduation, Users, AlertOctagon, Briefcase, HelpCircle, FileText, ChevronLeft, Vote } from 'lucide-react';

const unionServices = [
  {
    id: 'news',
    title: 'اخبار و بخش‌نامه‌ها',
    description: 'آخرین اخبار و اطلاعیه‌های صنفی',
    icon: <Newspaper className="h-8 w-8 text-blue-500" />,
    color: 'bg-blue-100 dark:bg-blue-900/20',
    link: '/news'
  },
  {
    id: 'welfare',
    title: 'خدمات رفاهی',
    description: 'تسهیلات و خدمات ویژه اعضای صنف',
    icon: <Heart className="h-8 w-8 text-pink-500" />,
    color: 'bg-pink-100 dark:bg-pink-900/20',
    link: '/welfare'
  },
  {
    id: 'interference',
    title: 'گزارش تداخل صنفی',
    description: 'ثبت و پیگیری تداخلات صنفی',
    icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
    color: 'bg-yellow-100 dark:bg-yellow-900/20',
    link: '/interference'
  },
  {
    id: 'cooperative',
    title: 'فعالیت شرکت تعاونی',
    description: 'گزارش عملکرد و خدمات تعاونی',
    icon: <Building2 className="h-8 w-8 text-purple-500" />,
    color: 'bg-purple-100 dark:bg-purple-900/20',
    link: '/cooperative'
  },
  {
    id: 'education',
    title: 'آموزش‌های آنلاین',
    description: 'دوره‌های آموزشی تخصصی',
    icon: <Graduation className="h-8 w-8 text-green-500" />,
    color: 'bg-green-100 dark:bg-green-900/20',
    link: '/education'
  },
  {
    id: 'interviews',
    title: 'مصاحبه با نخبگان صنف',
    description: 'گفتگو با پیشکسوتان و متخصصان',
    icon: <Users className="h-8 w-8 text-indigo-500" />,
    color: 'bg-indigo-100 dark:bg-indigo-900/20',
    link: '/interviews'
  },
  {
    id: 'stolen',
    title: 'اشیاء مسروقه',
    description: 'اشیاء مسروقه',
    icon: <AlertOctagon className="h-8 w-8 text-red-500" />,
    color: 'bg-red-100 dark:bg-red-900/20',
    link: '/stolen'
  },
  {
    id: 'jobs',
    title: 'فرصت های شغلی',
    description: 'پیگیری جذب نیرو',
    icon: <Briefcase className="h-8 w-8 text-teal-500" />,
    color: 'bg-teal-100 dark:bg-teal-900/20',
    link: '/jobs'
  },
  {
    id: 'consulting',
    title: 'مشاوره‌های صنفی',
    description: 'بیمه، اداره کار، مالیات و پروژه',
    icon: <HelpCircle className="h-8 w-8 text-orange-500" />,
    color: 'bg-orange-100 dark:bg-orange-900/20',
    link: '/consulting'
  }
];

export function ImprovementCampaignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      {/* هدر */}
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Vote className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">سامانه پویش</h1>
                <p className="text-gray-500 dark:text-gray-400">سامانه جامع خدمات صنفی</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                <FileText className="h-5 w-5" />
                <span>راهنمای سامانه</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* محتوای اصلی */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* خدمات صنفی */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unionServices.map(service => (
            <div 
              key={service.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className={`${service.color} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {service.description}
                  </p>
                </div>
                <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* فوتر */}
        <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            © ۱۴۰۳ سامانه پویش خدمات صنفی. تمامی حقوق محفوظ است.
          </p>
        </footer>
      </div>
    </div>
  );
}