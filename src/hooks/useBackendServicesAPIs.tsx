import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Reservation {
  id: string;
  date: string;
  time: string;
  partySize: number;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
}

const useBackendServicesAPIs = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ApiResponse<Reservation[]>>({
    data: null,
    error: null,
    loading: false,
  });
  const [inventory, setInventory] = useState<ApiResponse<InventoryItem[]>>({
    data: null,
    error: null,
    loading: false,
  });

  const fetchReservations = useCallback(async () => {
    setReservations({ data: null, error: null, loading: true });
    try {
      const response = await axios.get<Reservation[]>('/api/reservations', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setReservations({ data: response.data, error: null, loading: false });
    } catch (error) {
      setReservations({ data: null, error: error.message, loading: false });
    }
  }, [user]);

  const fetchInventory = useCallback(async () => {
    setInventory({ data: null, error: null, loading: true });
    try {
      const response = await axios.get<InventoryItem[]>('/api/inventory', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setInventory({ data: response.data, error: null, loading: false });
    } catch (error) {
      setInventory({ data: null, error: error.message, loading: false });
    }
  }, [user]);

  const createReservation = useCallback(async (reservation: Reservation) => {
    try {
      await axios.post('/api/reservations', reservation, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchReservations();
    } catch (error) {
      console.error('Error creating reservation:', error.message);
    }
  }, [user, fetchReservations]);

  const updateInventoryItem = useCallback(async (item: InventoryItem) => {
    try {
      await axios.put(`/api/inventory/${item.id}`, item, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchInventory();
    } catch (error) {
      console.error('Error updating inventory item:', error.message);
    }
  }, [user, fetchInventory]);

  return {
    reservations,
    inventory,
    fetchReservations,
    fetchInventory,
    createReservation,
    updateInventoryItem,
  };
};

export default useBackendServicesAPIs;