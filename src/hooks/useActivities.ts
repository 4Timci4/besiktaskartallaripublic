import { useState, useEffect } from 'react';
import { Activity, activitiesApi } from '../utils/supabase';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await activitiesApi.getAll();
        setActivities(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    // İlk yükleme
    loadActivities();

    // Gerçek zamanlı güncellemeler için subscription
    const subscription = activitiesApi.subscribeToChanges((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      setActivities(current => {
        switch (eventType) {
          case 'INSERT':
            return [...current, newRecord].sort((a, b) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
          case 'UPDATE':
            return current.map(item => 
              item.id === newRecord.id ? newRecord : item
            );
          case 'DELETE':
            return current.filter(item => item.id !== oldRecord.id);
          default:
            return current;
        }
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { activities, loading, error };
};