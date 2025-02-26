// src/components/voting/VoteResults.tsx
import React from 'react';
import { useVoteStore } from '../../store/vote';
import { mockCandidates } from '../../data/mockData';
import { Award } from 'lucide-react';
import { format } from 'date-fns-jalali';

export function VoteResults() {
  const results = useVoteStore(state => state.getResults());
  const totalVotes = results.reduce((sum, result) => sum + result.votes, 0);
  
  // مرتب‌سازی نتایج بر اساس تعداد آرا (نزولی)
  const sortedResults = results
    .map(result => ({
      ...result,
      candidate: mockCandidates.find(c => c.id === result.candidateId)!
    }))
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">نتایج آنلاین</h2>
        <div className="text-sm text-gray-500">
          مجموع آرا: {totalVotes.toLocaleString('fa-IR')}
        </div>
      </div>

      <div className="space-y-6">
        {sortedResults.map((result, index) => (
          <div key={result.candidateId} className="relative">
            {index === 0 && (
              <div className="absolute -right-4 -top-4 bg-yellow-400 rounded-full p-2">
                <Award className="h-6 w-6 text-white" />
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <img
                  src={result.candidate.avatar_url}
                  alt={result.candidate.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="mr-3">
                  <h3 className="font-medium">{result.candidate.full_name}</h3>
                  <div className="text-sm text-gray-500">
                    {result.votes.toLocaleString('fa-IR')} رای
                    ({Math.round((result.votes / totalVotes) * 100)}٪)
                  </div>
                </div>
              </div>
              
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${(result.votes / totalVotes) * 100}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      index === 0 ? 'bg-yellow-400' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}