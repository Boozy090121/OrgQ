"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  getRoles, 
  getPersonnel, 
  getFactories, 
  getTimeline,
  getScenarios,
  getUserPreferences
} from '@/lib/firebase/firestore';

// Define the shape of our context
interface DataContextType {
  roles: any[];
  personnel: any[];
  factories: any[];
  timeline: any[];
  scenarios: any[];
  preferences: any;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

// Create the context with a default value
const DataContext = createContext<DataContextType>({
  roles: [],
  personnel: [],
  factories: [],
  timeline: [],
  scenarios: [],
  preferences: {},
  loading: true,
  error: null,
  refreshData: async () => {}
});

// Custom hook to use the data context
export const useData = () => useContext(DataContext);

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  const [factories, setFactories] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  // Function to fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, these would fetch from Firebase
      // For now, we'll use mock data
      
      // Mock roles data
      const mockRoles = [
        { id: '1', title: 'Quality Director', level: 'leadership', department: 'quality' },
        { id: '2', title: 'Systems Lead', level: 'leadership', department: 'systems' },
        { id: '3', title: 'Quality Engineer', level: 'specialist', department: 'quality' },
        { id: '4', title: 'Quality Technician', level: 'associate', department: 'quality' }
      ];
      
      // Mock personnel data
      const mockPersonnel = [
        { id: '1', name: 'John Doe', title: 'Senior Quality Manager', assignedRole: '1' },
        { id: '2', name: 'Jane Smith', title: 'Quality Engineer II', assignedRole: '3' },
        { id: '3', name: 'Bob Johnson', title: 'Quality Technician III', assignedRole: '4' }
      ];
      
      // Mock factories data
      const mockFactories = [
        { id: '1', name: 'Factory 1', location: 'East' },
        { id: '2', name: 'Factory 2', location: 'West' },
        { id: '3', name: 'Factory 3', location: 'North' }
      ];
      
      // Mock timeline data
      const mockTimeline = [
        { 
          id: '1', 
          title: 'Planning Phase', 
          startDate: '2025-01-01', 
          endDate: '2025-02-28',
          activities: [
            { id: '1-1', title: 'Requirements Gathering', description: 'Collect requirements from stakeholders' },
            { id: '1-2', title: 'Resource Planning', description: 'Plan resource allocation' }
          ]
        },
        { 
          id: '2', 
          title: 'Implementation Phase', 
          startDate: '2025-03-01', 
          endDate: '2025-06-30',
          activities: [
            { id: '2-1', title: 'Hiring', description: 'Hire new personnel' },
            { id: '2-2', title: 'Training', description: 'Train staff on new processes' }
          ]
        }
      ];
      
      // Mock scenarios data
      const mockScenarios = [
        { 
          id: '1', 
          name: 'Current State', 
          factory: '1', 
          workOrderVolume: 400,
          staffing: { leadership: 3, specialist: 10, associate: 12 },
          createdAt: new Date().toISOString()
        },
        { 
          id: '2', 
          name: 'Optimized State', 
          factory: '1', 
          workOrderVolume: 400,
          staffing: { leadership: 2, specialist: 12, associate: 15 },
          createdAt: new Date().toISOString()
        }
      ];
      
      // Mock user preferences
      const mockPreferences = {
        defaultFactory: '1',
        colorTheme: 'default',
        notifications: true,
        autoSave: true
      };
      
      setRoles(mockRoles);
      setPersonnel(mockPersonnel);
      setFactories(mockFactories);
      setTimeline(mockTimeline);
      setScenarios(mockScenarios);
      setPreferences(mockPreferences);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data when the component mounts or when the user changes
  useEffect(() => {
    fetchData();
  }, [user]);
  
  // The value that will be provided to consumers of this context
  const value = {
    roles,
    personnel,
    factories,
    timeline,
    scenarios,
    preferences,
    loading,
    error,
    refreshData: fetchData
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
