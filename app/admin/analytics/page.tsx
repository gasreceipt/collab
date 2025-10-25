'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardData {
  totalSessions: number;
  pageViews: Array<{ page: string; count: number }>;
  conversionStats: Array<{ conversion_status: string; count: number }>;
  deviceStats: Array<{ device_type: string; count: number }>;
  topElements: Array<{ element_id: string; element_category: string; clicks: number }>;
  emailSignups: Array<{ page: string; count: number }>;
  productEngagement: Array<{ brand: string; interaction_type: string; count: number }>;
  scrollDepth: Array<{ page: string; avg_scroll: number }>;
  timeOnPage: Array<{ page: string; avg_time: number }>;
  recentSubmissions: Array<{ email: string; page: string; form_type: string; timestamp: string }>;
  abTestResults: Array<{ ab_test_variant: string; sessions: number; cta_clicks: number }>;
  trafficSources: Array<{ utm_source: string; sessions: number }>;
}

const COLORS = ['#1E3A8A', '#EA580C', '#9CA3AF', '#000000'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `/api/analytics/dashboard?start_date=${dateRange.start}&end_date=${dateRange.end}`
      );
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [dateRange.start, dateRange.end]);

  const handleExport = async (format: 'json' | 'csv', table: string) => {
    try {
      const response = await fetch(
        `/api/analytics/export?format=${format}&table=${table}&start_date=${dateRange.start}&end_date=${dateRange.end}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${table}_export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  // Calculate conversion rate with null checks
  const totalConversions = data?.conversionStats?.find((s) => s.conversion_status !== 'none')?.count || 0;
  const conversionRate =
    data?.totalSessions > 0 ? ((totalConversions / data.totalSessions) * 100).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">vSMPL Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights across all brands</p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              onClick={fetchDashboardData}
              className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Update
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
            <p className="text-3xl font-bold">{data?.totalSessions || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Email Signups</p>
            <p className="text-3xl font-bold">
              {data?.emailSignups?.reduce((sum, item) => sum + item.count, 0) || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold">{conversionRate}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Avg Scroll Depth</p>
            <p className="text-3xl font-bold">
              {data?.scrollDepth?.length > 0
                ? Math.round(
                    data.scrollDepth.reduce((sum, item) => sum + item.avg_scroll, 0) /
                      data.scrollDepth.length
                  )
                : 0}
              %
            </p>
          </div>
        </div>

        {/* Page Views Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Page Views by Brand</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.pageViews || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#1E3A8A" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device & Conversion Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Device Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Device Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.deviceStats || []}
                  dataKey="count"
                  nameKey="device_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {(data?.deviceStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Conversion Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Conversion Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.conversionStats || []}
                  dataKey="count"
                  nameKey="conversion_status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {(data?.conversionStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Elements */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Top Performing Elements</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Element ID</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-right py-3 px-4">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topElements || []).slice(0, 10).map((element, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{element.element_id}</td>
                    <td className="py-3 px-4">{element.element_category}</td>
                    <td className="py-3 px-4 text-right font-bold">{element.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Signups by Page */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Email Signups by Page</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.emailSignups || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#EA580C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* A/B Test Results */}
        {(data?.abTestResults?.length || 0) > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">A/B Test Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Variant</th>
                    <th className="text-right py-3 px-4">Sessions</th>
                    <th className="text-right py-3 px-4">CTA Clicks</th>
                    <th className="text-right py-3 px-4">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.abTestResults || []).map((result, index) => {
                    const ctr =
                      result.sessions > 0
                        ? ((result.cta_clicks / result.sessions) * 100).toFixed(2)
                        : '0.00';
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{result.ab_test_variant}</td>
                        <td className="py-3 px-4 text-right">{result.sessions}</td>
                        <td className="py-3 px-4 text-right">{result.cta_clicks}</td>
                        <td className="py-3 px-4 text-right font-bold">{ctr}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Form Submissions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Recent Form Submissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Page</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentSubmissions || []).slice(0, 10).map((submission, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{submission.email}</td>
                    <td className="py-3 px-4">{submission.page}</td>
                    <td className="py-3 px-4">{submission.form_type}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(submission.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Export Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => handleExport('csv', 'analytics_events')}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Events (CSV)
            </button>
            <button
              onClick={() => handleExport('csv', 'form_submissions')}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Forms (CSV)
            </button>
            <button
              onClick={() => handleExport('csv', 'product_engagement')}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Products (CSV)
            </button>
            <button
              onClick={() => handleExport('json', 'user_sessions')}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Sessions (JSON)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
