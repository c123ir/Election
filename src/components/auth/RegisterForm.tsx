// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../store/auth';
import { BUSINESS_CATEGORIES, BusinessCategory } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();
  const [formData, setFormData] = useState({
    phone: '',
    full_name: '',
    business_category: '' as BusinessCategory,
    business_name: '',
    logo_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.full_name || !formData.business_category || !formData.business_name) {
      toast.error('لطفا همه فیلدهای ضروری را پر کنید');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">ثبت‌نام در سامانه</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
            نام و نام خانوادگی
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="مثال: علی محمدی"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            شماره موبایل
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
          />
        </div>

        <div>
          <label htmlFor="business_category" className="block text-sm font-medium text-gray-700 mb-2">
            رسته صنفی
          </label>
          <select
            id="business_category"
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
          <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-2">
            نام برند صنفی
          </label>
          <input
            type="text"
            id="business_name"
            value={formData.business_name}
            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="مثال: فروشگاه کامپیوتر پارس"
          />
        </div>

        <div>
          <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-2">
            آدرس تصویر لوگو
          </label>
          <div className="flex">
            <input
              type="url"
              id="logo_url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/logo.jpg"
              dir="ltr"
            />
            <div className="px-4 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
              <Upload className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            لطفا آدرس اینترنتی تصویر لوگو یا عکس مدیر را وارد کنید
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
        </button>
      </form>
    </div>
  );
}