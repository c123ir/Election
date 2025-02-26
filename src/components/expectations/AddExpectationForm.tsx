import React, { useState } from 'react';
import { X, Tag } from 'lucide-react';
import { BusinessCategory, BUSINESS_CATEGORIES } from '../../types';
import toast from 'react-hot-toast';

interface AddExpectationFormProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    business_category: BusinessCategory;
  }) => void;
}

export function AddExpectationForm({ onClose, onSubmit }: AddExpectationFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    business_category: '' as BusinessCategory
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.business_category) {
      toast.error('لطفاً همه فیلدهای ضروری را پر کنید');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">ثبت انتظار جدید</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              رسته صنفی
            </label>
            <div className="relative">
              <select
                value={formData.business_category}
                onChange={(e) => setFormData({ ...formData, business_category: e.target.value as BusinessCategory })}
                className="w-full pl-4 pr-10 py-2 bg-white dark:bg-dark-hover border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">انتخاب کنید</option>
                {Object.entries(BUSINESS_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
              <Tag className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان انتظار
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-dark-hover border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: برگزاری دوره‌های آموزشی تخصصی"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-dark-hover border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="جزئیات انتظار خود را شرح دهید..."
            />
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors"
            >
              ثبت انتظار
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}