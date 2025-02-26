import React, { useState } from 'react';
import { Send, MessageSquare, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { format } from 'date-fns-jalali';
import { PageHeader } from '../../common/PageHeader';
import toast from 'react-hot-toast';

interface Feedback {
  id: string;
  title: string;
  content: string;
  created_at: string;
  status: 'pending' | 'in_progress' | 'completed';
  response?: string;
  likes: number;
  dislikes: number;
}

const sampleFeedbacks: Feedback[] = [
  {
    id: '1',
    title: 'پیشنهاد بهبود رابط کاربری',
    content: 'لطفاً امکان شخصی‌سازی رنگ‌های رابط کاربری را اضافه کنید',
    created_at: new Date().toISOString(),
    status: 'in_progress',
    response: 'در حال بررسی و پیاده‌سازی این قابلیت هستیم',
    likes: 12,
    dislikes: 2
  },
  {
    id: '2',
    title: 'درخواست قابلیت جدید',
    content: 'امکان گزارش‌گیری به صورت PDF اضافه شود',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
    likes: 8,
    dislikes: 1
  }
];

export function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(sampleFeedbacks);
  const [newFeedback, setNewFeedback] = useState({ title: '', content: '' });
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.title || !newFeedback.content) {
      toast.error('لطفاً عنوان و متن پیشنهاد را وارد کنید');
      return;
    }

    const feedback: Feedback = {
      id: Date.now().toString(),
      ...newFeedback,
      created_at: new Date().toISOString(),
      status: 'pending',
      likes: 0,
      dislikes: 0
    };

    setFeedbacks([feedback, ...feedbacks]);
    setNewFeedback({ title: '', content: '' });
    toast.success('پیشنهاد شما با موفقیت ثبت شد');
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };

  const getStatusText = (status: Feedback['status']) => {
    switch (status) {
      case 'pending':
        return 'در انتظار بررسی';
      case 'in_progress':
        return 'در حال بررسی';
      case 'completed':
        return 'انجام شده';
    }
  };

  const filteredFeedbacks = feedbacks.filter(
    feedback => filter === 'all' || feedback.status === filter
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="نظرات و پیشنهادات"
        description="ارسال نظرات و پیشنهادات برای بهبود سیستم"
        icon={MessageSquare}
        gradient="from-violet-600 to-purple-600"
        image="https://source.unsplash.com/featured/400x400?feedback"
      />

      {/* فرم ارسال پیشنهاد */}
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium mb-4">ارسال پیشنهاد جدید</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={newFeedback.title}
              onChange={(e) => setNewFeedback({ ...newFeedback, title: e.target.value })}
              placeholder="عنوان پیشنهاد"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-hover"
            />
          </div>
          <div>
            <textarea
              value={newFeedback.content}
              onChange={(e) => setNewFeedback({ ...newFeedback, content: e.target.value })}
              placeholder="متن پیشنهاد خود را بنویسید..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-dark-hover"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Send className="h-5 w-5" />
              <span>ارسال پیشنهاد</span>
            </button>
          </div>
        </form>
      </div>

      {/* فیلتر وضعیت */}
      <div className="flex space-x-2 space-x-reverse">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'
          }`}
        >
          همه
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'pending'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'
          }`}
        >
          در انتظار بررسی
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'in_progress'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'
          }`}
        >
          در حال بررسی
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'completed'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'
          }`}
        >
          انجام شده
        </button>
      </div>

      {/* لیست پیشنهادات */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{feedback.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{feedback.content}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(feedback.status)}`}>
                {getStatusText(feedback.status)}
              </span>
            </div>

            {feedback.response && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-purple-800 dark:text-purple-200">{feedback.response}</p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4 space-x-reverse">
                <button className="flex items-center space-x-1 space-x-reverse hover:text-blue-500">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{feedback.likes}</span>
                </button>
                <button className="flex items-center space-x-1 space-x-reverse hover:text-red-500">
                  <ThumbsDown className="h-4 w-4" />
                  <span>{feedback.dislikes}</span>
                </button>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 ml-1" />
                <span>{format(new Date(feedback.created_at), 'yyyy/MM/dd HH:mm')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}