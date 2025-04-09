"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
// Import the individual hooks that contain fetch + mutations
import { 
  useRoles, 
  usePersonnel, 
  useFactories,
  useTimeline,
  useDepartments,
  useTasks,
  useClients
} from '@/lib/hooks/useFirestore'; 
// Assuming useScenarios and useUserPreferences might be better off separate or integrated if needed globally
import { useScenarios } from '@/lib/hooks/useData'; // Keep this if scenarios are truly global
import { useUserPreferences } from '@/lib/hooks/useData'; // Keep this if preferences are truly global

// Import types (adjust paths if necessary)
import { Role, Personnel, Factory, Phase, Activity, Scenario, Department, Task, DepartmentType, Client } from '@/lib'; // Added Department, Task, DepartmentType, Client

// Define the shape of our context, including mutation functions
interface DataContextType {
  roles: Role[];
  personnel: Personnel[];
  factories: Factory[];
  timeline: Phase[]; // Added timeline
  scenarios: Scenario[]; // From useScenarios
  preferences: any; // From useUserPreferences
  departments: Department[]; // Added departments
  tasks: Task[]; // Added tasks
  clients: Client[]; // Added clients
  loading: boolean;
  error: string | null;
  // Role Mutations
  addRole: (role: Omit<Role, 'id'>) => Promise<string | null>;
  updateRole: (id: string, data: Partial<Role>) => Promise<boolean>;
  deleteRole: (id: string) => Promise<boolean>;
  // Personnel Mutations
  addPersonnel: (person: Omit<Personnel, 'id'>) => Promise<string | null>;
  updatePersonnel: (id: string, data: Partial<Personnel>) => Promise<boolean>;
  deletePersonnel: (id: string) => Promise<boolean>;
  assignPersonnelToRole: (personnelId: string, roleId: string, factoryId: string) => Promise<boolean>;
  unassignPersonnelFromRole: (personnelId: string) => Promise<boolean>; // Renamed from 'unassign' for clarity
  // Factory Mutations
  addFactory: (factory: Omit<Factory, 'id'>) => Promise<string | null>;
  updateFactory: (id: string, data: Partial<Factory>) => Promise<boolean>;
  deleteFactory: (id: string) => Promise<boolean>;
  // Timeline Mutations (Add if needed - Assuming Phase/Activity updates)
  addPhase: (phase: Omit<Phase, 'id'>) => Promise<string | null>; // Example
  updatePhase: (id: string, data: Partial<Phase>) => Promise<boolean>; // Example
  deletePhase: (id: string) => Promise<boolean>; // Example
  addActivity: (phaseId: string, activity: Omit<Activity, 'id'>) => Promise<string | null>; // Example
  updateActivity: (activityId: string, data: Partial<Activity>) => Promise<boolean>; // Example
  deleteActivity: (activityId: string) => Promise<boolean>; // Example
  // Scenario Mutations
  addScenario: (scenario: Omit<Scenario, 'id'>) => Promise<string | null>; 
  updateScenario: (id: string, data: Partial<Scenario>) => Promise<boolean>;
  deleteScenario: (id: string) => Promise<boolean>;
  // Department Mutations
  addDepartment: (dept: Department) => Promise<boolean>; // Corrected signature
  updateDepartment: (id: DepartmentType, data: Partial<Department>) => Promise<boolean>; 
  deleteDepartment: (id: DepartmentType) => Promise<boolean>; 
  // Task Mutations
  addTask: (task: Omit<Task, 'id'>) => Promise<string | null>;
  updateTask: (id: string, data: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  // Client Mutations
  addClient: (client: Omit<Client, 'id'>) => Promise<string | null>;
  updateClient: (id: string, data: Partial<Client>) => Promise<boolean>;
  deleteClient: (id: string) => Promise<boolean>;
  // Scenario/Preferences Mutations are likely handled by their own hooks/context if complex
  refreshData: () => Promise<void>; // Optional: might not be needed if hooks refresh automatically
}

// Create the context with a default value matching the new type
const DataContext = createContext<DataContextType>({
  roles: [],
  personnel: [],
  factories: [],
  timeline: [], // Added default timeline
  scenarios: [],
  preferences: {},
  departments: [], // Added default departments
  tasks: [], // Added default tasks
  clients: [], // Added default clients
  loading: true,
  error: null,
  // Default stubs for functions
  addRole: async () => null,
  updateRole: async () => false,
  deleteRole: async () => false,
  addPersonnel: async () => null,
  updatePersonnel: async () => false,
  deletePersonnel: async () => false,
  assignPersonnelToRole: async () => false,
  unassignPersonnelFromRole: async () => false,
  // Factory stubs
  addFactory: async () => null,
  updateFactory: async () => false,
  deleteFactory: async () => false,
  // Timeline stubs
  addPhase: async () => null,
  updatePhase: async () => false,
  deletePhase: async () => false,
  addActivity: async () => null,
  updateActivity: async () => false,
  deleteActivity: async () => false,
  // Scenario stubs
  addScenario: async () => null,
  updateScenario: async () => false,
  deleteScenario: async () => false,
  // Department stubs
  addDepartment: async () => false, // Corrected default
  updateDepartment: async () => false,
  deleteDepartment: async () => false,
  // Task stubs
  addTask: async () => null,
  updateTask: async () => false,
  deleteTask: async () => false,
  // Client stubs
  addClient: async () => null,
  updateClient: async () => false,
  deleteClient: async () => false,
  refreshData: async () => {},
});

// Custom hook to use the data context
export const useData = () => useContext(DataContext);

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Auth might influence data fetching

