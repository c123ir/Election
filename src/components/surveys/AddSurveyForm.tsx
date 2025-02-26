// src/components/surveys/AddSurveyForm.tsx
import React, { useState } from 'react';
import { X, Plus, Trash, AlertCircle } from 'lucide-react';
import { BusinessCategory, BUSINESS_CATEGORIES } from '../../types';
import { format, addDays } from 'date-fns-jalali';
import toast from 'react-hot-toast';

interface AddSurveyFormProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    business_category: BusinessCategory;
    options: string[];
    end_date: string;
  }) => void;
}

export function AddSurveyForm({ onClose, onSubmit }: AddSurveyFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    business_category: '' as BusinessCategory,
    options: ['', ''],
    end_date: format(addDays(new Date(), 7), 'yyyy-MM-dd') // پیش‌فرض یک هفته
  });

  const handleAddOption = () => {
    if (formData.options.length >= 6) {
      toast.error('حداکثر ۶ گزینه می‌توانید اضافه کنید');
      return;
    }
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) {
      toast.error('حداقل دو گزینه باید وجود داشته باشد');
      return;
    }
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index)
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.business_category || !formData.end_date) {
      toast.error('لطفاً همه فیلدهای ضروری را پر کنید');
      return;
    }

    if (formData.options.some(option => !option.trim())) {
      toast.error('لطفاً همه گزینه‌ها را پر کنید');
      return;
    }

    // بررسی تاریخ پایان
    const endDate = new Date(formData.end_date);
    const today = new Date();
    if (endDate <= today) {
      toast.error('تاریخ پایان باید بعد از امروز باشد');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">ایجاد نظرسنجی جدید</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رسته صنفی
            </label>
            <select
              value={formData.business_category}
              onChange={(e) => setFormData({ ...formData, business_category: e.target.value as BusinessCategory })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">انتخاب کنید</option>
              {Object.entries(BUSINESS_CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان نظرسنجی
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: نظرسنجی درباره برگزاری دوره‌های آموزشی"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="توضیحات نظرسنجی را وارد کنید..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                گزینه‌ها
              </label>
              <span className="text-sm text-gray-500">
                {formData.options.length} از ۶
              </span>
            </div>
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 space-x-reverse">
                  <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`گزینه ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-red-500 hover:text-red-600 rounded-full hover:bg-red-50"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              disabled={formData.options.length >= 6}
              className="mt-2 flex items-center space-x-2 space-x-reverse text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              <span>افزودن گزینه</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ پایان
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 ml-2" />
              <div className="text-sm text-yellow-700">
                <h6 className="font-medium mb-1">نکات مهم:</h6>
                <ul className="list-disc list-inside space-y-1">
                  <li>حداقل دو و حداکثر شش گزینه می‌توانید تعریف کنید</li>
                  <li>پس از شروع نظرسنجی امکان ویرایش گزینه‌ها وجود ندارد</li>
                  <li>تاریخ پایان باید حداقل یک روز بعد از امروز باشد</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              ایجاد نظرسنجی
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}