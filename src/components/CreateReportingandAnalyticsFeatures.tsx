import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ReportData {
  id: number;
  name: string;
  date: string;
  reservations: number;
  inventory: number;
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
          headers: { Authorization: `Bearer ${user?.token}` },
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

  const handleDownloadReport = async (reportId: number) => {
    try {
      const response = await axios.get(`/api/reports/${reportId}/download`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('Failed to download report. Please try again later.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Reporting and Analytics</h1>
      {loading && <p className="text-blue-500">Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Date</th>
              <th className="py-2">Reservations</th>
              <th className="py-2">Inventory</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="py-2">{report.name}</td>
                <td className="py-2">{report.date}</td>
                <td className="py-2">{report.reservations}</td>
                <td className="py-2">{report.inventory}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleDownloadReport(report.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    aria-label={`Download report ${report.name}`}
                  >
                    Download
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

export default CreateReportingAndAnalyticsFeatures;