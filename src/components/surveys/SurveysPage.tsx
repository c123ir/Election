import React, { useState } from 'react';
import { SurveyList } from './SurveyList';
import { AddSurveyForm } from './AddSurveyForm';
import { BusinessCategory } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { BarChart } from 'lucide-react';
import toast from 'react-hot-toast';

export function SurveysPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddSurvey = (data: {
    title: string;
    description: string;
    business_category: BusinessCategory;
    options: string[];
    end_date: string;
  }) => {
    console.log('New survey:', data);
    setShowAddForm(false);
    toast.success('نظرسنجی با موفقیت ایجاد شد');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="نظرسنجی‌های صنفی"
        description="مشارکت در نظرسنجی‌ها برای بهبود خدمات و تصمیم‌گیری‌های صنفی"
        icon={BarChart}
        gradient="from-purple-600 to-blue-600"
        image="https://source.unsplash.com/featured/400x400?survey"
      />

      <SurveyList onAddSurvey={() => setShowAddForm(true)} />

      {showAddForm && (
        <AddSurveyForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddSurvey}
        />
      )}
    </div>
  );
}