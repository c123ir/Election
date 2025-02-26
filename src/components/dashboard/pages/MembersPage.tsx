import React, { useState, useMemo } from 'react';
import { User } from '../../../types';
import { mockMembers } from '../../../data/mockData';
import { CheckCircle, XCircle, Search, Filter, Users } from 'lucide-react';
import { format } from 'date-fns-jalali';
import { List, AutoSizer, WindowScroller } from 'react-virtualized';
import { PageHeader } from '../../common/PageHeader';

export function MembersPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredMembers = useMemo(() => {
    return mockMembers.filter(member => {
      const matchesFilter = filter === 'all' ? true :
        filter === 'pending' ? !member.is_approved :
        filter === 'approved' ? member.is_approved :
        member.is_approved === false;

      const matchesSearch = searchQuery === '' ||
        member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.includes(searchQuery);

      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const handleApprove = (userId: string) => {
    console.log('Approve member:', userId);
  };

  const handleReject = (userId: string) => {
    console.log('Reject member:', userId);
  };

  const renderMemberCard = ({ index, key, style }: { index: number, key: string, style: React.CSSProperties }) => {
    const member = filteredMembers[index];
    return (
      <div key={key} style={style} className="px-4">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-4 mb-4">
          <div className="md:flex md:justify-between md:items-start">
            <div className="mb-4 md:mb-0">
              <h3 className="font-medium text-gray-900 dark:text-white">{member.full_name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{member.business_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">{member.phone}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                member.is_approved
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {member.is_approved ? 'تایید شده' : 'در انتظار تایید'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {format(new Date(member.created_at), 'yyyy/MM/dd')}
              </span>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2 space-x-reverse">
            <button
              onClick={() => handleApprove(member.id)}
              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
              title="تایید عضویت"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleReject(member.id)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              title="رد عضویت"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="مدیریت اعضای صنف"
        description="مدیریت و نظارت بر اعضای صنف و درخواست‌های عضویت"
        icon={Users}
        gradient="from-orange-600 to-pink-600"
        image="https://source.unsplash.com/featured/400x400?team"
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-gray-900 dark:text-white"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="w-full sm:w-auto flex items-center space-x-2 space-x-reverse">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-gray-900 dark:text-white"
          >
            <option value="all">همه اعضا</option>
            <option value="pending">در انتظار تایید</option>
            <option value="approved">تایید شده</option>
            <option value="rejected">رد شده</option>
          </select>
        </div>
      </div>

      <div className="min-h-[500px]">
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  autoHeight
                  height={height || 500}
                  width={width}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  rowCount={filteredMembers.length}
                  rowHeight={180}
                  rowRenderer={({ index, key, style }) => renderMemberCard({ index, key, style })}
                  scrollTop={scrollTop}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      </div>
    </div>
  );
}