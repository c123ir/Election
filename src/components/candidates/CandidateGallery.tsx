import React, { useState } from 'react';
import { 
  Video, 
  Image as ImageIcon, 
  FileText, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  Download,
  Upload,
  X,
  Send
} from 'lucide-react';
import { CandidateMedia, Candidate, Comment, MediaType } from '../../types';
import { format } from 'date-fns-jalali';
import toast from 'react-hot-toast';

interface CandidateGalleryProps {
  candidate: Candidate;
  isCurrentCandidate?: boolean;
  onAddMedia?: (media: Partial<CandidateMedia>) => void;
}

export function CandidateGallery({ candidate, isCurrentCandidate, onAddMedia }: CandidateGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<CandidateMedia | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'image' as MediaType,
    url: '',
    file_type: ''
  });

  const handleReaction = (mediaId: string, type: 'like' | 'dislike') => {
    toast.success(type === 'like' ? 'لایک شد' : 'دیس‌لایک شد');
  };

  const handleAddComment = (mediaId: string) => {
    if (!newComment.trim()) return;
    
    toast.success('نظر شما با موفقیت ثبت شد');
    setNewComment('');
  };

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.url) {
      toast.error('لطفاً عنوان و آدرس فایل را وارد کنید');
      return;
    }

    onAddMedia?.(uploadForm);
    setShowUploadModal(false);
    setUploadForm({
      title: '',
      description: '',
      type: 'image',
      url: '',
      file_type: ''
    });
  };

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'image':
        return <ImageIcon className="h-6 w-6" />;
      case 'document':
        return <FileText className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">گالری تبلیغات و رسانه‌ها</h2>
        {isCurrentCandidate && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Upload className="h-5 w-5" />
            <span>افزودن رسانه جدید</span>
          </button>
        )}
      </div>

      {/* گرید رسانه‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidate.media?.map((media) => (
          <div
            key={media.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform"
            onClick={() => setSelectedMedia(media)}
          >
            <div className="aspect-video relative">
              {media.type === 'video' && (
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  poster={media.thumbnail_url}
                />
              )}
              {media.type === 'image' && (
                <img
                  src={media.url}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
              )}
              {media.type === 'document' && (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 right-0 p-4">
                {getMediaIcon(media.type)}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900">{media.title}</h3>
              {media.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {media.description}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>{format(new Date(media.created_at), 'yyyy/MM/dd')}</span>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 ml-1" />
                    <span>{media.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 ml-1" />
                    <span>{media.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* مودال نمایش جزئیات */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">{selectedMedia.title}</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse">
              {/* نمایش رسانه */}
              <div className="p-4">
                {selectedMedia.type === 'video' && (
                  <video
                    src={selectedMedia.url}
                    controls
                    className="w-full rounded-lg"
                    poster={selectedMedia.thumbnail_url}
                  />
                )}
                {selectedMedia.type === 'image' && (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="w-full rounded-lg"
                  />
                )}
                {selectedMedia.type === 'document' && (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
                    <FileText className="h-20 w-20 text-gray-400 mb-4" />
                    <a
                      href={selectedMedia.url}
                      download
                      className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <Download className="h-5 w-5" />
                      <span>دانلود فایل</span>
                    </a>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-gray-600">{selectedMedia.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-4 space-x-reverse">
                      <button
                        onClick={() => handleReaction(selectedMedia.id, 'like')}
                        className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-blue-500"
                      >
                        <ThumbsUp className="h-5 w-5" />
                        <span>{selectedMedia.likes}</span>
                      </button>
                      <button
                        onClick={() => handleReaction(selectedMedia.id, 'dislike')}
                        className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-red-500"
                      >
                        <ThumbsDown className="h-5 w-5" />
                        <span>{selectedMedia.dislikes}</span>
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(selectedMedia.created_at), 'yyyy/MM/dd HH:mm')}
                    </span>
                  </div>
                </div>
              </div>

              {/* نظرات */}
              <div className="p-4 flex flex-col h-[600px]">
                <h4 className="font-medium mb-4">نظرات</h4>
                <div className="flex-1 overflow-y-auto space-y-4">
                  {selectedMedia.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">
                            {comment.is_anonymous ? 'کاربر ناشناس' : comment.user_name}
                          </span>
                          <p className="mt-1 text-gray-600">{comment.content}</p>
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
                </div>
                <div className="mt-4 flex items-center space-x-2 space-x-reverse">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="نظر خود را بنویسید..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    onClick={() => handleAddComment(selectedMedia.id)}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال آپلود */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">افزودن رسانه جدید</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع رسانه
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as MediaType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="image">تصویر</option>
                  <option value="video">ویدیو</option>
                  <option value="document">سند</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="عنوان رسانه را وارد کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  توضیحات
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="توضیحات رسانه را وارد کنید"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  آدرس فایل
                </label>
                <input
                  type="url"
                  value={uploadForm.url}
                  onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="آدرس اینترنتی فایل را وارد کنید"
                  dir="ltr"
                />
              </div>

              {uploadForm.type === 'document' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع فایل
                  </label>
                  <select
                    value={uploadForm.file_type}
                    onChange={(e) => setUploadForm({ ...uploadForm, file_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="pdf">PDF</option>
                    <option value="doc">Word</option>
                    <option value="txt">متن ساده</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 space-x-reverse p-4 border-t">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                آپلود
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}