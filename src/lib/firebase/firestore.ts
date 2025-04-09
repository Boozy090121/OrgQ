import { db } from './config'; // Assuming config.ts is in the same directory
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
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  Query,
  collectionGroup
} from 'firebase/firestore';
import {
  Role,
  Personnel,
  Factory,
  Phase,
  Scenario,
  Activity,
  Department,
  Task,
  DepartmentType,
  Client,
  User, // Make sure User type is defined if needed for user-specific data
  Resource
} from '@/lib/types'; // Adjust path if your types.ts is elsewhere
import { RoleFormData } from '@/components/forms/AddRoleForm'; // Import specific form data type

// Helper function to convert Firestore Timestamps in fetched data
const convertTimestamps = (data: DocumentData): any => {
  const convertedData = { ...data };
  for (const key in convertedData) {
    if (convertedData[key] instanceof Timestamp) {
      convertedData[key] = convertedData[key].toMillis(); // Convert Timestamp to milliseconds
    }
  }
  return convertedData;
};

// Helper to convert RoleFormData to Role Firestore data
const prepareRoleDataForFirestore = (data: RoleFormData): Omit<Role, 'id'> => {
  return {
    title: data.title,
    departmentId: data.departmentId,
    level: data.level,
    salary: {
      min: typeof data.salaryMin === 'number' ? data.salaryMin : 0,
      max: typeof data.salaryMax === 'number' ? data.salaryMax : 0,
    },
    factorySpecific: data.factorySpecific,
    factoryId: data.factorySpecific ? data.factoryId : undefined,
    // detailedResponsibilities: [], // Initialize if needed, or handle separately
  };
};

// Generic Add Function (example - adjust types as needed)
export const addDocument = async <T extends Record<string, unknown>>(
  collectionName: string, 
  data: T
): Promise<string> => {
  try {
    let dataToAdd = data;
    // Special handling for 'roles' collection using RoleFormData
    if (collectionName === 'roles') {
      // Explicitly cast data to RoleFormData for type safety within this block
      const roleFormData = data as RoleFormData;
      dataToAdd = prepareRoleDataForFirestore(roleFormData) as T; // Cast back after preparation
    }

    const docRef = await addDoc(collection(db, collectionName), dataToAdd);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Re-throw the error to be caught by the caller
  }
};

// Generic Update Function
export const updateDocument = async (
  collectionName: string, 
  docId: string, 
  // data: Partial<any> // Avoid any
  data: Record<string, unknown> // Use a more specific type or Record<string, unknown>
): Promise<void> => {
  try {
    let dataToUpdate = data;
     // Special handling for 'roles' collection using RoleFormData
    if (collectionName === 'roles') {
      const roleFormData = data as Partial<RoleFormData>; // Use Partial for updates
      // Prepare only the fields present in the partial data
      const preparedData: Partial<Omit<Role, 'id'>> = {};
      if (roleFormData.title !== undefined) preparedData.title = roleFormData.title;
      if (roleFormData.departmentId !== undefined) preparedData.departmentId = roleFormData.departmentId;
      if (roleFormData.level !== undefined) preparedData.level = roleFormData.level;
      if (roleFormData.salaryMin !== undefined || roleFormData.salaryMax !== undefined) {
        // Need existing salary data potentially, or assume full replacement
         preparedData.salary = {
           min: typeof roleFormData.salaryMin === 'number' ? roleFormData.salaryMin : 0, // Be careful with partial updates to nested objects
           max: typeof roleFormData.salaryMax === 'number' ? roleFormData.salaryMax : 0,
         };
      }
      if (roleFormData.factorySpecific !== undefined) preparedData.factorySpecific = roleFormData.factorySpecific;
      preparedData.factoryId = roleFormData.factorySpecific ? roleFormData.factoryId : undefined;
      
      dataToUpdate = preparedData;
    }

    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, dataToUpdate);
    console.log("Document updated successfully");
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// --- Roles --- 
export const getRoles = async (): Promise<Role[]> => {
  const rolesCollection = collection(db, 'roles');
  const rolesSnapshot = await getDocs(rolesCollection);
  return rolesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...data as Omit<Role, 'id'> };
  });
};

