// src/components/dashboard/pages/SurveysPage.tsx
import React, { useState } from 'react';
import { SurveyList } from '../../surveys/SurveyList';
import { AddSurveyForm } from '../../surveys/AddSurveyForm';
import { BusinessCategory } from '../../../types';
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">نظرسنجی‌ها</h2>
      </div>

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