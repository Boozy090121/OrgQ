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
  DocumentData
} from 'firebase/firestore';
import { Role, Personnel, Factory, Phase, Budget, Scenario } from '@/types';

// Roles
export const getRoles = async (): Promise<Role[]> => {
  try {
    const rolesCollection = collection(db, 'roles');
    const rolesSnapshot = await getDocs(rolesCollection);
    
    return rolesSnapshot.docs.map(doc => ({
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
    
    return personnelSnapshot.docs.map(doc => ({
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
    
    return factoriesSnapshot.docs.map(doc => ({
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
export const getTimeline = async (): Promise<Phase[]> => {
  try {
    const timelineCollection = collection(db, 'timeline');
    const timelineSnapshot = await getDocs(timelineCollection);
    
    return timelineSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Phase, 'id'>
    }));
  } catch (error) {
    console.error('Error getting timeline:', error);
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
    
    return scenariosSnapshot.docs.map(doc => ({
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