export const createRole = async (role: Omit<Role, 'id'>): Promise<string> => {
  const rolesCollection = collection(db, 'roles');
  const docRef = await addDoc(rolesCollection, {
    ...role,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateRole = async (id: string, data: Partial<Role>): Promise<void> => {
  const roleDoc = doc(db, 'roles', id);
  await updateDoc(roleDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteRole = async (id: string): Promise<void> => {
  const roleDoc = doc(db, 'roles', id);
  await deleteDoc(roleDoc);
};

// --- Personnel --- 
export const getPersonnel = async (): Promise<Personnel[]> => {
  const personnelCollection = collection(db, 'personnel');
  const personnelSnapshot = await getDocs(personnelCollection);
  return personnelSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...data as Omit<Personnel, 'id'> };
  });
};

export const createPersonnel = async (personnel: Omit<Personnel, 'id'>): Promise<string> => {
  const personnelCollection = collection(db, 'personnel');
  const docRef = await addDoc(personnelCollection, {
    ...personnel,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updatePersonnel = async (id: string, data: Partial<Personnel>): Promise<void> => {
  const personnelDoc = doc(db, 'personnel', id);
  await updateDoc(personnelDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deletePersonnel = async (id: string): Promise<void> => {
  const personnelDoc = doc(db, 'personnel', id);
  await deleteDoc(personnelDoc);
};

export const assignPersonnelToRole = async (personnelId: string, roleId: string, factoryId: string): Promise<void> => {
  const personnelDoc = doc(db, 'personnel', personnelId);
  await updateDoc(personnelDoc, {
    assignedRole: roleId,
    assignedFactory: factoryId,
    updatedAt: serverTimestamp()
  });
};

export const unassignPersonnel = async (personnelId: string): Promise<void> => {
  const personnelDoc = doc(db, 'personnel', personnelId);
  await updateDoc(personnelDoc, {
    assignedRole: null, // Or deleteField() if you prefer
    assignedFactory: null, // Or deleteField()
    updatedAt: serverTimestamp()
  });
};

// --- Factories --- 
export const getFactories = async (): Promise<Factory[]> => {
  const factoriesCollection = collection(db, 'factories');
  const factoriesSnapshot = await getDocs(factoriesCollection);
  return factoriesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...data as Omit<Factory, 'id'> };
  });
};

export const createFactory = async (factory: Omit<Factory, 'id'>): Promise<string> => {
  const factoriesCollection = collection(db, 'factories');
  // Add default empty/zero values if they are optional in the type but required in Firestore
  const fullFactoryData = {
    clients: [],
    workOrderVolume: 0,
    specialRequirements: [],
    ...factory,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const docRef = await addDoc(factoriesCollection, fullFactoryData);
  return docRef.id;
};

export const updateFactory = async (id: string, data: Partial<Factory>): Promise<void> => {
  const factoryDoc = doc(db, 'factories', id);
  await updateDoc(factoryDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteFactory = async (id: string): Promise<void> => {
  const factoryDoc = doc(db, 'factories', id);
  await deleteDoc(factoryDoc);
};

// --- Timeline Phases --- 
export const getPhases = async (): Promise<Phase[]> => {
  const phasesCollection = collection(db, 'phases');
  const phasesSnapshot = await getDocs(phasesCollection);
  return phasesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...data as Omit<Phase, 'id'> };
  }).sort((a, b) => a.order - b.order); // Ensure sorted by order
};

export const createPhase = async (phase: Omit<Phase, 'id'>): Promise<string> => {
  const phasesCollection = collection(db, 'phases');
  const docRef = await addDoc(phasesCollection, {
    ...phase,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updatePhase = async (id: string, data: Partial<Phase>): Promise<void> => {
  const phaseDoc = doc(db, 'phases', id);
  await updateDoc(phaseDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deletePhase = async (id: string): Promise<void> => {
  const phaseDoc = doc(db, 'phases', id);
  // Consider deleting associated activities if necessary
  await deleteDoc(phaseDoc);
};

// --- Timeline Activities --- 
// Note: Activities are often fetched per phase, not all at once.
export const getActivities = async (phaseId: string): Promise<Activity[]> => {
  const activitiesCollection = collection(db, `phases/${phaseId}/activities`);
  const activitiesSnapshot = await getDocs(activitiesCollection);
  return activitiesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...data as Omit<Activity, 'id'> };
  }).sort((a, b) => a.order - b.order); // Ensure sorted by order
};

export const createActivity = async (phaseId: string, activity: Omit<Activity, 'id'>): Promise<string> => {
  const activitiesCollection = collection(db, `phases/${phaseId}/activities`);
  const docRef = await addDoc(activitiesCollection, {
    ...activity,
    phaseId: phaseId, // Ensure phaseId is set if not passed in activity object
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateActivity = async (phaseId: string, activityId: string, data: Partial<Activity>): Promise<void> => {
  const activityDoc = doc(db, `phases/${phaseId}/activities`, activityId);
  await updateDoc(activityDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteActivity = async (phaseId: string, activityId: string): Promise<void> => {
  const activityDoc = doc(db, `phases/${phaseId}/activities`, activityId);
  await deleteDoc(activityDoc);
};

// --- Departments --- 
// Departments might be relatively static; consider if fetching is always needed vs. hardcoding
export const getDepartments = async (): Promise<Department[]> => {
  const departmentsCollection = collection(db, 'departments');
  const departmentsSnapshot = await getDocs(departmentsCollection);
  return departmentsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...data as Omit<Department, 'id'> };
  });
};

// Use addDoc to generate ID for new departments
export const createDepartment = async (department: Omit<Department, 'id'>): Promise<string> => {
  const departmentsCollection = collection(db, 'departments');
  const docRef = await addDoc(departmentsCollection, {
    ...department,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }); 
  return docRef.id;
};

export const updateDepartment = async (id: DepartmentType, data: Partial<Omit<Department, 'id'>>): Promise<void> => {
  const departmentDoc = doc(db, 'departments', id);
  await updateDoc(departmentDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteDepartment = async (id: DepartmentType): Promise<void> => {
  const departmentDoc = doc(db, 'departments', id);
  // Consider implications: what happens to roles in this department?
  await deleteDoc(departmentDoc);
};

// --- Tasks --- 
export const getTasks = async (): Promise<Task[]> => {
  const tasksCollection = collection(db, 'tasks');
  const tasksSnapshot = await getDocs(tasksCollection);
  return tasksSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...data as Omit<Task, 'id'> };
  });
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  const tasksCollection = collection(db, 'tasks');
  const docRef = await addDoc(tasksCollection, {
    ...task,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<void> => {
  const taskDoc = doc(db, 'tasks', id);
  await updateDoc(taskDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteTask = async (id: string): Promise<void> => {
  const taskDoc = doc(db, 'tasks', id);
  await deleteDoc(taskDoc);
};

// --- Clients --- 
export const getClients = async (): Promise<Client[]> => {
  const clientsCollection = collection(db, 'clients');
  const clientsSnapshot = await getDocs(clientsCollection);
  return clientsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = convertTimestamps(doc.data());
    return { id: doc.id, ...data as Omit<Client, 'id'> };
  });
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<string> => {
  const clientsCollection = collection(db, 'clients');
  const docRef = await addDoc(clientsCollection, {
    ...client,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateClient = async (id: string, data: Partial<Client>): Promise<void> => {
  const clientDoc = doc(db, 'clients', id);
  await updateDoc(clientDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteClient = async (id: string): Promise<void> => {
  const clientDoc = doc(db, 'clients', id);
  await deleteDoc(clientDoc);
};

// --- Scenarios --- 
export const getScenarios = async (userId: string): Promise<Scenario[]> => {
    const scenariosCollection = collection(db, 'scenarios');
    // Query scenarios belonging to the current user
    const q = query(scenariosCollection, where("userId", "==", userId)); 
    const scenariosSnapshot = await getDocs(q);
    return scenariosSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = convertTimestamps(doc.data());
        return { id: doc.id, ...data as Omit<Scenario, 'id'> };
    });
};

export const createScenario = async (scenario: Omit<Scenario, 'id'>): Promise<string> => {
    const scenariosCollection = collection(db, 'scenarios');
    const docRef = await addDoc(scenariosCollection, {
        ...scenario,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return docRef.id;
};

export const updateScenario = async (id: string, data: Partial<Scenario>): Promise<void> => {
    const scenarioDoc = doc(db, 'scenarios', id);
    await updateDoc(scenarioDoc, {
        ...data,
        updatedAt: serverTimestamp()
    });
};

export const deleteScenario = async (id: string): Promise<void> => {
    const scenarioDoc = doc(db, 'scenarios', id);
    await deleteDoc(scenarioDoc);
};

// --- User Profile / Preferences (Example) ---
// Get user profile (used in auth logic?)
export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userDoc = doc(db, 'users', uid);
  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    const data = convertTimestamps(userSnapshot.data());
    return { uid: userSnapshot.id, ...data } as User;
  }
  return null;
};

// Update user profile (e.g., displayName, role)
export const updateUserProfile = async (uid: string, data: Partial<Omit<User, 'uid' | 'email' | 'isAdmin'>>): Promise<void> => {
  const userDoc = doc(db, 'users', uid);
  await updateDoc(userDoc, data); // Assuming role/displayName updates here
};

// --- Resources --- 
export const getResources = async (): Promise<Resource[]> => {
  const resourcesCollection = collection(db, 'resources');
  const resourcesSnapshot = await getDocs(resourcesCollection);
  return resourcesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = convertTimestamps(doc.data()); // Use internal helper
    return { id: doc.id, ...data as Omit<Resource, 'id'> };
  });
};

export const createResource = async (resource: Omit<Resource, 'id'>): Promise<string> => {
  const resourcesCollection = collection(db, 'resources');
  const docRef = await addDoc(resourcesCollection, {
    ...resource,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateResource = async (id: string, data: Partial<Resource>): Promise<void> => {
  const resourceDoc = doc(db, 'resources', id);
  await updateDoc(resourceDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

export const deleteResource = async (id: string): Promise<void> => {
  const resourceDoc = doc(db, 'resources', id);
  await deleteDoc(resourceDoc);
};

// NOTE: Removed Budget functions as Budget type was removed.
// NOTE: Removed getUserPreferences/updateUserPreferences as these are usually specific. 