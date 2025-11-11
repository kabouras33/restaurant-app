import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ReportData {
  id: number;
  name: string;
  date: string;
  type: string;
  status: string;
}

const CreateReportingandAnalyticsFeatures: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/reports');
        setReports(response.data);
      } catch (err) {
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleGenerateReport = async (type: string) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/reports/generate', { type });
      setReports((prevReports) => [...prevReports, response.data]);
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (id: number) => {
    navigate(`/reports/${id}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Reporting and Analytics</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleGenerateReport('reservations')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Reservations Report
        </button>
        <button
          onClick={() => handleGenerateReport('inventory')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Generate Inventory Report
        </button>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Date</th>
              <th className="py-2">Type</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="text-center">
                <td className="py-2">{report.name}</td>
                <td className="py-2">{report.date}</td>
                <td className="py-2">{report.type}</td>
                <td className="py-2">{report.status}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleViewReport(report.id)}
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CreateReportingandAnalyticsFeatures;