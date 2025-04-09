import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { 
  getRoles, 
  createRole, 
  updateRole, 
  deleteRole,
  getPersonnel,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
  assignPersonnelToRole,
  unassignPersonnel,
  getFactories,
  createFactory,
  updateFactory,
  deleteFactory,
  getPhases,
  createPhase,
  updatePhase,
  deletePhase,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getClients,
  createClient,
  updateClient,
  deleteClient
} from '@/lib/firebase/firestore';
import { Role, Personnel, Factory, Phase, Activity, Department, Task, Client } from '@/types';

// Hook for managing roles
export const useRoles = () => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!authLoading && user) {
        try {
          setLoading(true);
          const fetchedRoles = await getRoles();
          setRoles(fetchedRoles);
          setError(null);
        } catch (err) {
          console.error('Error fetching roles:', err);
          setError('Failed to load roles');
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setRoles([]);
        setLoading(false);
      }
    };

    fetchRoles();
  }, [user, authLoading]);

  const addRole = async (role: Omit<Role, 'id'>) => {
    try {
      const newRoleId = await createRole(role);
      
      if (newRoleId) {
        const newRole = {
          id: newRoleId,
          ...role
        };
        
        setRoles([...roles, newRole]);
        return newRoleId;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding role:', err);
      setError('Failed to add role');
      return null;
    }
  };

  const updateRoleById = async (id: string, data: Partial<Role>) => {
    try {
      const success = await updateRole(id, data);
      
      if (success) {
        setRoles(roles.map(role => 
          role.id === id ? { ...role, ...data } : role
        ));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update role');
      return false;
    }
  };

  const deleteRoleById = async (id: string) => {
    try {
      const success = await deleteRole(id);
      
      if (success) {
        setRoles(roles.filter(role => role.id !== id));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting role:', err);
      setError('Failed to delete role');
      return false;
    }
  };

  return {
    roles,
    loading,
    error,
    addRole,
    updateRole: updateRoleById,
    deleteRole: deleteRoleById
  };
};

// Hook for managing personnel
export const usePersonnel = () => {
  const { user, loading: authLoading } = useAuth();
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonnel = async () => {
      if (!authLoading && user) {
        try {
          setLoading(true);
          const fetchedPersonnel = await getPersonnel();
          setPersonnel(fetchedPersonnel);
          setError(null);
        } catch (err) {
          console.error('Error fetching personnel:', err);
          setError('Failed to load personnel');
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setPersonnel([]);
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [user, authLoading]);

  const addPersonnel = async (person: Omit<Personnel, 'id'>) => {
    try {
      const newPersonnelId = await createPersonnel(person);
      
      if (newPersonnelId) {
        const newPerson = {
          id: newPersonnelId,
          ...person
        };
        
        setPersonnel([...personnel, newPerson]);
        return newPersonnelId;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding personnel:', err);
      setError('Failed to add personnel');
      return null;
    }
  };

  const updatePersonnelById = async (id: string, data: Partial<Personnel>) => {
    try {
      const success = await updatePersonnel(id, data);
      
      if (success) {
        setPersonnel(personnel.map(person => 
          person.id === id ? { ...person, ...data } : person
        ));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating personnel:', err);
      setError('Failed to update personnel');
      return false;
    }
  };

  const deletePersonnelById = async (id: string) => {
    try {
      const success = await deletePersonnel(id);
      
      if (success) {
        setPersonnel(personnel.filter(person => person.id !== id));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting personnel:', err);
      setError('Failed to delete personnel');
      return false;
    }
  };

  const assignToRole = async (personnelId: string, roleId: string, factoryId: string) => {
    try {
      const success = await assignPersonnelToRole(personnelId, roleId, factoryId);
      
      if (success) {
        setPersonnel(personnel.map(person => 
          person.id === personnelId 
            ? { ...person, assignedRole: roleId, assignedFactory: factoryId } 
            : person
        ));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error assigning personnel to role:', err);
      setError('Failed to assign personnel to role');
      return false;
    }
  };

  const unassign = async (personnelId: string) => {
    try {
      const success = await unassignPersonnel(personnelId);
      
      if (success) {
        setPersonnel(personnel.map(person => 
          person.id === personnelId 
            ? { ...person, assignedRole: null, assignedFactory: null } 
            : person
        ));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error unassigning personnel:', err);
      setError('Failed to unassign personnel');
      return false;
    }
  };

  return {
    personnel,
    loading,
    error,
    addPersonnel,
    updatePersonnel: updatePersonnelById,
    deletePersonnel: deletePersonnelById,
    assignToRole,
    unassign
  };
};

// Hook for managing factories
export const useFactories = () => {
  const { user, loading: authLoading } = useAuth();
  const [factories, setFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFactories = async () => {
      if (!authLoading && user) {
        try {
          setLoading(true);
          const fetchedFactories = await getFactories();
          setFactories(fetchedFactories);
          setError(null);
        } catch (err) {
          console.error('Error fetching factories:', err);
          setError('Failed to load factories');
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setFactories([]);
        setLoading(false);
      }
    };

    fetchFactories();
  }, [user, authLoading]);

  const addFactory = async (factory: Omit<Factory, 'id'>) => {
    try {
      const newFactoryId = await createFactory(factory);
      
      if (newFactoryId) {
        const newFactory = {
          id: newFactoryId,
          ...factory
        };
        
        setFactories([...factories, newFactory]);
        return newFactoryId;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding factory:', err);
      setError('Failed to add factory');
      return null;
    }
  };

  const updateFactoryById = async (id: string, data: Partial<Factory>) => {
    try {
      const success = await updateFactory(id, data);
      
      if (success) {
        setFactories(factories.map(factory => 
          factory.id === id ? { ...factory, ...data } : factory
        ));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating factory:', err);
      setError('Failed to update factory');
      return false;
    }
  };

  const deleteFactoryById = async (id: string) => {
    try {
      const success = await deleteFactory(id);
      
      if (success) {
        setFactories(factories.filter(factory => factory.id !== id));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting factory:', err);
      setError('Failed to delete factory');
      return false;
    }
  };

  return {
    factories,
    loading,
    error,
    addFactory,
    updateFactory: updateFactoryById,
    deleteFactory: deleteFactoryById
  };
};

// Hook for managing timeline phases and activities
export const useTimeline = () => {
  const { user, loading: authLoading } = useAuth();
  const [phases, setPhases] = useState<Phase[]>([]);
  const [activities, setActivities] = useState<{[phaseId: string]: Activity[]}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!authLoading && user) {
        try {
          setLoading(true);
          const fetchedPhases = await getPhases();
          setPhases(fetchedPhases);
          
          // Fetch activities for each phase
          const activitiesByPhase: {[phaseId: string]: Activity[]} = {};
          for (const phase of fetchedPhases) {
            const phaseActivities = await getActivities(phase.id);
            activitiesByPhase[phase.id] = phaseActivities;
          }
          
          setActivities(activitiesByPhase);
          setError(null);
        } catch (err) {
          console.error('Error fetching timeline:', err);
          setError('Failed to load timeline');
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setPhases([]);
        setActivities({});
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [user, authLoading]);

  const addPhase = async (phase: Omit<Phase, 'id'>) => {
    try {
      const newPhaseId = await createPhase(phase);
      
      if (newPhaseId) {
        const newPhase = {
          id: newPhaseId,
          ...phase
        };
        
        setPhases([...phases, newPhase]);
        setActivities({
          ...activities,
          [newPhaseId]: []
        });
        
        return newPhaseId;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding phase:', err);
      setError('Failed to add phase');
      return null;
    }
  };

  const updatePhaseById = async (id: string, data: Partial<Phase>) => {
    try {
      const success = await updatePhase(id, data);
      
      if (success) {
        setPhases(phases.map(phase => 
          phase.id === id ? { ...phase, ...data } : phase
        ));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating phase:', err);
      setError('Failed to update phase');
      return false;
    }
  };

  const deletePhaseById = async (id: string) => {
    try {
      const success = await deletePhase(id);
      
      if (success) {
        setPhases(phases.filter(phase => phase.id !== id));
        
        // Remove activities for this phase
        const newActivities = { ...activities };
        delete newActivities[id];
        setActivities(newActivities);
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting phase:', err);
      setError('Failed to delete phase');
      return false;
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      const newActivityId = await createActivity(activity);
      
      if (newActivityId) {
        const newActivity = {
          id: newActivityId,
          ...activity
        };
        
        setActivities({
          ...activities,
          [activity.phaseId]: [
            ...(activities[activity.phaseId] || []),
            newActivity
          ]
        });
        
        return newActivityId;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding activity:', err);
      setError('Failed to add activity');
      return null;
    }
  };

  const updateActivityById = async (id: string, data: Partial<Activity>) => {
    try {
      const success = await updateActivity(id, data);
      
      if (success) {
        // Find which phase this activity belongs to
        let phaseId = '';
        for (const [pId, acts] of Object.entries(activities)) {
          if (acts.some(a => a.id === id)) {
            phaseId = pId;
            break;
          }
        }
        
        if (phaseId) {
          setActivities({
            ...activities,
            [phaseId]: activities[phaseId].map(activity => 
              activity.id === id ? { ...activity, ...data } : activity
            )
          });
        }
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating activity:', err);
      setError('Failed to update activity');
      return false;
    }
  };

  const deleteActivityById = async (id: string) => {
    try {
      const success = await deleteActivity(id);
      
      if (success) {
        // Find which phase this activity belongs to
        let phaseId = '';
        for (const [pId, acts] of Object.entries(activities)) {
          if (acts.some(a => a.id === id)) {
            phaseId = pId;
            break;
          }
        }
        
        if (phaseId) {
          setActivities({
            ...activities,
            [phaseId]: activities[phaseId].filter(activity => activity.id !== id)
          });
        }
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting activity:', err);
      setError('Failed to delete activity');
      return false;
    }
  };

  return {
    phases,
    activities,
    loading,
    error,
    addPhase,
    updatePhase: updatePhaseById,
    deletePhase: deletePhaseById,
    addActivity,
    updateActivity: updateActivityById,
    deleteActivity: deleteActivityById
  };
};

// Hook for managing Departments
export const useDepartments = () => {
  const { user, loading: authLoading } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!authLoading && user) {
        try {
          setLoading(true);
          const fetchedDepartments = await getDepartments();
          setDepartments(fetchedDepartments);
          setError(null);
        } catch (err) {
          console.error('Error fetching departments:', err);
          setError('Failed to load departments');
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setDepartments([]);
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [user, authLoading]);

  const addDepartment = async (dept: Department) => {
    try {
      const success = await createDepartment(dept);
      if (success) {
        if (!departments.some(d => d.id === dept.id)) {
          setDepartments([...departments, dept]);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding department:', err);
      setError('Failed to add department');
      return false;
    }
  };

  const updateDepartmentById = async (id: DepartmentType, data: Partial<Department>) => {
    try {
      const success = await updateDepartment(id, data);
      
      if (success) {
        setDepartments(departments.map(dept => 
          dept.id === id ? { ...dept, ...data } : dept
        ));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating department:', err);
      setError('Failed to update department');
      return false;
    }
  };

  const deleteDepartmentById = async (id: DepartmentType) => {
    try {
      const success = await deleteDepartment(id);
      
      if (success) {
        setDepartments(departments.filter(dept => dept.id !== id));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting department:', err);
      setError('Failed to delete department');
      return false;
    }
  };

  return {
    departments,
    loading,
    error,
    addDepartment,
    updateDepartment: updateDepartmentById,
    deleteDepartment: deleteDepartmentById
  };
};

// Hook for managing Tasks
export const useTasks = () => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!authLoading && user) {
        try {
          setLoading(true);
          const fetchedTasks = await getTasks();
          setTasks(fetchedTasks);
          setError(null);
        } catch (err) {
          console.error('Error fetching tasks:', err);
          setError('Failed to load tasks');
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setTasks([]);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, authLoading]);

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTaskId = await createTask(task);
      
      if (newTaskId) {
        const newTask = { id: newTaskId, ...task };
        setTasks([...tasks, newTask]);
        return newTaskId;
      }
      
      return null;
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
      return null;
    }
  };

  const updateTaskById = async (id: string, data: Partial<Task>) => {
    try {
      const success = await updateTask(id, data);
      
      if (success) {
        setTasks(tasks.map(task => 
          task.id === id ? { ...task, ...data } : task
        ));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      return false;
    }
  };

  const deleteTaskById = async (id: string) => {
    try {
      const success = await deleteTask(id);
      
      if (success) {
        setTasks(tasks.filter(task => task.id !== id));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask: updateTaskById,
    deleteTask: deleteTaskById
  };
};

// Hook for managing Clients
export const useClients = () => {
  const { user, loading: authLoading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      if (!authLoading && user) {
        try {
          setLoading(true);
          const fetchedClients = await getClients();
          setClients(fetchedClients);
          setError(null);
        } catch (err) {
          console.error('Error fetching clients:', err);
          setError('Failed to load clients');
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && !user) {
        setClients([]);
        setLoading(false);
      }
    };

    fetchClients();
  }, [user, authLoading]);

  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      const newClientId = await createClient(client);
      if (newClientId) {
        const newClient = { id: newClientId, ...client };
        setClients([...clients, newClient]);
        return newClientId;
      }
      return null;
    } catch (err) {
      console.error('Error adding client:', err);
      setError('Failed to add client');
      return null;
    }
  };

  const updateClientById = async (id: string, data: Partial<Client>) => {
    try {
      const success = await updateClient(id, data);
      if (success) {
        setClients(clients.map(client => 
          client.id === id ? { ...client, ...data } : client
        ));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating client:', err);
      setError('Failed to update client');
      return false;
    }
  };

  const deleteClientById = async (id: string) => {
    try {
      const success = await deleteClient(id);
      if (success) {
        setClients(clients.filter(client => client.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting client:', err);
      setError('Failed to delete client');
      return false;
    }
  };

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient: updateClientById,
    deleteClient: deleteClientById
  };
};
