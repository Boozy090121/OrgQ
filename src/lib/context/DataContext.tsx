"use client";

import { createContext, useContext, ReactNode } from 'react';
import {
  useRoles,
  usePersonnel,
  useFactories,
  usePhases, // Renamed from useTimeline
  useDepartments,
  useTasks,
  useClients,
  useScenarios,
  useResources, // Import the new hook
  useActivities, // Import the new hook
} from '@/lib/hooks/useFirestore';
import { db } from '@/lib/firebase/config'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, Timestamp, writeBatch } from 'firebase/firestore';
// import { useAuth } from '@/lib/hooks/useAuth'; // Unused

// Assuming useUserPreferences might be separate or not needed globally
// import { useUserPreferences } from '@/lib/hooks/useData'; 

// Import types (adjust paths if necessary)
import {
  Role,
  Personnel,
  Factory,
  Phase,
  Scenario,
  Department,
  Task,
  Client,
  Resource,
  Activity,
  TaskStatus, // Ensure TaskStatus is imported if used explicitly
  DepartmentType // Ensure DepartmentType is imported
} from '@/lib/types';

// Define base types for the hook return values
type BaseHookReturn<T, TCreate = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>> = {
  loading: boolean;
  error: string | null;
  [key: string]: T[] | boolean | string | null | ((...args: any[]) => Promise<any>); // Base properties
};

// Define specific hook return types incorporating mutation functions
type CrudFunctions<T, TCreate = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'userId'>> = {
  [`add${string}`]: (itemData: TCreate) => Promise<string>;
  [`update${string}`]: (id: string, data: Partial<T>) => Promise<void>;
  [`delete${string}`]: (id: string) => Promise<void>;
};

type UseRolesReturn = BaseHookReturn<Role> & { roles: Role[] } & CrudFunctions<Role, Omit<Role, 'id'>>;
type UsePersonnelReturn = BaseHookReturn<Personnel> & { personnel: Personnel[] } & CrudFunctions<Personnel> & {
  assignPersonnelToRole: (personnelId: string, roleId: string, factoryId: string) => Promise<void>;
  unassignPersonnel: (personnelId: string) => Promise<void>;
};
type UseFactoriesReturn = BaseHookReturn<Factory> & { factories: Factory[] } & CrudFunctions<Factory>;
type UsePhasesReturn = BaseHookReturn<Phase> & { phases: Phase[] } & CrudFunctions<Phase>;
type UseScenariosReturn = BaseHookReturn<Scenario> & { scenarios: Scenario[] } & CrudFunctions<Scenario>;
type UseDepartmentsReturn = BaseHookReturn<Department> & { departments: Department[] } & CrudFunctions<Department, Omit<Department, 'id'>>;
type UseTasksReturn = BaseHookReturn<Task> & { tasks: Task[] } & CrudFunctions<Task>;
type UseClientsReturn = BaseHookReturn<Client> & { clients: Client[] } & CrudFunctions<Client>;
type UseResourcesReturn = BaseHookReturn<Resource> & { resources: Resource[] } & CrudFunctions<Resource>;
type UseActivitiesReturn = BaseHookReturn<Activity> & { activities: Activity[] } & CrudFunctions<Activity, Omit<Activity, 'id'> & { phaseId: string }>; // Specify create type for Activity


// Define the shape of our context using the specific return types
interface DataContextType extends 
  Pick<UseRolesReturn, 'roles' | 'addRole' | 'updateRole' | 'deleteRole'>,
  Pick<UsePersonnelReturn, 'personnel' | 'addPersonnel' | 'updatePersonnel' | 'deletePersonnel' | 'assignPersonnelToRole' | 'unassignPersonnel'>,
  Pick<UseFactoriesReturn, 'factories' | 'addFactory' | 'updateFactory' | 'deleteFactory'>,
  Pick<UsePhasesReturn, 'phases' | 'addPhase' | 'updatePhase' | 'deletePhase'>,
  Pick<UseScenariosReturn, 'scenarios' | 'addScenario' | 'updateScenario' | 'deleteScenario'>,
  Pick<UseDepartmentsReturn, 'departments' | 'addDepartment' | 'updateDepartment' | 'deleteDepartment'>,
  Pick<UseTasksReturn, 'tasks' | 'addTask' | 'updateTask' | 'deleteTask'>,
  Pick<UseClientsReturn, 'clients' | 'addClient' | 'updateClient' | 'deleteClient'>,
  Pick<UseResourcesReturn, 'resources' | 'addResource' | 'updateResource' | 'deleteResource'>,
  Pick<UseActivitiesReturn, 'activities' | 'addActivity' | 'updateActivity' | 'deleteActivity'>
{
  loading: boolean; // Combined loading state
  error: string | null; // Combined error state
}

