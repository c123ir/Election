import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Filter,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Calendar,
  User,
  Tag,
  MessageCircle
} from 'lucide-react';
import { Expectation, BusinessCategory, BUSINESS_CATEGORIES } from '../../types';
import { mockExpectations } from '../../data/mockExpectations';
import { mockCandidates, mockMembers } from '../../data/mockData';
import { format } from 'date-fns-jalali';
import toast from 'react-hot-toast';

interface ExpectationsListProps {
  onAddExpectation: () => void;
}

export function ExpectationsList({ onAddExpectation }: ExpectationsListProps) {
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'likes'>('date');
  const [expandedExpectation, setExpandedExpectation] = useState<string | null>(null);
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'responses'>('responses');

  const filteredExpectations = mockExpectations
    .filter(exp => selectedCategory === 'all' || exp.business_category === selectedCategory)
    .filter(exp => 
      exp.title.includes(searchQuery) || 
      exp.description.includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return (b.likes - b.dislikes) - (a.likes - a.dislikes);
    });

  const handleReaction = (expectationId: string, type: 'like' | 'dislike') => {
    toast.success(type === 'like' ? 'لایک شد' : 'دیس‌لایک شد');
  };

  const handleAddComment = (expectationId: string) => {
    if (!newComment.trim()) return;
    toast.success('نظر شما با موفقیت ثبت شد');
    setNewComment('');
  };

  const getCategoryStyle = (category: BusinessCategory) => {
    const styles = {
      computer: 'from-blue-500 to-indigo-500',
      office_equipment: 'from-purple-500 to-pink-500',
      internet_cafe: 'from-green-500 to-emerald-500',
      typing_copying: 'from-yellow-500 to-orange-500',
      stationery: 'from-red-500 to-pink-500',
      binding: 'from-teal-500 to-cyan-500',
      pos_terminal: 'from-violet-500 to-purple-500',
      bookstore: 'from-rose-500 to-red-500'
    };
    return `bg-gradient-to-r ${styles[category]} text-white`;
  };

  const getUserInfo = (userId: string) => {
    const user = mockMembers.find(m => m.id === userId);
    if (!user) return { name: 'کاربر ناشناس', isAnonymous: true };
    
    if (user.privacy_settings?.hide_identity && user.nickname) {
      return { name: user.nickname, isAnonymous: true };
    }
    
    return { name: user.full_name, isAnonymous: false };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg p-4 sticky top-0 z-10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در انتظارات..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as BusinessCategory | 'all')}
              className="px-4 py-2 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه رسته‌ها</option>
              {Object.entries(BUSINESS_CATEGORIES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'likes')}
              className="px-4 py-2 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">جدیدترین</option>
              <option value="likes">محبوب‌ترین</option>
            </select>
          </div>

          <button
            onClick={onAddExpectation}
            className="flex items-center justify-center space-x-2 space-x-reverse px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 w-full md:w-auto"
          >
            <PlusCircle className="h-5 w-5" />
            <span>افزودن انتظار جدید</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredExpectations.map((expectation) => {
          const userInfo = getUserInfo(expectation.user_id);
          
          return (
            <div
              key={expectation.id}
              className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden transform transition-all duration-200 hover:shadow-xl"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyle(expectation.business_category)}`}>
                        {BUSINESS_CATEGORIES[expectation.business_category]}
                      </div>
                      {expectation.candidate_responses.length > 0 && (
                        <div className="flex -space-x-2 space-x-reverse">
                          {expectation.candidate_responses.map((response) => {
                            const candidate = mockCandidates.find(c => c.id === response.candidate_id);
                            if (!candidate) return null;
                            return (
                              <img
                                key={response.id}
                                src={candidate.avatar_url}
                                alt={candidate.full_name}
                                className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card"
                                title={candidate.full_name}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {expectation.title}
                    </h3>
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400 space-x-4 space-x-reverse">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 ml-1" />
                        {format(new Date(expectation.created_at), 'yyyy/MM/dd')}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 ml-1" />
                        <span className={userInfo.isAnonymous ? 'italic' : ''}>
                          {userInfo.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {expectation.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <button
                      onClick={() => handleReaction(expectation.id, 'like')}
                      className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span>{expectation.likes}</span>
                    </button>
                    <button
                      onClick={() => handleReaction(expectation.id, 'dislike')}
                      className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <ThumbsDown className="h-5 w-5" />
                      <span>{expectation.dislikes}</span>
                    </button>
                    <button
                      onClick={() => {
                        setExpandedExpectation(expectation.id);
                        setActiveTab('comments');
                      }}
                      className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>{expectation.comments.length} نظر</span>
                    </button>
                    <button
                      onClick={() => {
                        setExpandedExpectation(expectation.id);
                        setActiveTab('responses');
                      }}
                      className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-green-500 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>{expectation.candidate_responses.length} پاسخ کاندیدا</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setExpandedExpectation(
                      expandedExpectation === expectation.id ? null : expectation.id
                    )}
                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    {expandedExpectation === expectation.id ? (
                      <>
                        <span className="text-sm">بستن</span>
                        <ChevronUp className="h-5 w-5 mr-1" />
                      </>
                    ) : (
                      <>
                        <span className="text-sm">مشاهده جزئیات</span>
                        <ChevronDown className="h-5 w-5 mr-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {expandedExpectation === expectation.id && (
                <div className="border-t border-gray-100 dark:border-gray-800">
                  <div className="flex border-b border-gray-100 dark:border-gray-800">
                    <button
                      onClick={() => setActiveTab('responses')}
                      className={`flex-1 py-3 text-sm font-medium ${
                        activeTab === 'responses'
                          ? 'text-blue-500 border-b-2 border-blue-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      پاسخ کاندیداها ({expectation.candidate_responses.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('comments')}
                      className={`flex-1 py-3 text-sm font-medium ${
                        activeTab === 'comments'
                          ? 'text-blue-500 border-b-2 border-blue-500'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      نظرات ({expectation.comments.length})
                    </button>
                  </div>

                  <div className="p-4">
                    {activeTab === 'responses' ? (
                      <div className="space-y-4">
                        {expectation.candidate_responses.map((response) => {
                          const candidate = mockCandidates.find(c => c.id === response.candidate_id);
                          if (!candidate) return null;

                          return (
                            <div key={response.id} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                              <div className="flex items-start space-x-4 space-x-reverse">
                                <img
                                  src={candidate.avatar_url}
                                  alt={candidate.full_name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
                                    <h5 className="font-bold text-gray-900 dark:text-white">
                                      {candidate.full_name}
                                    </h5>
                                    <button
                                      onClick={() => setExpandedResponse(
                                        expandedResponse === response.id ? null : response.id
                                      )}
                                      className="text-blue-500 hover:text-blue-600"
                                    >
                                      {expandedResponse === response.id ? (
                                        <ChevronUp className="h-5 w-5" />
                                      ) : (
                                        <ChevronDown className="h-5 w-5" />
                                      )}
                                    </button>
                                  </div>
                                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                                    {response.content}
                                  </p>

                                  {expandedResponse === response.id && (
                                    <div className="mt-4 p-4 bg-white dark:bg-dark-hover rounded-lg">
                                      <h6 className="font-bold text-gray-900 dark:text-white mb-2">
                                        برنامه عملیاتی:
                                      </h6>
                                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                                        {response.action_plan.map((step, index) => (
                                          <li key={index}>{step}</li>
                                        ))}
                                      </ul>
                                      <div className="mt-4 flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-4 space-x-reverse">
                                          <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-blue-500">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{response.likes}</span>
                                          </button>
                                          <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-red-500">
                                            <ThumbsDown className="h-4 w-4" />
                                            <span>{response.dislikes}</span>
                                          </button>
                                        </div>
                                        <div className="flex items-center text-gray-500">
                                          <Clock className="h-4 w-4 ml-1" />
                                          <span>زمان تخمینی: {response.estimated_time}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {expectation.comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 dark:bg-dark-hover rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {comment.is_anonymous ? 'کاربر ناشناس' : comment.user_name}
                                </span>
                                <p className="mt-1 text-gray-600 dark:text-gray-300">
                                  {comment.content}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">
                                {format(new Date(comment.created_at), 'HH:mm')}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center space-x-4 space-x-reverse">
                              <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-blue-500">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{comment.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-red-500">
                                <ThumbsDown className="h-4 w-4" />
                                <span>{comment.dislikes}</span>
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="mt-4">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="نظر خود را بنویسید..."
                              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-dark-hover border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleAddComment(expectation.id)}
                              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              ارسال
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}