import React from 'react';
import { ChevronDown } from 'lucide-react';
import { mockCandidates } from '../../../data/mockData';

interface CandidateListProps {
  onVoteClick: (candidateId: string) => void;
  userVote: string | null;
  voteLoading: boolean;
}

export function CandidateList({ onVoteClick, userVote, voteLoading }: CandidateListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold">لیست کاندیداها</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {mockCandidates.map((candidate) => (
          <div key={candidate.id} className="p-6">
            <div className="flex items-start space-x-4 space-x-reverse">
              <img
                src={candidate.avatar_url}
                alt={candidate.full_name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{candidate.full_name}</h3>
                  <button
                    onClick={() => onVoteClick(candidate.id)}
                    disabled={!!userVote || voteLoading}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      userVote === candidate.id
                        ? 'bg-green-500 text-white'
                        : userVote
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {userVote === candidate.id ? 'رای داده شده' : 
                     userVote ? 'قبلاً رای داده‌اید' : 'ثبت رای'}
                  </button>
                </div>
                <p className="text-gray-600 mt-2">{candidate.bio}</p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">برنامه‌ها:</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {candidate.proposals?.map((proposal, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
                          {proposal}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}