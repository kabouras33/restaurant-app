import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

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
}

const useBackendServicesAPIs = () => {
  const { user } = useAuth();

  const fetchReservations = useCallback(async (): Promise<ApiResponse<Reservation[]>> => {
    const [data, setData] = useState<Reservation[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    setLoading(true);
    try {
      const response = await axios.get('/api/reservations', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }

    return { data, error, loading };
  }, [user]);

  const createReservation = useCallback(async (reservation: Omit<Reservation, 'id'>): Promise<ApiResponse<Reservation>> => {
    const [data, setData] = useState<Reservation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    setLoading(true);
    try {
      const response = await axios.post('/api/reservations', reservation, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setData(response.data);
    } catch (err) {
      setError('Failed to create reservation');
    } finally {
      setLoading(false);
    }

    return { data, error, loading };
  }, [user]);

  const fetchInventory = useCallback(async (): Promise<ApiResponse<InventoryItem[]>> => {
    const [data, setData] = useState<InventoryItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    setLoading(true);
    try {
      const response = await axios.get('/api/inventory', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }

    return { data, error, loading };
  }, [user]);

  const updateInventoryItem = useCallback(async (item: InventoryItem): Promise<ApiResponse<InventoryItem>> => {
    const [data, setData] = useState<InventoryItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    setLoading(true);
    try {
      const response = await axios.put(`/api/inventory/${item.id}`, item, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setData(response.data);
    } catch (err) {
      setError('Failed to update inventory item');
    } finally {
      setLoading(false);
    }

    return { data, error, loading };
  }, [user]);

  return {
    fetchReservations,
    createReservation,
    fetchInventory,
    updateInventoryItem,
  };
};

export default useBackendServicesAPIs;