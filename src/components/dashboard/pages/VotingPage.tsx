import React from 'react';
import { CandidateList } from '../candidates/CandidateList';
import { VoteResults } from '../../voting/VoteResults';
import { PageHeader } from '../../common/PageHeader';
import { Vote } from 'lucide-react';

interface VotingPageProps {
  onVoteClick: (candidateId: string) => void;
  userVote: string | null;
  voteLoading: boolean;
}

export function VotingPage({ onVoteClick, userVote, voteLoading }: VotingPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title="رای‌گیری آزمایشی"
        description="آشنایی با سیستم رای‌گیری الکترونیکی و نحوه مشارکت در انتخابات"
        icon={Vote}
        gradient="from-violet-600 to-purple-600"
        image="https://source.unsplash.com/featured/400x400?vote"
      />

      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-8 rounded-lg text-center">
        <p className="text-lg text-yellow-800 dark:text-yellow-200">
          این بخش صرفاً جهت آشنایی با نحوه رای‌گیری الکترونیکی طراحی شده است و رای‌های ثبت شده در آن فاقد اعتبار قانونی می‌باشند.
        </p>
      </div>

      <VoteResults />

      <CandidateList
        onVoteClick={onVoteClick}
        userVote={userVote}
        voteLoading={voteLoading}
      />
    </div>
  );
}