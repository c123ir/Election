import React from 'react';
import { Candidate } from '../../types';
import { CandidateGallery } from './CandidateGallery';
import { ChevronDown } from 'lucide-react';

interface CandidateProfileProps {
  candidate: Candidate;
  isCurrentCandidate?: boolean;
  onAddMedia?: (media: any) => void;
}

export function CandidateProfile({ candidate, isCurrentCandidate, onAddMedia }: CandidateProfileProps) {
  return (
    <div className="space-y-8">
      {/* اطلاعات اصلی کاندیدا */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start space-x-6 space-x-reverse">
          <img
            src={candidate.avatar_url}
            alt={candidate.full_name}
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{candidate.full_name}</h2>
            <p className="text-gray-600 mt-2">{candidate.business_name}</p>
            <div className="mt-4">
              <h3 className="font-medium text-gray-900">بیوگرافی:</h3>
              <p className="mt-1 text-gray-600">{candidate.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* برنامه‌ها */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">برنامه‌ها و اهداف</h3>
        <div className="space-y-3">
          {candidate.proposals?.map((proposal, index) => (
            <div key={index} className="flex items-center text-gray-700">
              <ChevronDown className="h-5 w-5 ml-2 text-blue-500" />
              <span>{proposal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* گالری */}
      <CandidateGallery
        candidate={candidate}
        isCurrentCandidate={isCurrentCandidate}
        onAddMedia={onAddMedia}
      />
    </div>
  );
}