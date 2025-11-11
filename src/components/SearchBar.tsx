import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface SearchBarProps {
  onSearchResults: (results: any[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchResults }) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSearchResults = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      onSearchResults(response.data);
    } catch (err) {
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [onSearchResults]);

  useEffect(() => {
    if (query.length > 2) {
      const handler = setTimeout(() => {
        fetchSearchResults(query);
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [query, fetchSearchResults]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="search"
        value={query}
        onChange={handleInputChange}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search for restaurants..."
        aria-label="Search for restaurants"
      />
      {loading && <div className="absolute right-2 top-2 spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full" />}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default SearchBar;