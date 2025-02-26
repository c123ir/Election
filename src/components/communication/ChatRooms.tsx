import React, { useState } from 'react';
import { PlusCircle, Search, Send, Smile, Image, Paperclip, X, MoreVertical } from 'lucide-react';
import { ChatRoom, Message } from '../../types';
import { mockCandidates } from '../../data/mockData';
import { format } from 'date-fns-jalali';

// ایجاد اتاق‌های چت برای هر کاندیدا
const generateChatRooms = (): ChatRoom[] => {
  const publicRoom: ChatRoom = {
    id: 'public-room',
    title: 'گفتگوی عمومی',
    type: 'public',
    created_at: new Date().toISOString(),
    participants: [],
    allow_anonymous: true
  };

  const candidateRooms: ChatRoom[] = mockCandidates.map(candidate => ({
    id: `candidate-room-${candidate.id}`,
    title: `پرسش و پاسخ با ${candidate.full_name}`,
    type: 'candidate',
    candidate_id: candidate.id,
    created_at: new Date().toISOString(),
    participants: [],
    allow_anonymous: false
  }));

  return [publicRoom, ...candidateRooms];
};

const chatRooms = generateChatRooms();

const sampleMessages: Message[] = [
  {
    id: '1',
    sender_id: '1',
    sender_name: 'علی محمدی',
    content: 'سلام به همه دوستان',
    created_at: new Date().toISOString(),
    type: 'text',
    room_id: 'public-room',
    reactions: { likes: 2, dislikes: 0 }
  },
  {
    id: '2',
    sender_id: '2',
    sender_name: 'رضا کریمی',
    content: 'سلام، خسته نباشید',
    created_at: new Date().toISOString(),
    type: 'text',
    room_id: 'public-room',
    reactions: { likes: 1, dislikes: 0 }
  }
];

export function ChatRooms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(sampleMessages);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // فیلتر کردن اتاق‌ها بر اساس جستجو
  const filteredRooms = chatRooms.filter(room =>
    room.title.includes(searchQuery)
  );

  const handleSendMessage = () => {
    if (!message.trim() || !selectedRoom) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender_id: '1',
      sender_name: isAnonymous ? 'کاربر ناشناس' : 'شما',
      content: message,
      created_at: new Date().toISOString(),
      type: 'text',
      room_id: selectedRoom.id,
      reactions: { likes: 0, dislikes: 0 }
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleFileUpload = (type: 'image' | 'file') => {
    // در اینجا منطق آپلود فایل پیاده‌سازی می‌شود
    console.log('Upload', type);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* لیست چت‌روم‌ها */}
      <div className="w-80 border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredRooms.map((room) => {
            const lastMessage = messages.filter(m => m.room_id === room.id).pop();
            const candidate = room.type === 'candidate' ? 
              mockCandidates.find(c => c.id === room.candidate_id) : null;

            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full p-4 text-right hover:bg-gray-50 transition-colors ${
                  selectedRoom?.id === room.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  {candidate ? (
                    <img
                      src={candidate.avatar_url}
                      alt={candidate.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold">عمومی</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{room.title}</h3>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {format(new Date(lastMessage.created_at), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage.sender_name}: {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {}}
            className="flex items-center justify-center space-x-2 space-x-reverse w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>ایجاد گروه جدید</span>
          </button>
        </div>
      </div>

      {/* پنجره چت */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {selectedRoom.type === 'candidate' && (
                    <img
                      src={mockCandidates.find(c => c.id === selectedRoom.candidate_id)?.avatar_url}
                      alt={selectedRoom.title}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{selectedRoom.title}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedRoom.type === 'public' ? 'گفتگوی عمومی' : 'چت خصوصی'}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .filter(m => m.room_id === selectedRoom.id)
                .map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === '1' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender_id === '1'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-2 space-x-reverse mb-1">
                        <span className="font-medium text-sm">
                          {message.sender_name}
                        </span>
                        <span className="text-xs opacity-75">
                          {format(new Date(message.created_at), 'HH:mm')}
                        </span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              {selectedRoom.allow_anonymous && (
                <div className="mb-2 flex items-center">
                  <label className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span>ارسال به صورت ناشناس</span>
                  </label>
                </div>
              )}
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleFileUpload('image')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <Image className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleFileUpload('file')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="پیام خود را بنویسید..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            یک چت را انتخاب کنید
          </div>
        )}
      </div>
    </div>
  );
}