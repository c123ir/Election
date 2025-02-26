import React, { useState } from 'react';
import { Camera, Mic, MicOff, Video, VideoOff, Users, Settings, Share2, MessageSquare, X } from 'lucide-react';
import { mockCandidates } from '../../data/mockData';
import toast from 'react-hot-toast';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isSpeaking: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
}

interface DebateRoom {
  id: string;
  title: string;
  host: string;
  participants: string[];
  status: 'waiting' | 'live' | 'ended';
  type: 'debate' | 'meeting';
  maxParticipants: number;
}

const sampleDebateRooms: DebateRoom[] = [
  {
    id: '1',
    title: 'مناظره درباره دیجیتال‌سازی خدمات اتحادیه',
    host: mockCandidates[0].id,
    participants: [mockCandidates[0].id, mockCandidates[1].id, mockCandidates[2].id],
    status: 'live',
    type: 'debate',
    maxParticipants: 4
  },
  {
    id: '2',
    title: 'گفتگو با اعضای صنف',
    host: mockCandidates[3].id,
    participants: [mockCandidates[3].id],
    status: 'waiting',
    type: 'meeting',
    maxParticipants: 10
  }
];

export function VideoConference() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<DebateRoom | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    title: '',
    type: 'debate' as 'debate' | 'meeting',
    maxParticipants: 4
  });

  const handleCreateRoom = () => {
    if (!newRoomData.title) {
      toast.error('لطفاً عنوان جلسه را وارد کنید');
      return;
    }
    console.log('Create room:', newRoomData);
    setShowCreateRoom(false);
    toast.success('جلسه با موفقیت ایجاد شد');
  };

  const handleJoinRoom = (room: DebateRoom) => {
    if (room.participants.length >= room.maxParticipants) {
      toast.error('ظرفیت جلسه تکمیل است');
      return;
    }
    setSelectedRoom(room);
    toast.success('به جلسه پیوستید');
  };

  return (
    <div className="space-y-6">
      {!selectedRoom ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">جلسات و مناظره‌ها</h2>
            <button
              onClick={() => setShowCreateRoom(true)}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Video className="h-5 w-5" />
              <span>ایجاد جلسه جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleDebateRooms.map((room) => {
              const host = mockCandidates.find(c => c.id === room.host);
              if (!host) return null;

              return (
                <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <img
                        src={host.avatar_url}
                        alt={host.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{room.title}</h3>
                        <p className="text-sm text-gray-500">میزبان: {host.full_name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      room.status === 'live'
                        ? 'bg-red-100 text-red-800'
                        : room.status === 'waiting'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {room.status === 'live' ? 'در حال برگزاری' :
                       room.status === 'waiting' ? 'در انتظار شروع' : 'پایان یافته'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 ml-2" />
                      <span>{room.participants.length} از {room.maxParticipants} شرکت‌کننده</span>
                    </div>
                    <div className="flex items-center">
                      <Video className="h-5 w-5 ml-2" />
                      <span>{room.type === 'debate' ? 'مناظره' : 'جلسه عمومی'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleJoinRoom(room)}
                    disabled={room.status === 'ended'}
                    className={`w-full px-4 py-2 rounded-md ${
                      room.status === 'ended'
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {room.status === 'ended' ? 'پایان یافته' : 'ورود به جلسه'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-white hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
              <h3 className="text-white font-medium">{selectedRoom.title}</h3>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setShowChat(!showChat)}
                className="p-2 text-white hover:bg-gray-800 rounded-full"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <button className="p-2 text-white hover:bg-gray-800 rounded-full">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 text-white hover:bg-gray-800 rounded-full">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1">
              <div className="aspect-video bg-black relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-gray-500" />
                </div>
                
                {/* کنترل‌های ویدیو */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`p-3 rounded-full ${
                      isAudioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {isAudioEnabled ? (
                      <Mic className="h-6 w-6 text-white" />
                    ) : (
                      <MicOff className="h-6 w-6 text-white" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`p-3 rounded-full ${
                      isVideoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {isVideoEnabled ? (
                      <Video className="h-6 w-6 text-white" />
                    ) : (
                      <VideoOff className="h-6 w-6 text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* شرکت‌کنندگان */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                {selectedRoom.participants.map((participantId) => {
                  const participant = mockCandidates.find(c => c.id === participantId);
                  if (!participant) return null;

                  return (
                    <div key={participantId} className="aspect-video bg-gray-800 rounded-lg relative">
                      <img
                        src={participant.avatar_url}
                        alt={participant.full_name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                        <p className="text-white text-sm truncate">{participant.full_name}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {showChat && (
              <div className="w-80 border-r border-gray-800 bg-gray-900 flex flex-col">
                <div className="p-4 border-b border-gray-800">
                  <h4 className="text-white font-medium">چت</h4>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {/* پیام‌های چت */}
                </div>
                <div className="p-4 border-t border-gray-800">
                  <input
                    type="text"
                    placeholder="پیام خود را بنویسید..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* مودال ایجاد جلسه جدید */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">ایجاد جلسه جدید</h2>
              <button
                onClick={() => setShowCreateRoom(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان جلسه
                </label>
                <input
                  type="text"
                  value={newRoomData.title}
                  onChange={(e) => setNewRoomData({ ...newRoomData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="مثال: مناظره درباره برنامه‌های انتخاباتی"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع جلسه
                </label>
                <select
                  value={newRoomData.type}
                  onChange={(e) => setNewRoomData({ ...newRoomData, type: e.target.value as 'debate' | 'meeting' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="debate">مناظره</option>
                  <option value="meeting">جلسه عمومی</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حداکثر تعداد شرکت‌کنندگان
                </label>
                <input
                  type="number"
                  value={newRoomData.maxParticipants}
                  onChange={(e) => setNewRoomData({ ...newRoomData, maxParticipants: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  min="2"
                  max="10"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateRoom(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                انصراف
              </button>
              <button
                onClick={handleCreateRoom}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                ایجاد جلسه
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}