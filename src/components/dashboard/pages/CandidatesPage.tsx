import React, { useState, useMemo, useCallback } from 'react';
import { PlusCircle, Edit, Trash, CheckCircle, XCircle, ChevronRight, Search, Filter, UserPlus } from 'lucide-react';
import { mockCandidates } from '../../../data/mockData';
import { CandidateForm } from '../../candidates/CandidateForm';
import { CandidateProfile } from '../../candidates/CandidateProfile';
import { CandidateMedia } from '../../../types';
import { useInView } from 'react-intersection-observer';
import { PageHeader } from '../../common/PageHeader';
import toast from 'react-hot-toast';

export function CandidatesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(candidate => {
      const matchesSearch = searchQuery === '' ||
        candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.business_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterStatus === 'all' ? true :
        filterStatus === 'approved' ? candidate.approved :
        !candidate.approved;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStatus]);

  const handleAdd = useCallback((data: any) => {
    console.log('Add candidate:', data);
    setShowAddForm(false);
    toast.success('کاندیدای جدید با موفقیت اضافه شد');
  }, []);

  const handleEdit = useCallback((data: any) => {
    console.log('Edit candidate:', data);
    setEditingCandidate(null);
    toast.success('اطلاعات کاندیدا با موفقیت بروزرسانی شد');
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log('Delete candidate:', id);
    toast.success('کاندیدا با موفقیت حذف شد');
  }, []);

  const handleApprove = useCallback((id: string) => {
    console.log('Approve candidate:', id);
    toast.success('کاندیدا با موفقیت تایید شد');
  }, []);

  const handleAddMedia = useCallback((candidateId: string, media: Partial<CandidateMedia>) => {
    console.log('Add media for candidate:', candidateId, media);
    toast.success('رسانه جدید با موفقیت اضافه شد');
  }, []);

  if (selectedCandidate) {
    const candidate = mockCandidates.find(c => c.id === selectedCandidate);
    if (!candidate) return null;

    return (
      <div>
        <button
          onClick={() => setSelectedCandidate(null)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronRight className="h-5 w-5 ml-1" />
          <span>بازگشت به لیست کاندیداها</span>
        </button>
        <CandidateProfile
          candidate={candidate}
          isCurrentCandidate={true}
          onAddMedia={(media) => handleAddMedia(candidate.id, media)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="نامزدهای انتخابات"
        description="مشاهده و مدیریت نامزدهای انتخاباتی و برنامه‌های آنها"
        icon={UserPlus}
        gradient="from-rose-600 to-pink-600"
        image="https://source.unsplash.com/featured/400x400?candidate"
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در کاندیداها..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-gray-900 dark:text-white"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="w-full sm:w-auto flex items-center space-x-4 space-x-reverse">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-gray-900 dark:text-white"
            >
              <option value="all">همه کاندیداها</option>
              <option value="approved">تایید شده</option>
              <option value="pending">در انتظار تایید</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>افزودن کاندیدا</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={ref}>
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className={`bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden transform transition-all duration-300 ${
              inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <img
                  src={candidate.avatar_url}
                  alt={candidate.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 
                    className="text-lg font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-800 dark:hover:text-blue-300"
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    {candidate.full_name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.business_name}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{candidate.bio}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  candidate.approved
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {candidate.approved ? 'تایید شده' : 'در انتظار تایید'}
                </span>

                <div className="flex space-x-2 space-x-reverse">
                  <button
                    onClick={() => setEditingCandidate(candidate)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(candidate.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                  {!candidate.approved && (
                    <button
                      onClick={() => handleApprove(candidate.id)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <CandidateForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAdd}
        />
      )}

      {editingCandidate && (
        <CandidateForm
          candidate={editingCandidate}
          onClose={() => setEditingCandidate(null)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}