// Create the context with a default value
const DataContext = createContext<DataContextType>({
  // Default data arrays
  roles: [],
  personnel: [],
  factories: [],
  phases: [],
  scenarios: [],
  departments: [],
  tasks: [],
  clients: [],
  resources: [],
  activities: [],
  // Default states
  loading: true,
  error: null,
  // Placeholder functions matching the expected signatures
  addRole: async () => { throw new Error('Add Role not implemented'); },
  updateRole: async () => { throw new Error('Update Role not implemented'); },
  deleteRole: async () => { throw new Error('Delete Role not implemented'); },
  addPersonnel: async () => { throw new Error('Add Personnel not implemented'); },
  updatePersonnel: async () => { throw new Error('Update Personnel not implemented'); },
  deletePersonnel: async () => { throw new Error('Delete Personnel not implemented'); },
  assignPersonnelToRole: async () => { throw new Error('Assign Personnel not implemented'); },
  unassignPersonnel: async () => { throw new Error('Unassign Personnel not implemented'); },
  addFactory: async () => { throw new Error('Add Factory not implemented'); },
  updateFactory: async () => { throw new Error('Update Factory not implemented'); },
  deleteFactory: async () => { throw new Error('Delete Factory not implemented'); },
  addPhase: async () => { throw new Error('Add Phase not implemented'); },
  updatePhase: async () => { throw new Error('Update Phase not implemented'); },
  deletePhase: async () => { throw new Error('Delete Phase not implemented'); },
  addScenario: async () => { throw new Error('Add Scenario not implemented'); },
  updateScenario: async () => { throw new Error('Update Scenario not implemented'); },
  deleteScenario: async () => { throw new Error('Delete Scenario not implemented'); },
  addDepartment: async () => { throw new Error('Add Department not implemented'); },
  updateDepartment: async () => { throw new Error('Update Department not implemented'); },
  deleteDepartment: async () => { throw new Error('Delete Department not implemented'); },
  addTask: async () => { throw new Error('Add Task not implemented'); },
  updateTask: async () => { throw new Error('Update Task not implemented'); },
  deleteTask: async () => { throw new Error('Delete Task not implemented'); },
  addClient: async () => { throw new Error('Add Client not implemented'); },
  updateClient: async () => { throw new Error('Update Client not implemented'); },
  deleteClient: async () => { throw new Error('Delete Client not implemented'); },
  addResource: async () => { throw new Error('Add Resource not implemented'); },
  updateResource: async () => { throw new Error('Update Resource not implemented'); },
  deleteResource: async () => { throw new Error('Delete Resource not implemented'); },
  addActivity: async () => { throw new Error('Add Activity not implemented'); },
  updateActivity: async () => { throw new Error('Update Activity not implemented'); },
  deleteActivity: async () => { throw new Error('Delete Activity not implemented'); },
});

// Custom hook to use the data context
export const useData = () => useContext(DataContext);

// Provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Use the individual hooks
  const rolesState = useRoles() as UseRolesReturn;
  const personnelState = usePersonnel() as UsePersonnelReturn;
  const factoriesState = useFactories() as UseFactoriesReturn;
  const phasesState = usePhases() as UsePhasesReturn;
  const departmentsState = useDepartments() as UseDepartmentsReturn;
  const tasksState = useTasks() as UseTasksReturn;
  const clientsState = useClients() as UseClientsReturn;
  const scenariosState = useScenarios() as UseScenariosReturn;
  const resourcesState = useResources() as UseResourcesReturn;
  const activitiesState = useActivities() as UseActivitiesReturn;
  
  // Combine loading states
  const loading = [
    rolesState,
    personnelState,
    factoriesState,
    phasesState,
    departmentsState,
    tasksState,
    clientsState,
    scenariosState,
    resourcesState,
    activitiesState
  ].some(state => state.loading);

  // Combine error states
  const error = [
    rolesState,
    personnelState,
    factoriesState,
    phasesState,
    departmentsState,
    tasksState,
    clientsState,
    scenariosState,
    resourcesState,
    activitiesState
  ].find(state => state.error)?.error || null;

  // The value that will be provided
  // Now correctly typed based on the specific hook return types
  const value: DataContextType = {
    roles: rolesState.roles,
    personnel: personnelState.personnel,
    factories: factoriesState.factories,
    phases: phasesState.phases,
    scenarios: scenariosState.scenarios,
    departments: departmentsState.departments,
    tasks: tasksState.tasks,
    clients: clientsState.clients,
    resources: resourcesState.resources,
    activities: activitiesState.activities,
    loading,
    error,
    // Pass down the functions from the hooks
    addRole: rolesState.addRole,
    updateRole: rolesState.updateRole,
    deleteRole: rolesState.deleteRole,
    addPersonnel: personnelState.addPersonnel,
    updatePersonnel: personnelState.updatePersonnel,
    deletePersonnel: personnelState.deletePersonnel,
    assignPersonnelToRole: personnelState.assignPersonnelToRole,
    unassignPersonnel: personnelState.unassignPersonnel,
    addFactory: factoriesState.addFactory,
    updateFactory: factoriesState.updateFactory,
    deleteFactory: factoriesState.deleteFactory,
    addPhase: phasesState.addPhase,
    updatePhase: phasesState.updatePhase,
    deletePhase: phasesState.deletePhase,
    addScenario: scenariosState.addScenario,
    updateScenario: scenariosState.updateScenario,
    deleteScenario: scenariosState.deleteScenario,
    addDepartment: departmentsState.addDepartment,
    updateDepartment: departmentsState.updateDepartment,
    deleteDepartment: departmentsState.deleteDepartment,
    addTask: tasksState.addTask,
    updateTask: tasksState.updateTask,
    deleteTask: tasksState.deleteTask,
    addClient: clientsState.addClient,
    updateClient: clientsState.updateClient,
    deleteClient: clientsState.deleteClient,
    addResource: resourcesState.addResource,
    updateResource: resourcesState.updateResource,
    deleteResource: resourcesState.deleteResource,
    addActivity: activitiesState.addActivity,
    updateActivity: activitiesState.updateActivity,
    deleteActivity: activitiesState.deleteActivity,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 