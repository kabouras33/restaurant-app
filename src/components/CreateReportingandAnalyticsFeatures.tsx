import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ReportData {
  id: number;
  type: string;
  date: string;
  details: string;
}

const CreateReportingAndAnalyticsFeatures: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/reports', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReports(response.data);
      } catch (err) {
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user.token]);

  const handleGenerateReport = async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        '/api/reports/generate',
        { type },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReports((prevReports) => [...prevReports, response.data]);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Reporting and Analytics</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
            onClick={() => handleGenerateReport('reservations')}
          >
            Generate Reservations Report
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded ml-2 hover:bg-green-600 focus:outline-none"
            onClick={() => handleGenerateReport('inventory')}
          >
            Generate Inventory Report
          </button>
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Reports</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Details</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td className="py-2 px-4 border-b">{report.id}</td>
                    <td className="py-2 px-4 border-b">{report.type}</td>
                    <td className="py-2 px-4 border-b">{report.date}</td>
                    <td className="py-2 px-4 border-b">{report.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReportingAndAnalyticsFeatures;