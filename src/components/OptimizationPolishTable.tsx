import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface TableProps {
  data: any[];
  columns: { key: string; label: string }[];
}

interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

const OptimizationPolishTable: React.FC<TableProps> = ({ data, columns }) => {
  const [sortedData, setSortedData] = useState(data);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (sortConfig !== null) {
      const sorted = [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setSortedData(sorted);
    }
  }, [data, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/data-endpoint');
      setSortedData(response.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      {loading && <div className="animate-pulse">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => requestSort(column.key)}
                className="p-3 text-left cursor-pointer hover:bg-blue-600 transition"
              >
                {column.label}
                {sortConfig?.key === column.key && (
                  <span>
                    {sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-100 transition"
              tabIndex={0}
            >
              {columns.map((column) => (
                <td key={column.key} className="p-3">
                  {item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sortedData.length === 0 && !loading && (
        <div className="text-center p-6">
          <p className="text-gray-500">No data available.</p>
        </div>
      )}
    </div>
  );
};

export default OptimizationPolishTable;