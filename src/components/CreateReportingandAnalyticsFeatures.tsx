import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ReportData {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

const CreateReportingandAnalyticsFeatures: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('/reports', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setReports(response.data);
      } catch (err) {
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/reports/generate', {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setReports([...reports, response.data]);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (id: number) => {
    navigate(`/reports/${id}`);
  };

  if (loading) {
    return <div className="animate-pulse text-center text-blue-600">Loading reports...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Reporting and Analytics</h1>
      <button
        onClick={handleGenerateReport}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Generate New Report
      </button>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">{report.title}</h2>
            <p className="text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</p>
            <button
              onClick={() => handleViewReport(report.id)}
              className="mt-2 text-blue-600 hover:underline"
            >
              View Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateReportingandAnalyticsFeatures;