import React from 'react';
import { Code, Cpu, Database, Globe, Award, Lightbulb, CheckCircle, ArrowRight, Rocket, Monitor, Users, MessageSquare, Star, Briefcase, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProgrammerProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* هدر و معرفی */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 md:space-x-reverse">
          <img
            src="https://s33.picofile.com/file/8483051384/my_piccc.png"
            alt="مجتبی حسنی"
            className="w-48 h-48 rounded-full border-4 border-white shadow-lg"
          />
          <div className="text-center md:text-right">
            <h1 className="text-3xl font-bold mb-4">مجتبی حسنی</h1>
            <p className="text-xl opacity-90">کارآفرین حوزه فناوری اطلاعات</p>
            <div className="mt-6 text-2xl font-bold">
              رویکردی تخصصی - تحولی نوین - اتحادیه‌ای پویا
            </div>
          </div>
        </div>
      </div>

      {/* رزومه و سوابق */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Briefcase className="h-6 w-6 ml-2 text-blue-600 dark:text-blue-400" />
          سوابق و تجربیات
        </h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">بیش از ۲۵ سال سابقه و تخصص در حوزه فناوری اطلاعات</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">تجربه گسترده در زمینه مدیریت و توسعه سیستم‌های نرم‌افزاری</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <Monitor className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">مدیر و موسس مجتمع کامپیوتر یک دو سه</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">ارائه خدمات تخصصی کامپیوتری و مشاوره فناوری اطلاعات</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">بازرس سابق هیئت مدیره اتحادیه صنف</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">نظارت و بهبود عملکرد اتحادیه در دوره مسئولیت</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg">
              <Code className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">طراح و برنامه‌نویس اتوماسیون‌های مدیریتی و حسابداری</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">توسعه سیستم‌های یکپارچه برای بهبود فرآیندهای کسب و کار</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">
              <Globe className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">مشاور و مجری راه‌کارهای نوین و استقرار سیستم‌های مدیریتی از راه دور</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">ارائه راهکارهای هوشمند برای مدیریت کسب و کارها</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 space-x-reverse">
            <div className="bg-indigo-100 dark:bg-indigo-900/20 p-3 rounded-lg">
              <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">سرمایه‌گذار و حامی استعدادهای نوین و استارت‌آپ‌های دانش‌بنیان</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">حمایت از ایده‌های نوآورانه و کارآفرینان جوان</p>
            </div>
          </div>
        </div>
      </div>

      {/* سامانه انتخابات */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Rocket className="h-6 w-6 ml-2 text-blue-600 dark:text-blue-400" />
          دستاورد ویژه: سامانه جامع انتخابات اتحادیه‌های صنفی
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              این سامانه که به برکت همین انتخابات طراحی و پیاده‌سازی شد، مورد استقبال و تایید جناب آقای ربیعی، ریاست محترم اطاق اصناف قرار گرفت. ایشان پس از مشاهده نسخه دمو، دستور ابلاغ این طرح به تمامی اتحادیه‌های کشور را صادر کردند.
            </p>
            <div className="bg-white dark:bg-dark-hover rounded-lg p-4 mb-4">
              <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-2">مزایای طرح:</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  <span>برگزاری انتخابات به صورت شفاف و عادلانه</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  <span>کاهش هزینه‌های برگزاری انتخابات</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  <span>افزایش مشارکت اعضا با دسترسی آسان</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
                  <span>قابلیت استفاده توسط تمام اتحادیه‌های کشور</span>
                </li>
              </ul>
            </div>
            <p className="text-green-700 dark:text-green-400 font-medium">
              این طرح را به عنوان هدیه‌ای به اتحادیه صنف خودمان تقدیم می‌کنم و تمامی درآمدهای حاصل از آن را متعلق به اعضای صنف می‌دانم. این درآمدها کاملاً قانونی و قابل وصول هستند و می‌توانند در قالب شرکت تعاونی اتحادیه، با عضویت تمامی اعضا از رسته‌های مختلف، مدیریت شوند.
            </p>
          </div>
        </div>
      </div>

      {/* باکس ارسال نظرات و پیشنهادات */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-center transform hover:scale-105 transition-all duration-300">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">نظرات و پیشنهادات شما</h2>
          <p className="text-white/90 text-lg mb-6">
            نظرات و پیشنهادات شما برای بهبود سیستم بسیار ارزشمند است. با کلیک روی دکمه زیر می‌توانید نظرات خود را با ما در میان بگذارید.
          </p>
          <button
            onClick={() => navigate('/dashboard/feedback')}
            className="inline-flex items-center px-8 py-3 bg-white text-purple-600 rounded-full hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <MessageSquare className="h-5 w-5 ml-2" />
            <span>ارسال نظرات و پیشنهادات</span>
          </button>
        </div>
      </div>
    </div>
  );
}