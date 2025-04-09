"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './useAuth'; // Assuming useAuth is in the same hooks directory
import {
  getRoles,
  createRole,
  updateRole as updateRoleFirestore,
  deleteRole as deleteRoleFirestore,
  getPersonnel,
  createPersonnel,
  updatePersonnel as updatePersonnelFirestore,
  deletePersonnel as deletePersonnelFirestore,
  assignPersonnelToRole as assignPersonnelToRoleFirestore,
  unassignPersonnel as unassignPersonnelFirestore,
  getFactories,
  createFactory,
  updateFactory as updateFactoryFirestore,
  deleteFactory as deleteFactoryFirestore,
  getPhases,
  createPhase,
  updatePhase as updatePhaseFirestore,
  deletePhase as deletePhaseFirestore,
  getActivities,
  createActivity,
  updateActivity as updateActivityFirestore,
  deleteActivity as deleteActivityFirestore,
  getDepartments,
  createDepartment,
  updateDepartment as updateDepartmentFirestore,
  deleteDepartment as deleteDepartmentFirestore,
  getTasks,
  createTask,
  updateTask as updateTaskFirestore,
  deleteTask as deleteTaskFirestore,
  getClients,
  createClient,
  updateClient as updateClientFirestore,
  deleteClient as deleteClientFirestore,
  getScenarios,
  createScenario,
  updateScenario as updateScenarioFirestore,
  deleteScenario as deleteScenarioFirestore,
  getResources,
  createResource,
  updateResource as updateResourceFirestore,
  deleteResource as deleteResourceFirestore,
} from '@/lib/firebase/firestore'; // Assuming firestore functions are here
import {
  Role,
  Personnel,
  Factory,
  Phase,
  Activity,
  Department,
  Task,
  Client,
  DepartmentType,
  Scenario,
  Resource
} from '@/lib/types'; // Adjust path if needed
import { collection, query, where, onSnapshot, Query, WhereFilterOp, QuerySnapshot, DocumentData, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Helper function to recursively convert Firestore Timestamps to JS Dates
function convertTimestamps(data: any): any {
  if (data instanceof Timestamp) {
    return data.toDate(); // Convert Timestamp to JS Date
  }
  if (Array.isArray(data)) {
    return data.map(convertTimestamps); // Recursively convert array elements
  }
  if (data !== null && typeof data === 'object') {
    const convertedObject: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        convertedObject[key] = convertTimestamps(data[key]); // Recursively convert object properties
      }
    }
    return convertedObject;
  }
  return data; // Return non-timestamp, non-object/array values as is
}

// Reusable hook for subscribing to a Firestore collection with optional filtering
export function useFirestoreCollection<T extends { id: string }>(
  collectionName: string, 
  // Filter definition (optional)
  filterConfig?: {
    field: string;
    operator: WhereFilterOp; // Use the imported Firestore operator type
    value: unknown;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Check if authentication is still loading
    if (authLoading) {
      // Still waiting for auth status, keep loading
      setLoading(true);
      return;
    }

    // If a filter is provided AND its value is null or undefined, stop early.
    // This prevents invalid queries, e.g., trying to filter by factoryId when it's undefined.
    if (filterConfig && (filterConfig.value === null || filterConfig.value === undefined)) {
        console.log(`Filter value for '${filterConfig.field}' is null or undefined. Returning empty data for collection '${collectionName}'.`);
        setData([]);
        setLoading(false);
        setError(null);
        return; // Exit early to prevent Firestore query with invalid filter
    }

    // Proceed with Firestore query setup only if filter values (if provided) are valid
    setLoading(true);
    const collectionRef = collection(db, collectionName);
    let q: Query; // Define Query type explicitly if needed, depends on 'firebase/firestore' imports

    // Apply filter if provided (we already know filter.value is not null/undefined here)
    if (filterConfig) {
      q = query(collectionRef, where(filterConfig.field, filterConfig.operator, filterConfig.value));
    } else {
      q = query(collectionRef);
    }
    
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const items: T[] = [];
      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        if (!rawData) {
           console.warn(`Document ${doc.id} in ${collectionName} has no data.`);
           return;
        }
        const docData = convertTimestamps(rawData) as Omit<T, 'id'>;
        items.push({ id: doc.id, ...docData } as T);
      });
      
      setData(items); 
      setLoading(false);
      setError(null); 
    }, (err) => { // This handles listener errors (e.g., permissions)
      console.error(`Error fetching ${collectionName}:`, err);
      setError(`Failed to load ${collectionName}. Permission issue?`);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, filterConfig?.field, filterConfig?.operator, filterConfig?.value, user, authLoading]); // Ensure all dependencies, including auth state, are listed

  return { data, loading, error };
}

