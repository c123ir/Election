import React, { useState, useEffect } from 'react';
import { Monitor, Power, Clock, User, Settings, AlertTriangle } from 'lucide-react';
import { CafeSystem } from '../../types/cafe';
import { format } from 'date-fns-jalali';

interface SystemMonitorProps {
  systems: CafeSystem[];
  onSystemAction: (systemId: string, action: 'start' | 'stop' | 'maintenance') => void;
}

export function SystemMonitor({ systems, onSystemAction }: SystemMonitorProps) {
  const [selectedSystem, setSelectedSystem] = useState<CafeSystem | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: CafeSystem['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: CafeSystem['status']) => {
    switch (status) {
      case 'available':
        return 'آماده استفاده';
      case 'occupied':
        return 'در حال استفاده';
      case 'maintenance':
        return 'تعمیرات';
      default:
        return 'نامشخص';
    }
  };

  const calculateUsageTime = (startTime?: string) => {
    if (!startTime) return '0:00';
    const start = new Date(startTime);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center space-x-2 space-x-reverse">
          <Monitor className="h-6 w-6" />
          <span>مانیتورینگ سیستم‌ها</span>
        </h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm">آماده</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-sm">در حال استفاده</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm">تعمیرات</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {systems.map(system => (
          <div
            key={system.id}
            className="bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(system.status)}`}></div>
                  <h3 className="font-medium">{system.name}</h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedSystem(system);
                    setShowDetails(true);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">وضعیت:</span>
                  <span>{getStatusText(system.status)}</span>
                </div>
                {system.current_user && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">کاربر:</span>
                      <span>{system.current_user.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">زمان استفاده:</span>
                      <span>{calculateUsageTime(system.start_time)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {system.status === 'available' && (
                  <button
                    onClick={() => onSystemAction(system.id, 'start')}
                    className="flex items-center justify-center space-x-1 space-x-reverse px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    <Power className="h-4 w-4" />
                    <span>شروع</span>
                  </button>
                )}
                {system.status === 'occupied' && (
                  <button
                    onClick={() => onSystemAction(system.id, 'stop')}
                    className="flex items-center justify-center space-x-1 space-x-reverse px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    <Power className="h-4 w-4" />
                    <span>پایان</span>
                  </button>
                )}
                <button
                  onClick={() => onSystemAction(system.id, 'maintenance')}
                  className="flex items-center justify-center space-x-1 space-x-reverse px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>تعمیرات</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDetails && selectedSystem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium">جزئیات سیستم {selectedSystem.name}</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium mb-2">مشخصات سخت‌افزاری</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">پردازنده:</span>
                    <span>{selectedSystem.specs.cpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">حافظه:</span>
                    <span>{selectedSystem.specs.ram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">کارت گرافیک:</span>
                    <span>{selectedSystem.specs.gpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">سیستم عامل:</span>
                    <span>{selectedSystem.specs.os}</span>
                  </div>
                </div>
              </div>

              {selectedSystem.current_user && (
                <div>
                  <h4 className="font-medium mb-2">اطلاعات کاربر فعلی</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">نام:</span>
                      <span>{selectedSystem.current_user.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">شروع استفاده:</span>
                      <span>{format(new Date(selectedSystem.start_time!), 'HH:mm:ss')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">مدت استفاده:</span>
                      <span>{calculateUsageTime(selectedSystem.start_time)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 space-x-reverse p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}