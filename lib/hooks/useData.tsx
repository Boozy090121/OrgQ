import { useState, useEffect } from 'react';
import { 
  getScenarios, 
  createScenario, 
  updateScenario as updateScenarioInDb, 
  deleteScenario as deleteScenarioFromDb,
  updateUserPreferences,
  getUserPreferences
} from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/hooks/useAuth';
import { Scenario } from '@/types';

export const useScenarios = () => {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      if (!user) {
        setScenarios([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedScenarios = await getScenarios(user.uid);
        setScenarios(fetchedScenarios);
        setError(null);
      } catch (err) {
        console.error('Error fetching scenarios:', err);
        setError('Failed to load scenarios');
      } finally {
        setLoading(false);
      }
    };

    fetchScenarios();
  }, [user]);

  const addScenario = async (scenario: Omit<Scenario, 'id'>) => {
    if (!user) return null;

    try {
      const scenarioWithUser = {
        ...scenario,
        userId: user.uid
      };
      
      const newScenarioId = await createScenario(scenarioWithUser);
      
      if (newScenarioId) {
        const newScenario = {
          id: newScenarioId,
          ...scenarioWithUser
        };
        
        setScenarios([...scenarios, newScenario]);
        return newScenarioId;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding scenario:', err);
      setError('Failed to add scenario');
      return null;
    }
  };

  const updateScenarioById = async (id: string, data: Partial<Scenario>) => {
    try {
      const success = await updateScenarioInDb(id, data);
      
      if (success) {
        setScenarios(scenarios.map(scenario => 
          scenario.id === id ? { ...scenario, ...data } : scenario
        ));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating scenario:', err);
      setError('Failed to update scenario');
      return false;
    }
  };

  const deleteScenarioById = async (id: string) => {
    try {
      const success = await deleteScenarioFromDb(id);
      
      if (success) {
        setScenarios(scenarios.filter(scenario => scenario.id !== id));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting scenario:', err);
      setError('Failed to delete scenario');
      return false;
    }
  };

  return {
    scenarios,
    loading,
    error,
    addScenario,
    updateScenario: updateScenarioById,
    deleteScenario: deleteScenarioById
  };
};

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        setPreferences({});
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userPreferences = await getUserPreferences(user.uid);
        setPreferences(userPreferences || {});
        setError(null);
      } catch (err) {
        console.error('Error fetching user preferences:', err);
        setError('Failed to load preferences');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  const savePreferences = async (newPreferences: Record<string, unknown>) => {
    if (!user) return false;

    try {
      const success = await updateUserPreferences(user.uid, newPreferences);
      
      if (success) {
        setPreferences(newPreferences);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences');
      return false;
    }
  };

  return {
    preferences,
    loading,
    error,
    savePreferences
  };
};
