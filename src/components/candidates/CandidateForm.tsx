// src/components/candidates/CandidateForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Candidate } from '../../types';
import toast from 'react-hot-toast';

interface CandidateFormProps {
  candidate?: Candidate;
  onClose: () => void;
  onSubmit: (data: Partial<Candidate>) => void;
}

export function CandidateForm({ candidate, onClose, onSubmit }: CandidateFormProps) {
  const [formData, setFormData] = useState({
    full_name: candidate?.full_name || '',
    phone: candidate?.phone || '',
    bio: candidate?.bio || '',
    proposals: candidate?.proposals?.join('\n') || '',
    avatar_url: candidate?.avatar_url || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.phone) {
      toast.error('لطفا نام و شماره تماس را وارد کنید');
      return;
    }

    onSubmit({
      ...formData,
      proposals: formData.proposals.split('\n').filter(p => p.trim()),
      role: 'candidate'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {candidate ? 'ویرایش کاندیدا' : 'افزودن کاندیدای جدید'}
          </h2>
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
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: علی محمدی"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شماره تماس
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آدرس تصویر پروفایل
            </label>
            <input
              type="url"
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              بیوگرافی
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="توضیح مختصری درباره سوابق و تجربیات..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              برنامه‌ها (هر برنامه در یک خط)
            </label>
            <textarea
              value={formData.proposals}
              onChange={(e) => setFormData({ ...formData, proposals: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              placeholder="برنامه اول&#10;برنامه دوم&#10;برنامه سوم"
            />
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {candidate ? 'ویرایش' : 'افزودن'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}