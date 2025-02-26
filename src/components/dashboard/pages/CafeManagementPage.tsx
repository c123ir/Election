import React, { useState, useCallback, useMemo } from 'react';
import { SystemMonitor } from '../../cafe/SystemMonitor';
import { CafeAnalytics } from '../../../lib/ai/cafeAnalytics';
import { CafeSystem, CafeUser, CafeTransaction } from '../../../types/cafe';
import { BarChart, Users, Clock, DollarSign, Cpu, Printer, Scan, Copy, Wifi, Settings, Monitor } from 'lucide-react';
import { PageHeader } from '../../common/PageHeader';
import { Chart } from 'chart.js/auto';
import { format } from 'date-fns-jalali';

// نمونه داده برای سیستم‌ها
const sampleSystems: CafeSystem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `sys-${i + 1}`,
  name: `سیستم ${i + 1}`,
  status: i % 3 === 0 ? 'occupied' : i % 3 === 1 ? 'available' : 'maintenance',
  specs: {
    cpu: 'Intel Core i7-12700K',
    ram: '32GB DDR4',
    gpu: 'NVIDIA RTX 3060',
    os: 'Windows 11 Pro'
  },
  current_user: i % 3 === 0 ? {
    id: `user-${i}`,
    name: `کاربر ${i}`,
    credit: 100000,
    total_time: 3600,
    favorite_systems: [`sys-${i + 1}`],
    last_visit: new Date().toISOString()
  } : undefined,
  start_time: i % 3 === 0 ? new Date(Date.now() - 3600000).toISOString() : undefined
}));

export function CafeManagementPage() {
  const [systems, setSystems] = useState<CafeSystem[]>(sampleSystems);
  const [selectedTab, setSelectedTab] = useState<'monitor' | 'analytics' | 'services'>('monitor');
  const analytics = useMemo(() => new CafeAnalytics(), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="مدیریت کافی‌نت"
        description="سیستم مدیریت یکپارچه کافی‌نت با قابلیت مانیتورینگ و گزارش‌گیری"
        icon={Monitor}
        gradient="from-indigo-600 to-purple-600"
        image="https://source.unsplash.com/featured/400x400?computer,cafe"
      />

      <div className="flex justify-between items-center">
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => setSelectedTab('monitor')}
            className={`px-4 py-2 rounded-md ${
              selectedTab === 'monitor'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'
            }`}
          >
            مانیتورینگ
          </button>
          <button
            onClick={() => setSelectedTab('analytics')}
            className={`px-4 py-2 rounded-md ${
              selectedTab === 'analytics'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'
            }`}
          >
            آمار و تحلیل
          </button>
          <button
            onClick={() => setSelectedTab('services')}
            className={`px-4 py-2 rounded-md ${
              selectedTab === 'services'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300'
            }`}
          >
            خدمات
          </button>
        </div>
      </div>

      {selectedTab === 'monitor' && (
        <SystemMonitor
          systems={systems}
          onSystemAction={() => {}}
        />
      )}
    </div>
  );
}