import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

interface TestComponentProps {
  apiUrl: string;
}

const TestComponent: React.FC<TestComponentProps> = ({ apiUrl }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Data List</h1>
      <ul className="list-disc pl-5">
        {data.map((item, index) => (
          <li key={index} className="py-1">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('TestComponent', () => {
  it('renders loading state initially', () => {
    render(<TestComponent apiUrl="/api/data" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders data after successful fetch', async () => {
    axios.get = jest.fn().mockResolvedValue({
      data: [{ name: 'Item 1' }, { name: 'Item 2' }],
    });

    render(<TestComponent apiUrl="/api/data" />);
    await waitFor(() => expect(screen.getByText(/item 1/i)).toBeInTheDocument());
    expect(screen.getByText(/item 2/i)).toBeInTheDocument();
  });

  it('renders error message on fetch failure', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network Error'));

    render(<TestComponent apiUrl="/api/data" />);
    await waitFor(() => expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument());
  });
});

export default TestComponent;