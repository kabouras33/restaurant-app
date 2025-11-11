import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface RestaurantDetail {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  description: string;
  imageUrl: string;
}

const OptimizationPolishDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        setError('Failed to fetch restaurant details.');
        toast.error('Error fetching restaurant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      await axios.delete(`/api/restaurants/${id}`);
      toast.success('Restaurant deleted successfully.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Error deleting restaurant.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{restaurant?.name}</h1>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </header>
      <div className="flex flex-col md:flex-row">
        <img
          src={restaurant?.imageUrl}
          alt={restaurant?.name}
          className="w-full md:w-1/2 h-64 object-cover rounded"
        />
        <div className="md:ml-4 mt-4 md:mt-0">
          <p className="text-lg"><strong>Location:</strong> {restaurant?.location}</p>
          <p className="text-lg"><strong>Cuisine:</strong> {restaurant?.cuisine}</p>
          <p className="mt-2">{restaurant?.description}</p>
        </div>
      </div>
      <footer className="mt-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </footer>
    </div>
  );
};

export default OptimizationPolishDetail;