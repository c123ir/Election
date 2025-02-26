import React, { useState } from 'react';
import { MessageSquare, Video, Users } from 'lucide-react';
import { ChatRooms } from '../../communication/ChatRooms';
import { WebinarList } from '../../communication/WebinarList';
import { VideoConference } from '../../communication/VideoConference';
import { PageHeader } from '../../common/PageHeader';

export function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'webinar' | 'video'>('chat');

  const tabs = [
    { id: 'chat', title: 'چت گروهی', icon: MessageSquare },
    { id: 'webinar', title: 'وبینارها', icon: Video },
    { id: 'video', title: 'ویدئو کنفرانس', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="ارتباطات و گفتگو"
        description="امکانات ارتباطی برای تعامل با کاندیداها و اعضای صنف"
        icon={MessageSquare}
        gradient="from-blue-600 to-cyan-600"
        image="https://source.unsplash.com/featured/400x400?communication"
      />

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 space-x-reverse px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 space-x-reverse py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'chat' && <ChatRooms />}
          {activeTab === 'webinar' && <WebinarList />}
          {activeTab === 'video' && <VideoConference />}
        </div>
      </div>
    </div>
  );
}