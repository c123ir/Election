import React, { useState } from 'react';
import { BarChart, PieChart, Filter, PlusCircle, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns-jalali';
import { BusinessCategory, BUSINESS_CATEGORIES } from '../../types';
import { mockSurveys } from '../../data/mockSurveys';
import { PageHeader } from '../common/PageHeader';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface SurveyListProps {
  onAddSurvey: () => void;
}

export function SurveyList({ onAddSurvey }: SurveyListProps) {
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'all'>('all');
  const [showChartType, setShowChartType] = useState<'bar' | 'pie'>('bar');
  const [sortBy, setSortBy] = useState<'date' | 'votes'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'ended'>('all');

  const filteredSurveys = mockSurveys
    .filter(survey => selectedCategory === 'all' || survey.business_category === selectedCategory)
    .filter(survey => {
      switch (filterStatus) {
        case 'active':
          return survey.is_active;
        case 'ended':
          return !survey.is_active;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return b.total_votes - a.total_votes;
    });

  const handleVote = (surveyId: string, optionId: string) => {
    const survey = mockSurveys.find(s => s.id === surveyId);
    if (!survey?.is_active) {
      toast.error('این نظرسنجی به پایان رسیده است');
      return;
    }
    toast.success('رای شما با موفقیت ثبت شد');
  };

  const renderPieChart = (survey: typeof mockSurveys[0]) => {
    const data = {
      labels: survey.options.map(option => option.text),
      datasets: [
        {
          data: survey.options.map(option => option.votes),
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom' as const,
          rtl: true,
          labels: {
            font: {
              family: 'Yekan',
            },
          },
        },
      },
    };

    return <Pie data={data} options={options} />;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="نظرسنجی‌های صنفی"
        description="مشارکت در نظرسنجی‌ها برای بهبود خدمات و تصمیم‌گیری‌های صنفی"
        icon={BarChart}
        gradient="from-purple-600 to-blue-600"
        image="https://source.unsplash.com/featured/400x400?survey"
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as BusinessCategory | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">همه رسته‌ها</option>
            {Object.entries(BUSINESS_CATEGORIES).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'ended')}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="active">فعال</option>
            <option value="ended">پایان یافته</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'votes')}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="date">جدیدترین</option>
            <option value="votes">بیشترین مشارکت</option>
          </select>

          <div className="flex items-center bg-gray-100 rounded-md">
            <button
              onClick={() => setShowChartType('bar')}
              className={`p-2 rounded-r-md ${showChartType === 'bar' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              <BarChart className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowChartType('pie')}
              className={`p-2 rounded-l-md ${showChartType === 'pie' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              <PieChart className="h-5 w-5" />
            </button>
          </div>
        </div>

        <button
          onClick={onAddSurvey}
          className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <PlusCircle className="h-5 w-5" />
          <span>ایجاد نظرسنجی جدید</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSurveys.map((survey) => (
          <div key={survey.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">{survey.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{survey.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                survey.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {survey.is_active ? 'فعال' : 'پایان یافته'}
              </span>
            </div>

            <div className="space-y-4">
              {showChartType === 'pie' ? (
                <div className="h-64">
                  {renderPieChart(survey)}
                </div>
              ) : (
                survey.options.map((option) => (
                  <div key={option.id} className="relative pt-1">
                    <button
                      onClick={() => handleVote(survey.id, option.id)}
                      disabled={!survey.is_active}
                      className="w-full text-right hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium">{option.text}</div>
                        <div className="text-sm font-medium">
                          {Math.round((option.votes / survey.total_votes) * 100)}%
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${(option.votes / survey.total_votes) * 100}%` }}
                          className="bg-blue-500 rounded"
                        />
                      </div>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center">
                  <Users className="h-4 w-4 ml-1" />
                  <span>{survey.total_votes.toLocaleString('fa-IR')} رای</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 ml-1" />
                  <span>پایان: {format(new Date(survey.end_date), 'yyyy/MM/dd')}</span>
                </div>
              </div>
              {survey.is_active && (
                <button
                  onClick={() => handleVote(survey.id, survey.options[0].id)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  ثبت رای
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}