import React, { useState } from 'react';
import { useAuthStore } from '../../../store/auth';
import { useVoteStore } from '../../../store/vote';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { HomePage } from './HomePage';
import { MembersPage } from './MembersPage';
import { CandidatesPage } from './CandidatesPage';
import { ExpectationsPage } from './ExpectationsPage';
import { SurveysPage } from './SurveysPage';
import { CommunicationPage } from './CommunicationPage';
import { ReportsPage } from './ReportsPage';
import { ProgrammerProfilePage } from './ProgrammerProfilePage';
import { FeedbackPage } from './FeedbackPage';
import { AboutSystemPage } from './AboutSystemPage';
import { SettingsPage } from './SettingsPage';
import { UserSettingsPage } from './UserSettingsPage';
import { VotingPage } from './VotingPage';
import { CafeManagementPage } from './CafeManagementPage';
import { ImprovementCampaignPage } from './ImprovementCampaignPage';
import { VoteConfirmation } from '../../../components/voting/VoteConfirmation';
import { Candidate } from '../../../types';
import { mockCandidates } from '../../../data/mockData';
import toast from 'react-hot-toast';

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, updateUser } = useAuthStore();
  const { submitVote, userVote, loading: voteLoading } = useVoteStore();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [currentPage, setCurrentPage] = useState(location.state?.page || 'home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleVoteClick = (candidateId: string) => {
    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (!candidate) return;
    
    if (userVote) {
      toast.error('شما قبلاً رای خود را ثبت کرده‌اید');
      return;
    }
    setSelectedCandidate(candidate);
    setShowVoteConfirmation(true);
  };

  const handleVoteConfirm = async () => {
    if (!selectedCandidate) return;
    
    try {
      await submitVote(selectedCandidate.id);
      setShowVoteConfirmation(false);
      toast.success('رای شما با موفقیت ثبت شد');
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('خطا در ثبت رای');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('با موفقیت از سیستم خارج شدید');
  };

  const handleUpdateUserSettings = (settings: Partial<User>) => {
    updateUser(settings);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'improvement':
        return <ImprovementCampaignPage />;
      case 'members':
        return <MembersPage />;
      case 'candidates':
        return <CandidatesPage />;
      case 'voting':
        return <VotingPage onVoteClick={handleVoteClick} userVote={userVote} voteLoading={voteLoading} />;
      case 'expectations':
        return <ExpectationsPage />;
      case 'surveys':
        return <SurveysPage />;
      case 'communication':
        return <CommunicationPage />;
      case 'cafe':
        return <CafeManagementPage />;
      case 'reports':
        return <ReportsPage />;
      case 'about':
        return <AboutSystemPage />;
      case 'programmer':
        return <ProgrammerProfilePage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'settings':
        return user.role === 'admin' ? (
          <SettingsPage />
        ) : (
          <UserSettingsPage user={user} onUpdateSettings={handleUpdateUserSettings} />
        );
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header
          user={user}
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onLogout={handleLogout}
        />
      </div>

      <div className="flex pt-16">
        <div
          className={`fixed lg:static inset-y-16 right-0 transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:translate-x-0 z-30 w-64 bg-white dark:bg-dark-card shadow-lg transition-transform duration-300 ease-in-out h-[calc(100vh-4rem)]`}
        >
          <Sidebar
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        <div className="flex-1">
          <div className="h-full p-4 sm:p-6 lg:p-8">
            {renderPage()}
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {showVoteConfirmation && selectedCandidate && (
        <VoteConfirmation
          candidate={selectedCandidate}
          onConfirm={handleVoteConfirm}
          onCancel={() => setShowVoteConfirmation(false)}
        />
      )}
    </div>
  );
}