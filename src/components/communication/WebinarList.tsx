import React, { useState } from 'react';
import { Calendar, Clock, Users, PlayCircle, PlusCircle, Video, X, AlertCircle } from 'lucide-react';
import { Webinar, BusinessCategory, BUSINESS_CATEGORIES } from '../../types';
import { format } from 'date-fns-jalali';
import { mockCandidates } from '../../data/mockData';
import toast from 'react-hot-toast';

interface AddWebinarFormProps {
  onClose: () => void;
  onSubmit: (data: Partial<Webinar>) => void;
}

function AddWebinarForm({ onClose, onSubmit }: AddWebinarFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    duration: 60,
    candidate_id: mockCandidates[0].id
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.start_time) {
      toast.error('لطفاً همه فیلدهای ضروری را پر کنید');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">ایجاد وبینار جدید</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان وبینار
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="مثال: معرفی برنامه‌های انتخاباتی"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="توضیحات وبینار را وارد کنید..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاریخ و ساعت شروع
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مدت زمان (دقیقه)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                min="15"
                max="180"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 ml-2" />
              <div className="text-sm text-yellow-700">
                <h6 className="font-medium mb-1">نکات مهم:</h6>
                <ul className="list-disc list-inside space-y-1">
                  <li>زمان شروع باید حداقل ۲۴ ساعت بعد از زمان فعلی باشد</li>
                  <li>مدت زمان وبینار باید بین ۱۵ تا ۱۸۰ دقیقه باشد</li>
                  <li>امکان ویرایش زمان پس از ایجاد وبینار وجود ندارد</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              ایجاد وبینار
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ایجاد وبینارهای نمونه برای کاندیداها
const generateWebinars = (): Webinar[] => {
  return mockCandidates.map((candidate, index) => ({
    id: `webinar-${index + 1}`,
    title: `معرفی برنامه‌های انتخاباتی ${candidate.full_name}`,
    description: candidate.bio || 'در این وبینار برنامه‌های خود را برای بهبود وضعیت صنف تشریح خواهم کرد.',
    candidate_id: candidate.id,
    start_time: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    status: 'scheduled',
    participants_count: Math.floor(Math.random() * 50) + 10
  }));
};

const webinars = generateWebinars();

export function WebinarList() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddWebinar = (data: Partial<Webinar>) => {
    console.log('New webinar:', data);
    setShowAddForm(false);
    toast.success('وبینار با موفقیت ایجاد شد');
  };

  const filteredWebinars = webinars.filter(webinar => {
    if (filter === 'upcoming') return webinar.status === 'scheduled';
    if (filter === 'live') return webinar.status === 'live';
    if (filter === 'ended') return webinar.status === 'ended';
    return true;
  }).filter(webinar =>
    webinar.title.includes(searchQuery) ||
    mockCandidates.find(c => c.id === webinar.candidate_id)?.full_name.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 space-x-reverse">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'upcoming' | 'live' | 'ended')}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">همه وبینارها</option>
            <option value="upcoming">وبینارهای پیش رو</option>
            <option value="live">در حال پخش</option>
            <option value="ended">پایان یافته</option>
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در وبینارها..."
            className="px-4 py-2 border border-gray-300 rounded-md w-64"
          />
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <PlusCircle className="h-5 w-5" />
          <span>ایجاد وبینار جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWebinars.map((webinar) => {
          const candidate = mockCandidates.find(c => c.id === webinar.candidate_id);
          if (!candidate) return null;

          return (
            <div key={webinar.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {webinar.status === 'live' ? (
                    <Video className="h-16 w-16 text-red-500" />
                  ) : (
                    <Calendar className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                {webinar.status === 'live' && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-sm font-medium rounded-full flex items-center">
                    <span className="h-2 w-2 bg-white rounded-full animate-pulse mr-1"></span>
                    پخش زنده
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 space-x-reverse mb-4">
                  <img
                    src={candidate.avatar_url}
                    alt={candidate.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{webinar.title}</h3>
                    <p className="text-sm text-gray-500">{candidate.full_name}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {webinar.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 ml-2" />
                    <span>{format(new Date(webinar.start_time), 'EEEE d MMMM yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 ml-2" />
                    <span>{format(new Date(webinar.start_time), 'HH:mm')}</span>
                    <span className="mx-2">-</span>
                    <span>{webinar.duration} دقیقه</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 ml-2" />
                    <span>{webinar.participants_count} شرکت‌کننده</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    className={`flex items-center justify-center space-x-2 space-x-reverse w-full px-4 py-2 rounded-md ${
                      webinar.status === 'live'
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : webinar.status === 'ended'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    disabled={webinar.status === 'ended'}
                  >
                    <PlayCircle className="h-5 w-5" />
                    <span>
                      {webinar.status === 'live'
                        ? 'ورود به وبینار'
                        : webinar.status === 'ended'
                        ? 'پایان یافته'
                        : 'ثبت‌نام در وبینار'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddForm && (
        <AddWebinarForm
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddWebinar}
        />
      )}
    </div>
  );
}