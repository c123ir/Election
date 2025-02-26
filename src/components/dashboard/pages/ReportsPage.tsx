import React, { useState, useMemo } from 'react';
import { Download, Printer, Filter, ChevronDown, ChevronUp, BarChart } from 'lucide-react';
import { VoteResults } from '../../voting/VoteResults';
import { format, subDays } from 'date-fns-jalali';
import { useInView } from 'react-intersection-observer';
import { PageHeader } from '../../common/PageHeader';

interface TableColumn {
  id: string;
  title: string;
  sortable?: boolean;
}

const columns: TableColumn[] = [
  { id: 'date', title: 'تاریخ', sortable: true },
  { id: 'votes', title: 'تعداد آرا', sortable: true },
  { id: 'participation', title: 'درصد مشارکت', sortable: true },
  { id: 'category', title: 'رسته صنفی', sortable: true }
];

const sampleData = Array.from({ length: 50 }, (_, i) => ({
  id: i.toString(),
  date: format(subDays(new Date(), i), 'yyyy/MM/dd'),
  votes: Math.floor(Math.random() * 1000),
  participation: Math.floor(Math.random() * 100),
  category: ['رایانه', 'ماشین‌های اداری', 'کافی‌نت'][Math.floor(Math.random() * 3)]
}));

export function ReportsPage() {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const sortedData = useMemo(() => {
    if (!sortConfig) return sampleData;

    return [...sampleData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleExport = () => {
    // پیاده‌سازی خروجی گرفتن
    console.log('Export data');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="گزارش‌ها و آمار"
        description="مشاهده آمار و تحلیل‌های مربوط به انتخابات و فعالیت‌های صنفی"
        icon={BarChart}
        gradient="from-teal-600 to-emerald-600"
        image="https://source.unsplash.com/featured/400x400?chart,analytics"
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <label className="text-sm text-gray-600 dark:text-gray-400">از تاریخ:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <label className="text-sm text-gray-600 dark:text-gray-400">تا تاریخ:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300"
          >
            <Printer className="h-5 w-5" />
            <span>چاپ</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-hover text-gray-700 dark:text-gray-300"
          >
            <Download className="h-5 w-5" />
            <span>دانلود</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" ref={ref}>
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 dark:border-gray-700 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {columns.map(column => (
                    <th
                      key={column.id}
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <span>{column.title}</span>
                        {column.sortable && sortConfig?.key === column.id && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">عملیات</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedData.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`transform transition-opacity duration-300 ${
                        inView ? 'opacity-100' : 'opacity-0'
                      } hover:bg-gray-50 dark:hover:bg-gray-800`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {row.votes.toLocaleString('fa-IR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {row.participation}٪
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {row.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {expandedRow === row.id ? 'بستن' : 'جزئیات'}
                        </button>
                      </td>
                    </tr>
                    {expandedRow === row.id && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4">
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                              جزئیات آمار روز {row.date}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">تعداد کل آرا</p>
                                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                  {row.votes.toLocaleString('fa-IR')}
                                </p>
                              </div>
                              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">درصد مشارکت</p>
                                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                  {row.participation}٪
                                </p>
                              </div>
                              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">رسته صنفی</p>
                                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                  {row.category}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">نمودار آماری</h3>
        <VoteResults />
      </div>
    </div>
  );
}