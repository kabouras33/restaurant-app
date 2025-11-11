import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Reservation {
  id: number;
  name: string;
  date: string;
  time: string;
  guests: number;
}

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

const Dashboard: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservationsResponse, inventoryResponse] = await Promise.all([
          axios.get('/api/reservations'),
          axios.get('/api/inventory'),
        ]);
        setReservations(reservationsResponse.data);
        setInventory(inventoryResponse.data);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteReservation = async (id: number) => {
    try {
      await axios.delete(`/api/reservations/${id}`);
      setReservations(reservations.filter(reservation => reservation.id !== id));
    } catch (err) {
      setError('Failed to delete reservation. Please try again.');
    }
  };

  const handleDeleteInventoryItem = async (id: number) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      setInventory(inventory.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete inventory item. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Reservations</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Date</th>
              <th className="py-2">Time</th>
              <th className="py-2">Guests</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td className="border px-4 py-2">{reservation.name}</td>
                <td className="border px-4 py-2">{reservation.date}</td>
                <td className="border px-4 py-2">{reservation.time}</td>
                <td className="border px-4 py-2">{reservation.guests}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteReservation(reservation.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Inventory</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Unit</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.quantity}</td>
                <td className="border px-4 py-2">{item.unit}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteInventoryItem(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;