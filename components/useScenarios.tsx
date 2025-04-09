import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Scenario } from '@/types';

export const useScenarios = (factoryId: string = '') => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch scenarios
  const fetchScenarios = async () => {
    setLoading(true);
    try {
      let scenariosQuery = collection(db, 'scenarios');
      
      // If factory ID is provided, filter by factory
      if (factoryId) {
        scenariosQuery = query(
          collection(db, 'scenarios'),
          where('factoryId', '==', factoryId)
        );
      }
      
      const querySnapshot = await getDocs(scenariosQuery);
      const scenariosData: Scenario[] = [];
      
      querySnapshot.forEach((doc) => {
        scenariosData.push({
          id: doc.id,
          ...doc.data()
        } as Scenario);
      });
      
      // Sort by creation date (newest first)
      scenariosData.sort((a, b) => b.createdAt - a.createdAt);
      
      setScenarios(scenariosData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching scenarios:', err);
      setError('Failed to fetch scenarios');
      setLoading(false);
    }
  };

  // Add a new scenario
  const addScenario = async (scenario: Omit<Scenario, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'scenarios'), {
        ...scenario,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      
      const newScenario = {
        id: docRef.id,
        ...scenario
      } as Scenario;
      
      setScenarios([newScenario, ...scenarios]);
      return newScenario;
    } catch (err) {
      console.error('Error adding scenario:', err);
      setError('Failed to add scenario');
      throw err;
    }
  };

  // Update an existing scenario
  const updateScenario = async (id: string, data: Partial<Scenario>) => {
    try {
      const scenarioRef = doc(db, 'scenarios', id);
      await updateDoc(scenarioRef, {
        ...data,
        updatedAt: Date.now()
      });
      
      setScenarios(scenarios.map(scenario => 
        scenario.id === id ? { ...scenario, ...data, updatedAt: Date.now() } : scenario
      ));
    } catch (err) {
      console.error('Error updating scenario:', err);
      setError('Failed to update scenario');
      throw err;
    }
  };

  // Delete a scenario
  const deleteScenario = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'scenarios', id));
      setScenarios(scenarios.filter(scenario => scenario.id !== id));
    } catch (err) {
      console.error('Error deleting scenario:', err);
      setError('Failed to delete scenario');
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchScenarios();
  }, [factoryId]);

  return {
    scenarios,
    loading,
    error,
    fetchScenarios,
    addScenario,
    updateScenario,
    deleteScenario
  };
};
