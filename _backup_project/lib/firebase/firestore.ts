import { auth, db } from './config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  addDoc,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { Role, Personnel, Factory, Phase, Budget, Scenario, Activity, Department, Task, DepartmentType, Client } from '@/lib';

// Roles
export const getRoles = async (): Promise<Role[]> => {
  try {
    const rolesCollection = collection(db, 'roles');
    const rolesSnapshot = await getDocs(rolesCollection);
    
    return rolesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data() as Omit<Role, 'id'>
    }));
  } catch (error) {
    console.error('Error getting roles:', error);
    throw error;
  }
};

export const getRoleById = async (id: string): Promise<Role | null> => {
  try {
    const roleDoc = doc(db, 'roles', id);
    const roleSnapshot = await getDoc(roleDoc);
    
    if (roleSnapshot.exists()) {
      return {
        id: roleSnapshot.id,
        ...roleSnapshot.data() as Omit<Role, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting role by ID:', error);
    throw error;
  }
};

export const createRole = async (role: Omit<Role, 'id'>): Promise<string | null> => {
  try {
    const rolesCollection = collection(db, 'roles');
    const docRef = await addDoc(rolesCollection, {
      ...role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (id: string, data: Partial<Role>): Promise<boolean> => {
  try {
    const roleDoc = doc(db, 'roles', id);
    await updateDoc(roleDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRole = async (id: string): Promise<boolean> => {
  try {
    const roleDoc = doc(db, 'roles', id);
    await deleteDoc(roleDoc);
    
    return true;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

// Personnel
export const getPersonnel = async (): Promise<Personnel[]> => {
  try {
    const personnelCollection = collection(db, 'personnel');
    const personnelSnapshot = await getDocs(personnelCollection);
    
    return personnelSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data() as Omit<Personnel, 'id'>
    }));
  } catch (error) {
    console.error('Error getting personnel:', error);
    throw error;
  }
};

export const getPersonnelById = async (id: string): Promise<Personnel | null> => {
  try {
    const personnelDoc = doc(db, 'personnel', id);
    const personnelSnapshot = await getDoc(personnelDoc);
    
    if (personnelSnapshot.exists()) {
      return {
        id: personnelSnapshot.id,
        ...personnelSnapshot.data() as Omit<Personnel, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting personnel by ID:', error);
    throw error;
  }
};

export const createPersonnel = async (personnel: Omit<Personnel, 'id'>): Promise<string | null> => {
  try {
    const personnelCollection = collection(db, 'personnel');
    const docRef = await addDoc(personnelCollection, {
      ...personnel,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating personnel:', error);
    throw error;
  }
};

export const updatePersonnel = async (id: string, data: Partial<Personnel>): Promise<boolean> => {
  try {
    const personnelDoc = doc(db, 'personnel', id);
    await updateDoc(personnelDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating personnel:', error);
    throw error;
  }
};

export const deletePersonnel = async (id: string): Promise<boolean> => {
  try {
    const personnelDoc = doc(db, 'personnel', id);
    await deleteDoc(personnelDoc);
    
    return true;
  } catch (error) {
    console.error('Error deleting personnel:', error);
    throw error;
  }
};

// Factories
export const getFactories = async (): Promise<Factory[]> => {
  try {
    const factoriesCollection = collection(db, 'factories');
    const factoriesSnapshot = await getDocs(factoriesCollection);
    
    return factoriesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data() as Omit<Factory, 'id'>
    }));
  } catch (error) {
    console.error('Error getting factories:', error);
    throw error;
  }
};

export const getFactoryById = async (id: string): Promise<Factory | null> => {
  try {
    const factoryDoc = doc(db, 'factories', id);
    const factorySnapshot = await getDoc(factoryDoc);
    
    if (factorySnapshot.exists()) {
      return {
        id: factorySnapshot.id,
        ...factorySnapshot.data() as Omit<Factory, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting factory by ID:', error);
    throw error;
  }
};

export const createFactory = async (factory: Omit<Factory, 'id'>): Promise<string | null> => {
  try {
    const factoriesCollection = collection(db, 'factories');
    const docRef = await addDoc(factoriesCollection, {
      ...factory,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating factory:', error);
    throw error;
  }
};

export const updateFactory = async (id: string, data: Partial<Factory>): Promise<boolean> => {
  try {
    const factoryDoc = doc(db, 'factories', id);
    await updateDoc(factoryDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating factory:', error);
    throw error;
  }
};

export const deleteFactory = async (id: string): Promise<boolean> => {
  try {
    const factoryDoc = doc(db, 'factories', id);
    await deleteDoc(factoryDoc);
    
    return true;
  } catch (error) {
    console.error('Error deleting factory:', error);
    throw error;
  }
};

// Timeline
export const getPhases = async (): Promise<Phase[]> => {
  try {
    const timelineCollection = collection(db, 'timeline');
    const timelineSnapshot = await getDocs(timelineCollection);
    
    return timelineSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data() as Omit<Phase, 'id'>
    }));
  } catch (error) {
    console.error('Error getting timeline phases:', error);
    throw error;
  }
};

export const getPhaseById = async (id: string): Promise<Phase | null> => {
  try {
    const phaseDoc = doc(db, 'timeline', id);
    const phaseSnapshot = await getDoc(phaseDoc);
    
    if (phaseSnapshot.exists()) {
      return {
        id: phaseSnapshot.id,
        ...phaseSnapshot.data() as Omit<Phase, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting phase by ID:', error);
    throw error;
  }
};

export const createPhase = async (phase: Omit<Phase, 'id'>): Promise<string | null> => {
  try {
    const timelineCollection = collection(db, 'timeline');
    const docRef = await addDoc(timelineCollection, {
      ...phase,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating phase:', error);
    throw error;
  }
};

export const updatePhase = async (id: string, data: Partial<Phase>): Promise<boolean> => {
  try {
    const phaseDoc = doc(db, 'timeline', id);
    await updateDoc(phaseDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating phase:', error);
    throw error;
  }
};

export const deletePhase = async (id: string): Promise<boolean> => {
  try {
    const phaseDoc = doc(db, 'timeline', id);
    await deleteDoc(phaseDoc);
    
    return true;
  } catch (error) {
    console.error('Error deleting phase:', error);
    throw error;
  }
};

// Budget
export const getBudget = async (): Promise<Budget | null> => {
  try {
    const budgetDoc = doc(db, 'budget', 'current');
    const budgetSnapshot = await getDoc(budgetDoc);
    
    if (budgetSnapshot.exists()) {
      return budgetSnapshot.data() as Budget;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting budget:', error);
    throw error;
  }
};

export const updateBudget = async (data: Partial<Budget>): Promise<boolean> => {
  try {
    const budgetDoc = doc(db, 'budget', 'current');
    const budgetSnapshot = await getDoc(budgetDoc);
    
    if (budgetSnapshot.exists()) {
      await updateDoc(budgetDoc, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(budgetDoc, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
};

// Scenarios
export const getScenarios = async (userId: string): Promise<Scenario[]> => {
  try {
    const scenariosCollection = collection(db, 'scenarios');
    const q = query(scenariosCollection, where('userId', '==', userId));
    const scenariosSnapshot = await getDocs(q);
    
    return scenariosSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data() as Omit<Scenario, 'id'>
    }));
  } catch (error) {
    console.error('Error getting scenarios:', error);
    throw error;
  }
};

export const getScenarioById = async (id: string): Promise<Scenario | null> => {
  try {
    const scenarioDoc = doc(db, 'scenarios', id);
    const scenarioSnapshot = await getDoc(scenarioDoc);
    
    if (scenarioSnapshot.exists()) {
      return {
        id: scenarioSnapshot.id,
        ...scenarioSnapshot.data() as Omit<Scenario, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting scenario by ID:', error);
    throw error;
  }
};

export const createScenario = async (scenario: Omit<Scenario, 'id'>): Promise<string | null> => {
  try {
    const scenariosCollection = collection(db, 'scenarios');
    const docRef = await addDoc(scenariosCollection, {
      ...scenario,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating scenario:', error);
    throw error;
  }
};

export const updateScenario = async (id: string, data: Partial<Scenario>): Promise<boolean> => {
  try {
    const scenarioDoc = doc(db, 'scenarios', id);
    await updateDoc(scenarioDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating scenario:', error);
    throw error;
  }
};

export const deleteScenario = async (id: string): Promise<boolean> => {
  try {
    const scenarioDoc = doc(db, 'scenarios', id);
    await deleteDoc(scenarioDoc);
    
    return true;
  } catch (error) {
    console.error('Error deleting scenario:', error);
    throw error;
  }
};

// User Preferences
export const getUserPreferences = async (userId: string): Promise<Record<string, unknown> | null> => {
  try {
    const preferencesDoc = doc(db, 'userPreferences', userId);
    const preferencesSnapshot = await getDoc(preferencesDoc);
    
    if (preferencesSnapshot.exists()) {
      return preferencesSnapshot.data() as Record<string, unknown>;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
};

export const updateUserPreferences = async (userId: string, data: Record<string, unknown>): Promise<boolean> => {
  try {
    const preferencesDoc = doc(db, 'userPreferences', userId);
    const preferencesSnapshot = await getDoc(preferencesDoc);
    
    if (preferencesSnapshot.exists()) {
      await updateDoc(preferencesDoc, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(preferencesDoc, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

// Assign/Unassign Personnel
export const assignPersonnelToRole = async (personnelId: string, roleId: string, factoryId: string): Promise<boolean> => {
  try {
    const personnelDoc = doc(db, 'personnel', personnelId);
    await updateDoc(personnelDoc, {
      assignedRole: roleId,
      assignedFactory: factoryId, // Assuming factoryId is also needed/updated
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error assigning personnel to role:', error);
    throw error;
  }
};

export const unassignPersonnel = async (personnelId: string): Promise<boolean> => {
  try {
    const personnelDoc = doc(db, 'personnel', personnelId);
    await updateDoc(personnelDoc, {
      assignedRole: null, // Or deleteField() if you prefer removing the field
      assignedFactory: null, // Or deleteField()
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error unassigning personnel:', error);
    throw error;
  }
};

// Activities (Timeline) - Keep these stubs for now
export const getActivities = async (phaseId?: string): Promise<Activity[]> => {
  console.warn("getActivities not fully implemented yet.");
  // In a real implementation, fetch from 'activities' collection, possibly filtered by phaseId
  return []; // Return empty array for now
};

export const createActivity = async (activity: Omit<Activity, 'id'>): Promise<string | null> => {
  console.warn("createActivity not implemented yet.");
  // In a real implementation, add to 'activities' collection
  return null;
};

export const updateActivity = async (id: string, data: Partial<Activity>): Promise<boolean> => {
  console.warn("updateActivity not implemented yet.");
  // In a real implementation, update doc in 'activities' collection
  return false;
};

export const deleteActivity = async (id: string): Promise<boolean> => {
  console.warn("deleteActivity not implemented yet.");
  // In a real implementation, delete doc from 'activities' collection
  return false;
};

// --- Departments ---
const DEPARTMENTS_COLLECTION = 'departments';

export const getDepartments = async (): Promise<Department[]> => {
  try {
    const departmentsCollection = collection(db, DEPARTMENTS_COLLECTION);
    const departmentsSnapshot = await getDocs(departmentsCollection);
    
    return departmentsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id as DepartmentType, // ID is the DepartmentType
      ...doc.data() as Omit<Department, 'id'>
    }));
  } catch (error) {
    console.error('Error getting departments:', error);
    throw error;
  }
};

export const getDepartmentById = async (id: DepartmentType): Promise<Department | null> => {
  try {
    const deptDoc = doc(db, DEPARTMENTS_COLLECTION, id);
    const deptSnapshot = await getDoc(deptDoc);
    
    if (deptSnapshot.exists()) {
      return {
        id: deptSnapshot.id as DepartmentType,
        ...deptSnapshot.data() as Omit<Department, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting department by ID:', error);
    throw error;
  }
};

// Note: Departments might be predefined. If creation is needed, ensure the ID (DepartmentType) is passed.
// The useDepartments hook currently expects Omit<Department, 'id'> which is inconsistent.
// Assuming here the full department object (including id) is provided for creation/setting.
export const createDepartment = async (department: Department): Promise<boolean> => {
  try {
    const deptDoc = doc(db, DEPARTMENTS_COLLECTION, department.id); // Use the DepartmentType as the document ID
    await setDoc(deptDoc, {
      ...department,
      // Remove id from data if it's the document key, unless you want it duplicated
      name: department.name, 
      color: department.color,
      // Add timestamps if desired
      // createdAt: serverTimestamp(),
      // updatedAt: serverTimestamp()
    });
    return true; // setDoc doesn't return an ID like addDoc, return success boolean
  } catch (error) {
    console.error('Error creating/setting department:', error);
    throw error;
  }
};

export const updateDepartment = async (id: DepartmentType, data: Partial<Omit<Department, 'id'>>): Promise<boolean> => {
  try {
    const deptDoc = doc(db, DEPARTMENTS_COLLECTION, id);
    await updateDoc(deptDoc, {
      ...data,
      // updatedAt: serverTimestamp() // Add if timestamps are used
    });
    return true;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
};

export const deleteDepartment = async (id: DepartmentType): Promise<boolean> => {
  try {
    const deptDoc = doc(db, DEPARTMENTS_COLLECTION, id);
    await deleteDoc(deptDoc);
    return true;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
};

// --- Tasks ---
const TASKS_COLLECTION = 'tasks';

export const getTasks = async (): Promise<Task[]> => {
  try {
    const tasksCollection = collection(db, TASKS_COLLECTION);
    // Consider adding ordering, e.g., orderBy('createdAt', 'desc')
    const tasksSnapshot = await getDocs(tasksCollection); 
    
    return tasksSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data() as Omit<Task, 'id'>
    }));
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

export const getTaskById = async (id: string): Promise<Task | null> => {
  try {
    const taskDoc = doc(db, TASKS_COLLECTION, id);
    const taskSnapshot = await getDoc(taskDoc);
    
    if (taskSnapshot.exists()) {
      return {
        id: taskSnapshot.id,
        ...taskSnapshot.data() as Omit<Task, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting task by ID:', error);
    throw error;
  }
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<string | null> => {
  try {
    const tasksCollection = collection(db, TASKS_COLLECTION);
    const docRef = await addDoc(tasksCollection, {
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<boolean> => {
  try {
    const taskDoc = doc(db, TASKS_COLLECTION, id);
    await updateDoc(taskDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<boolean> => {
  try {
    const taskDoc = doc(db, TASKS_COLLECTION, id);
    await deleteDoc(taskDoc);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// --- Clients ---
const CLIENTS_COLLECTION = 'clients';

export const getClients = async (): Promise<Client[]> => {
  try {
    const clientsCollection = collection(db, CLIENTS_COLLECTION);
    const clientsSnapshot = await getDocs(clientsCollection);
    
    return clientsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data() as Omit<Client, 'id'>
    }));
  } catch (error) {
    console.error('Error getting clients:', error);
    throw error;
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const clientDoc = doc(db, CLIENTS_COLLECTION, id);
    const clientSnapshot = await getDoc(clientDoc);
    
    if (clientSnapshot.exists()) {
      return {
        id: clientSnapshot.id,
        ...clientSnapshot.data() as Omit<Client, 'id'>
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting client by ID:', error);
    throw error;
  }
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<string | null> => {
  try {
    const clientsCollection = collection(db, CLIENTS_COLLECTION);
    const docRef = await addDoc(clientsCollection, {
      ...client,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const updateClient = async (id: string, data: Partial<Client>): Promise<boolean> => {
  try {
    const clientDoc = doc(db, CLIENTS_COLLECTION, id);
    await updateDoc(clientDoc, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    const clientDoc = doc(db, CLIENTS_COLLECTION, id);
    await deleteDoc(clientDoc);
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};
