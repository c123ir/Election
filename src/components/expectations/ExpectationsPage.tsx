import React, { useState } from 'react';
import { ExpectationsList } from './ExpectationsList';
import { AddExpectationForm } from './AddExpectationForm';
import { BusinessCategory } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { ListChecks } from 'lucide-react';
import toast from 'react-hot-toast';

export function ExpectationsPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddExpectation = (data: {
    title: string;
    description: string;
    business_category: BusinessCategory;
  }) => {
    console.log('New expectation:', data);
    setShowAddForm(false);
    toast.success('انتظار شما با موفقیت ثبت شد');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="انتظارات اعضا از اتحادیه"
        description="ثبت و پیگیری انتظارات و پیشنهادات اعضای صنف برای بهبود خدمات"
        icon={ListChecks}
        gradient="from-green-600 to-emerald-600"
        image="https://source.unsplash.com/featured/400x400?checklist"
      />

      <ExpectationsList onAddExpectation={() => setShowAddForm(true)} />

      {showAddForm && (
        <AddExpectationForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddExpectation}
        />
      )}
    </div>
  );
}