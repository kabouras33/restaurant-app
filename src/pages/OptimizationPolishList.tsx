import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Restaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
}

const OptimizationPolishList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, [currentPage, searchTerm]);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/restaurants', {
        params: { page: currentPage, search: searchTerm },
      });
      setRestaurants(response.data.restaurants);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: number) => {
    navigate(`/restaurants/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      setError('Failed to delete restaurant. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant List</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 mb-4 w-full"
      />
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Location</th>
              <th className="py-2">Cuisine</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id}>
                <td className="border px-4 py-2">{restaurant.name}</td>
                <td className="border px-4 py-2">{restaurant.location}</td>
                <td className="border px-4 py-2">{restaurant.cuisine}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(restaurant.id)}
                    className="bg-blue-500 text-white px-2 py-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant.id)}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptimizationPolishList;