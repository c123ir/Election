// src/components/voting/VoteConfirmation.tsx
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Candidate } from '../../types';

interface VoteConfirmationProps {
  candidate: Candidate;
  onConfirm: () => void;
  onCancel: () => void;
}

export function VoteConfirmation({ candidate, onConfirm, onCancel }: VoteConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">تایید رای</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          
          <p className="text-center text-gray-700 mb-6">
            آیا مطمئن هستید که می‌خواهید به
            <span className="font-bold mx-1">{candidate.full_name}</span>
            رای دهید؟
          </p>
          
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4 mb-6">
            <p>توجه:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>رای شما پس از تایید قابل تغییر نخواهد بود</li>
              <li>هر فرد تنها یک بار می‌تواند رای دهد</li>
              <li>رای شما به صورت محرمانه ثبت خواهد شد</li>
            </ul>
          </div>
          
          <div className="flex justify-end space-x-2 space-x-reverse">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              تایید و ثبت رای
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}