// Helper function to generate singular name (e.g., "factories" -> "Factory")
function getSingularName(name: string): string {
  const singular = name.endsWith('ies') ? name.slice(0, -3) + 'y' : 
                  name.endsWith('s') ? name.slice(0, -1) : name;
  return singular.charAt(0).toUpperCase() + singular.slice(1);
}

// Helper function to apply the refactoring pattern
// Takes the collection name, type T, and specific CRUD functions
function createSpecificHook<T extends { id: string }, TCreateData = Omit<T, 'id'>>(
  collectionName: string,
  createFn: (data: TCreateData) => Promise<string>,
  updateFn: (id: string, data: Partial<T>) => Promise<void>,
  deleteFn: (id: string) => Promise<void>,
  // Optional extra functions (like assign/unassign for personnel)
  extraFunctions?: Record<string, (...args: any[]) => Promise<any>>
) {
  return () => {
    const { user, loading: authLoading } = useAuth();
    const { data: initialData, loading: collectionLoading, error: collectionError } = 
      useFirestoreCollection<T>(collectionName, { field: 'userId', operator: '==', value: user?.uid });

    const [localData, setLocalData] = useState<T[]>([]);
    const [hookError, setHookError] = useState<string | null>(null);

    useEffect(() => {
      if (initialData) {
        setLocalData(initialData);
      }
      if (!collectionError) {
          setHookError(null);
      }
    }, [initialData, collectionError]);

    const loading = authLoading || collectionLoading;
    const error = collectionError || hookError;

    const addItem = useCallback(async (itemData: TCreateData) => {
      console.log(`[${collectionName}] addItem called. User UID:`, user?.uid); // Log user UID
      if (!user?.uid) {
          console.error(`[${collectionName}] Cannot add item: User UID is missing.`);
          setHookError(`Cannot add ${collectionName}: User not properly authenticated.`);
          throw new Error(`Cannot add ${collectionName}: User not properly authenticated.`);
      }
      try {
        setHookError(null);
        // Ensure userId is added if needed by Firestore rules/createFn
        const dataWithUser = { ...itemData, userId: user.uid }; // Use user.uid directly after check
        console.log(`[${collectionName}] Data being sent to createFn:`, dataWithUser); // Log data
        
        const newId = await createFn(dataWithUser as TCreateData); // Pass data potentially including userId
        console.log(`[${collectionName}] Item added successfully with ID:`, newId);
        
        return newId;
      } catch (err) {
        console.error(`[${collectionName}] Error in addItem catch block:`, err); // Enhanced logging
        const message = `Failed to add ${collectionName}: ${err instanceof Error ? err.message : String(err)}`;
        setHookError(message);
        throw new Error(message);
      }
    // Ensure dependencies are correct: collectionName, createFn, user?.uid
    // useState setters (setHookError, setLocalData) don't need to be dependencies
    }, [collectionName, createFn, user?.uid]); // Added missing dependencies explicitly

    const updateItem = useCallback(async (id: string, data: Partial<T>) => {
      try {
        setHookError(null);
        await updateFn(id, data);
        setLocalData(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
      } catch (err) {
        console.error(`Error updating ${collectionName} ${id}:`, err);
        const message = `Failed to update ${collectionName} ${id}: ${err instanceof Error ? err.message : String(err)}`;
        setHookError(message);
        throw new Error(message);
      }
    // Ensure dependencies are correct
    }, [collectionName, updateFn]); 

    const deleteItem = useCallback(async (id: string) => {
      try {
        setHookError(null);
        await deleteFn(id);
        setLocalData(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error(`Error deleting ${collectionName} ${id}:`, err);
        const message = `Failed to delete ${collectionName} ${id}: ${err instanceof Error ? err.message : String(err)}`;
        setHookError(message);
        throw new Error(message);
      }
    // Ensure dependencies are correct
    }, [collectionName, deleteFn]);

    // Process extra functions, ensuring local state updates if necessary
    const processedExtraFunctions = {} as Record<string, (...args: any[]) => Promise<any>>;
    if (extraFunctions) {
      for (const key in extraFunctions) {
        processedExtraFunctions[key] = async (...args: any[]) => {
          try {
            setHookError(null);
            const result = await extraFunctions[key](...args);
            // Manually update localData based on the extra function's effect
            if (key === 'assignPersonnelToRole') {
              const [personnelId, roleId, factoryId] = args;
              setLocalData(prev => prev.map(p => 
                 p.id === personnelId ? { ...p, assignedRole: roleId, assignedFactory: factoryId } as T : p
              ));
            } else if (key === 'unassignPersonnel') {
              const [personnelId] = args;
               setLocalData(prev => prev.map(p => 
                 p.id === personnelId ? { ...p, assignedRole: undefined, assignedFactory: undefined } as T : p
              ));
            }
            // Add similar logic for other potential extra functions (e.g., assignTaskDependency)
            return result;
          } catch (err) {
             console.error(`Error executing ${key}:`, err);
             const message = `Failed executing ${key}: ${err instanceof Error ? err.message : String(err)}`;
             setHookError(message);
             throw new Error(message);
          }
        };
      }
    }

    const singularName = getSingularName(collectionName);

    // Return structure: { [collectionName]: localData, loading, error, add..., update..., delete..., ...extra } 
    return {
      [collectionName]: localData,
      loading,
      error,
      // Use correct singular name for function keys
      [`add${singularName}`]: addItem,
      [`update${singularName}`]: updateItem,
      [`delete${singularName}`]: deleteItem,
      ...processedExtraFunctions
    };
  };
}

// Apply the pattern to all hooks
export const useRoles = createSpecificHook<Role>('roles', createRole, updateRoleFirestore, deleteRoleFirestore);
export const usePersonnel = createSpecificHook<Personnel>('personnel', createPersonnel, updatePersonnelFirestore, deletePersonnelFirestore, { assignPersonnelToRole: assignPersonnelToRoleFirestore, unassignPersonnel: unassignPersonnelFirestore });
export const useFactories = createSpecificHook<Factory>('factories', createFactory, updateFactoryFirestore, deleteFactoryFirestore);
export const usePhases = createSpecificHook<Phase>('phases', createPhase, updatePhaseFirestore, deletePhaseFirestore);
export const useActivities = createSpecificHook<Activity>('activities', createActivity, updateActivityFirestore, deleteActivityFirestore);
export const useDepartments = createSpecificHook<Department>('departments', createDepartment, updateDepartmentFirestore, deleteDepartmentFirestore);
export const useTasks = createSpecificHook<Task>('tasks', createTask, updateTaskFirestore, deleteTaskFirestore);
export const useClients = createSpecificHook<Client>('clients', createClient, updateClientFirestore, deleteClientFirestore);
export const useScenarios = createSpecificHook<Scenario>('scenarios', createScenario, updateScenarioFirestore, deleteScenarioFirestore);
export const useResources = createSpecificHook<Resource>('resources', createResource, updateResourceFirestore, deleteResourceFirestore); 