  // Use the individual hooks
  const { roles, loading: loadingRoles, error: errorRoles, addRole, updateRole, deleteRole } = useRoles();
  const { personnel, loading: loadingPersonnel, error: errorPersonnel, addPersonnel, updatePersonnel, deletePersonnel, assignToRole, unassign } = usePersonnel();
  const { factories, loading: loadingFactories, error: errorFactories, addFactory, updateFactory, deleteFactory } = useFactories();
  const { phases: timeline, activities, loading: loadingTimeline, error: errorTimeline, addPhase, updatePhase, deletePhase, addActivity, updateActivity, deleteActivity } = useTimeline(); 
  const { scenarios, loading: loadingScenarios, error: errorScenarios, addScenario, updateScenario, deleteScenario } = useScenarios(); 
  const { preferences, loading: loadingPreferences, error: errorPreferences } = useUserPreferences(); // Keep using separate hook if desired

  // --- Use Actual Hooks for Departments, Tasks, and Clients ---
  const { departments, loading: loadingDepartments, error: errorDepartments, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const { tasks, loading: loadingTasks, error: errorTasks, addTask, updateTask, deleteTask } = useTasks();
  const { clients, loading: loadingClients, error: errorClients, addClient, updateClient, deleteClient } = useClients(); // Added useClients call
  // --- End Hook Calls ---


  // Combine loading states
  const loading = loadingRoles || loadingPersonnel || loadingFactories || loadingTimeline || loadingScenarios || loadingPreferences || loadingDepartments || loadingTasks || loadingClients; // Added clients loading

  // Combine error states (simplified - take the first error)
  const error = errorRoles || errorPersonnel || errorFactories || errorTimeline || errorScenarios || errorPreferences || errorDepartments || errorTasks || errorClients; // Added clients errors

  // Mock refresh function (replace if individual hooks need manual refresh)
  const refreshData = useCallback(async () => {
    console.log("Refreshing data...");
    // In a real app, you might trigger refresh in individual hooks if needed
    // Or if hooks depend on `user`, they might refresh automatically
  }, []);

  // The value that will be provided to consumers of this context
  const value: DataContextType = {
    roles,
    personnel,
    factories,
    timeline, // Added timeline
    scenarios,
    preferences,
    departments, // Added departments
    tasks, // Added tasks
    clients, // Added clients
    loading,
    error,
    // Pass down the functions from the hooks
    addRole,
    updateRole,
    deleteRole,
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    assignPersonnelToRole: assignToRole, // Map assignToRole from usePersonnel
    unassignPersonnelFromRole: unassign, // Map unassign from usePersonnel
    // Factory functions
    addFactory,
    updateFactory,
    deleteFactory,
    // Timeline functions
    addPhase,
    updatePhase,
    deletePhase,
    addActivity,
    updateActivity,
    deleteActivity,
    // Scenario functions
    addScenario,
    updateScenario,
    deleteScenario,
    // Department functions
    addDepartment,
    updateDepartment,
    deleteDepartment,
    // Task functions
    addTask,
    updateTask,
    deleteTask,
    // Client functions
    addClient,
    updateClient,
    deleteClient,
    refreshData 
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
