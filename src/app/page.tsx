"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useData } from '@/lib/context/DataContext';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import AddFactoryForm from '@/components/forms/AddFactoryForm';
import AddRoleForm, { RoleFormData } from '@/components/forms/AddRoleForm';
import AddPersonnelForm, { PersonnelFormData } from '@/components/forms/AddPersonnelForm';
import AddTaskForm, { TaskFormData } from '@/components/forms/AddTaskForm';
import AddClientForm, { ClientFormData } from '@/components/forms/AddClientForm';
import AddScenarioForm, { ScenarioFormData } from '@/components/forms/AddScenarioForm';
import AddResourceForm, { ResourceFormData } from '@/components/forms/AddResourceForm';
import AddPhaseForm, { PhaseFormData } from '@/components/forms/AddPhaseForm';
import AddDepartmentForm, { DepartmentFormData } from '@/components/forms/AddDepartmentForm';
import AddActivityForm, { ActivityFormData } from '@/components/forms/AddActivityForm';
import { Factory, Role, Personnel, Task, Client, Scenario, Resource, Phase, Department, Activity } from '@/lib/types';
import OrganizationDnd from '@/components/OrganizationDnd';
import DepartmentSelector from '@/components/DepartmentSelector';
import TaskList from '@/components/TaskList';
import ClientList from '@/components/ClientList';
import ScenarioList from '@/components/ScenarioList';
import ResourceList from '@/components/ResourceList';
import TimelineList from '@/components/TimelineList';
import DepartmentList from '@/components/DepartmentList';
import { toast } from "sonner"

export default function PersonnelManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    personnel, roles, factories, departments, tasks, clients, phases, scenarios, resources, activities,
    loading: dataLoading,
    error,
    addFactory,
    updateFactory, deleteFactory,
    addRole, updateRole, deleteRole,
    addPersonnel, updatePersonnel, deletePersonnel,
    assignPersonnelToRole, unassignPersonnel,
    addTask, updateTask, deleteTask,
    addClient, updateClient, deleteClient,
    addScenario, updateScenario, deleteScenario,
    addResource, updateResource, deleteResource,
    addPhase, updatePhase, deletePhase,
    addDepartment, updateDepartment, deleteDepartment,
    addActivity, updateActivity, deleteActivity
  } = useData();

  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [activeTab, setActiveTab] = useState("organization");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [scenarioToEdit, setScenarioToEdit] = useState<Scenario | null>(null);
  const [scenarioToDelete, setScenarioToDelete] = useState<string | null>(null);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [phaseToEdit, setPhaseToEdit] = useState<Phase | null>(null);
  const [phaseToDelete, setPhaseToDelete] = useState<string | null>(null);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [personnelToEdit, setPersonnelToEdit] = useState<Personnel | null>(null);
  const [personnelToDelete, setPersonnelToDelete] = useState<string | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const [isDeletingScenario, setIsDeletingScenario] = useState(false);
  const [isDeletingResource, setIsDeletingResource] = useState(false);
  const [isDeletingPhase, setIsDeletingPhase] = useState(false);
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [isDeletingPersonnel, setIsDeletingPersonnel] = useState(false);
  const [factoryToEdit, setFactoryToEdit] = useState<Factory | null>(null);
  const [factoryToDelete, setFactoryToDelete] = useState<string | null>(null);
  const [isDeletingFactory, setIsDeletingFactory] = useState(false);
  const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null);
  const [isDeletingDepartment, setIsDeletingDepartment] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [isDeletingActivity, setIsDeletingActivity] = useState(false);
  const [currentPhaseIdForModal, setCurrentPhaseIdForModal] = useState<string | null>(null);

  // --- Unified Delete Confirmation Logic ---
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; name?: string } | null>(null);

  const confirmDeleteItem = (id: string, type: string, name?: string) => {
    setItemToDelete({ id, type, name: name || type }); // Use type as fallback name
  };

  const cancelDelete = () => {
    setItemToDelete(null);
    setIsDeleting(false); // Ensure loading state is reset on cancel
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    const { id, type } = itemToDelete;
    let deleteFunction: ((id: string) => Promise<void>) | undefined;
    let itemName = itemToDelete?.name;

    try {
      switch (type) {
        case 'task': deleteFunction = deleteTask; break;
        case 'client': deleteFunction = deleteClient; break;
        case 'scenario': deleteFunction = deleteScenario; break;
        case 'resource': deleteFunction = deleteResource; break;
        case 'phase': 
            deleteFunction = async (phaseId) => { // Custom logic for phase
                const activitiesToDelete = activities.filter(act => act.phaseId === phaseId);
                if (!deletePhase || !deleteActivity) throw new Error("Delete functions not available.");
                for (const activity of activitiesToDelete) { await deleteActivity(activity.id); }
                await deletePhase(phaseId);
            };
            itemName += ' and associated activities';
            break;
        case 'role': deleteFunction = deleteRole; break;
        case 'personnel': deleteFunction = deletePersonnel; break;
        case 'factory': deleteFunction = deleteFactory; 
             if (factories.length <= 1) {
                 toast.error("Cannot delete the last factory.");
                 throw new Error("Cannot delete last factory"); // Prevent deletion
             }
             break;
        case 'department': deleteFunction = deleteDepartment; 
            // Dependency check logic moved to description, deletion proceeds
            break; 
        case 'activity': deleteFunction = deleteActivity; break;
        default: throw new Error('Invalid item type for deletion');
      }

      if (!deleteFunction) {
          toast.error(`Delete function for ${type} is not available.`);
          throw new Error(`Delete function for ${type} not available.`);
      }

      await deleteFunction(id);
      toast.success(`${(itemName || type).charAt(0).toUpperCase() + (itemName || type).slice(1)} deleted successfully!`);
      
      // Special handling after factory delete
      if(type === 'factory') {
           setSelectedFactory(factories.length > 0 ? factories[0] : null);
      }

      setItemToDelete(null); // Close dialog on success

    } catch (err) {
      console.error(`Failed to delete ${type}:`, err);
      // Avoid showing toast if it was a specific user error handled above (like last factory)
      if (!(err instanceof Error && err.message === "Cannot delete last factory")) {
           toast.error(`Failed to delete ${itemName}.`, { description: err instanceof Error ? err.message : undefined });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!selectedDepartmentId) {
      return tasks || [];
    }
    return (tasks || []).filter(task => task.departmentId === selectedDepartmentId);
  }, [tasks, selectedDepartmentId]);

  const selectedDepartmentName = useMemo(() => {
    return (departments || []).find(d => d.id === selectedDepartmentId)?.name;
  }, [departments, selectedDepartmentId]);

  const filteredRoles = useMemo(() => {
    if (!selectedFactory) return [];
    return (roles || []).filter(r => !r.factorySpecific || r.factoryId === selectedFactory.id);
  }, [roles, selectedFactory]);

  // Filter for unassigned personnel
  const unassignedPersonnel = useMemo(() => {
    return (personnel || []).filter(p => !p.assignedRole);
  }, [personnel]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (factories && factories.length > 0 && !selectedFactory) {
      setSelectedFactory(factories[0]);
    } else if (selectedFactory && factories && !factories.some(f => f.id === selectedFactory.id)) {
      setSelectedFactory(factories.length > 0 ? factories[0] : null);
    }
  }, [factories, selectedFactory]);

  if (authLoading || dataLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading application data...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <PageContainer>
        <Header />
        <div className="text-red-600">Error loading data: {error}</div>
      </PageContainer>
    );
  }
  
  const openFactoryModal = (factory: Factory | null = null) => {
    setFactoryToEdit(factory);
    setModalTitle(factory ? 'Edit Factory' : 'Add New Factory');
    setModalContent(
      <AddFactoryForm 
        initialData={factory || undefined}
        onSubmit={handleFactorySubmit} 
        onCancel={() => { setIsModalOpen(false); setFactoryToEdit(null); }} 
      />
    );
    setIsModalOpen(true);
  };
  const handleFactorySubmit = async (factoryData: Omit<Factory, 'id'>) => {
    const isEditing = !!factoryToEdit;
    try {
      if (isEditing) {
        if (!updateFactory) return toast.error("Update function not available.");
        await updateFactory(factoryToEdit.id, factoryData);
        toast.success(`Factory '${factoryData.name}' updated successfully!`);
        if (selectedFactory && selectedFactory.id === factoryToEdit.id) {
           setSelectedFactory({ ...factoryToEdit, ...factoryData });
        }
      } else {
        if (!addFactory) return toast.error("Add function not available.");
        await addFactory(factoryData);
        toast.success(`Factory '${factoryData.name}' added successfully!`);
      }
      setIsModalOpen(false);
      setFactoryToEdit(null);
    } catch (err) { 
      console.error("Failed to submit factory:", err);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} factory.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  const openRoleModal = (role: Role | null = null) => {
    setRoleToEdit(role);
    setModalTitle(role ? 'Edit Role' : 'Add New Role');
    setModalContent(
      <AddRoleForm 
        initialData={role ? { ...role, salaryMin: role.salary.min, salaryMax: role.salary.max } : undefined}
        onSubmit={handleRoleSubmit} 
        onCancel={() => { setIsModalOpen(false); setRoleToEdit(null); }} 
        departments={departments} 
        factories={factories} 
        selectedFactoryId={selectedFactory?.id} 
      />
    );
    setIsModalOpen(true);
  };
  const handleRoleSubmit = async (roleData: RoleFormData) => {
    const isEditing = !!roleToEdit;
    try {
      if (isEditing) {
        if (!updateRole) return toast.error("Update function not available.");
        const updateData: Partial<Role> = {
          ...roleData,
          salary: { min: roleData.salaryMin, max: roleData.salaryMax }
        };
        delete (updateData as any).salaryMin;
        delete (updateData as any).salaryMax;
        await updateRole(roleToEdit.id, updateData);
        toast.success(`Role '${roleData.title}' updated successfully!`);
      } else {
        if (!addRole) return toast.error("Add function not available.");
        const roleToAdd: Omit<Role, 'id'> = {
          title: roleData.title,
          department: roleData.departmentId || 'unassigned',
          responsibilities: [],
          level: roleData.level,
          salary: {
            min: Number(roleData.salaryMin) || 0,
            max: Number(roleData.salaryMax) || 0,
          },
          factorySpecific: roleData.factorySpecific,
          factoryId: roleData.factorySpecific ? roleData.factoryId : undefined,
        };
        await addRole(roleToAdd);
        toast.success(`Role '${roleData.title}' added successfully!`);
      }
      setIsModalOpen(false);
      setRoleToEdit(null);
    } catch (err) {
      console.error("Failed to submit role:", err);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} role.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  const openPersonnelModal = (person: Personnel | null = null) => {
    setPersonnelToEdit(person);
    setModalTitle(person ? 'Edit Personnel' : 'Add New Personnel');
    setModalContent(
      <AddPersonnelForm 
        initialData={person || undefined}
        onSubmit={handlePersonnelSubmit} 
        onCancel={() => { setIsModalOpen(false); setPersonnelToEdit(null); }} 
        roles={roles}
        factories={factories}
        selectedFactoryId={selectedFactory?.id}
      />
    );
    setIsModalOpen(true);
  };
  const handlePersonnelSubmit = async (personnelData: PersonnelFormData) => {
    const isEditing = !!personnelToEdit;
    try {
      if (isEditing) {
        if (!updatePersonnel) return toast.error("Update function not available.");
        await updatePersonnel(personnelToEdit.id, personnelData);
         toast.success(`Personnel '${personnelData.name}' updated successfully!`);
      } else {
        if (!addPersonnel) return toast.error("Add function not available.");
        const personnelToAdd: Omit<Personnel, 'id' | 'createdAt' | 'updatedAt'> = personnelData;
        await addPersonnel(personnelToAdd as Omit<Personnel, 'id'>);
         toast.success(`Personnel '${personnelData.name}' added successfully!`);
      }
      setIsModalOpen(false);
      setPersonnelToEdit(null);
    } catch (err) {
      console.error("Failed to submit personnel:", err);
       toast.error(`Failed to ${isEditing ? 'update' : 'add'} personnel.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  const openTaskModal = (task: Task | null = null) => {
    setTaskToEdit(task);
    setModalTitle(task ? 'Edit Task' : 'Add New Task');
    setModalContent(
      <AddTaskForm 
        initialData={task || undefined}
        allTasks={tasks || []}
        onSubmit={handleTaskSubmit} 
        onCancel={() => { setIsModalOpen(false); setTaskToEdit(null); }}
        selectedDepartmentId={selectedDepartmentId} 
      />
    );
    setIsModalOpen(true);
  };

  const handleTaskSubmit = async (taskData: TaskFormData, departmentId: string | null) => {
    const isEditing = !!taskToEdit;
    const factoryId = selectedFactory?.id;
    
    const dependsOn = taskData.dependsOn || [];

    if (isEditing && dependsOn.includes(taskToEdit.id)) {
        toast.error("A task cannot depend on itself.");
        return; 
    }

    const finalDepartmentId = departmentId ?? 'unassigned';
    
    const fullTaskData = { 
      ...taskData, 
      dependsOn, 
      departmentId: finalDepartmentId,
      factoryId 
    };

    try {
      if (isEditing) {
        if (!updateTask) return toast.error("Update function not available.");
        await updateTask(taskToEdit.id, fullTaskData as Partial<Task>); 
        toast.success(`Task '${taskData.name}' updated successfully!`);
      } else {
        if (!addTask) return toast.error("Add function not available.");
        const taskToAdd: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = fullTaskData;
        await addTask(taskToAdd as Omit<Task, 'id'>);
        toast.success(`Task '${taskData.name}' added successfully!`);
      }
      setIsModalOpen(false);
      setTaskToEdit(null);
    } catch (err) {
      console.error("Failed to submit task:", err);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} task.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  const openClientModal = (client: Client | null = null) => {
    setClientToEdit(client);
    setModalTitle(client ? 'Edit Client' : 'Add New Client');
    setModalContent(
      <AddClientForm 
        initialData={client || undefined}
        onSubmit={handleClientSubmit} 
        onCancel={() => { setIsModalOpen(false); setClientToEdit(null); }} 
      />
    );
    setIsModalOpen(true);
  };

  const handleClientSubmit = async (clientData: ClientFormData) => {
    const isEditing = !!clientToEdit;
     try {
      if (isEditing) {
        if (!updateClient) return toast.error("Update function not available.");
        await updateClient(clientToEdit.id, clientData);
         toast.success(`Client '${clientData.name}' updated successfully!`);
      } else {
        if (!addClient) return toast.error("Add function not available.");
        await addClient(clientData);
         toast.success(`Client '${clientData.name}' added successfully!`);
      }
      setIsModalOpen(false);
      setClientToEdit(null);
    } catch (err) {
      console.error("Failed to submit client:", err);
       toast.error(`Failed to ${isEditing ? 'update' : 'add'} client.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  const openScenarioModal = (scenario: Scenario | null = null) => {
    setScenarioToEdit(scenario);
    setModalTitle(scenario ? 'Edit Scenario' : 'Add New Scenario');
    setModalContent(
      <AddScenarioForm 
        initialData={scenario || undefined}
        onSubmit={handleScenarioSubmit} 
        onCancel={() => { setIsModalOpen(false); setScenarioToEdit(null); }} 
      />
    );
    setIsModalOpen(true);
  };

  const handleScenarioSubmit = async (scenarioData: ScenarioFormData) => {
    const isEditing = !!scenarioToEdit;
    try {
      if (isEditing) {
        if (!updateScenario) return toast.error("Update function not available.");
        await updateScenario(scenarioToEdit.id, scenarioData);
         toast.success(`Scenario '${scenarioData.name}' updated successfully!`);
      } else {
        if (!addScenario) return toast.error("Add function not available.");
        await addScenario(scenarioData);
         toast.success(`Scenario '${scenarioData.name}' added successfully!`);
      }
      setIsModalOpen(false);
      setScenarioToEdit(null);
    } catch (err) {
      console.error("Failed to submit scenario:", err);
       toast.error(`Failed to ${isEditing ? 'update' : 'add'} scenario.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  const openResourceModal = (resource: Resource | null = null) => {
    setResourceToEdit(resource);
    setModalTitle(resource ? 'Edit Resource' : 'Add New Resource');
    setModalContent(
      <AddResourceForm 
        initialData={resource || undefined}
        onSubmit={handleResourceSubmit} 
        onCancel={() => { setIsModalOpen(false); setResourceToEdit(null); }} 
      />
    );
    setIsModalOpen(true);
  };

  const handleResourceSubmit = async (resourceData: ResourceFormData) => {
    const isEditing = !!resourceToEdit;
    try {
       if (isEditing) {
        if (!updateResource) return toast.error("Update function not available.");
        await updateResource(resourceToEdit.id, resourceData);
         toast.success(`Resource '${resourceData.name}' updated successfully!`);
      } else {
        if (!addResource) return toast.error("Add function not available.");
        await addResource(resourceData);
         toast.success(`Resource '${resourceData.name}' added successfully!`);
      }
      setIsModalOpen(false);
      setResourceToEdit(null);
    } catch (err) {
      console.error("Failed to submit resource:", err);
       toast.error(`Failed to ${isEditing ? 'update' : 'add'} resource.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  const openPhaseModal = (phase: Phase | null = null) => {
    setPhaseToEdit(phase);
    setModalTitle(phase ? 'Edit Timeline Phase' : 'Add New Timeline Phase');
    setModalContent(
      <AddPhaseForm 
        initialData={phase ? { name: phase.name, description: phase.description, startDate: phase.startDate, endDate: phase.endDate } : undefined}
        onSubmit={handlePhaseSubmit} 
        onCancel={() => { setIsModalOpen(false); setPhaseToEdit(null); }} 
      />
    );
    setIsModalOpen(true);
  };

  const handlePhaseSubmit = async (phaseData: PhaseFormData) => {
    const isEditing = !!phaseToEdit;
    try {
      if (isEditing) {
        if (!updatePhase) return toast.error("Update function not available.");
        await updatePhase(phaseToEdit.id, phaseData);
         toast.success(`Phase '${phaseData.name}' updated successfully!`);
      } else {
        if (!addPhase) return toast.error("Add function not available.");
        await addPhase(phaseData);
         toast.success(`Phase '${phaseData.name}' added successfully!`);
      }
      setIsModalOpen(false);
      setPhaseToEdit(null);
    } catch (err) {
      console.error("Failed to submit phase:", err);
       toast.error(`Failed to ${isEditing ? 'update' : 'add'} phase.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  const openDepartmentModal = (department: Department | null = null) => {
    setDepartmentToEdit(department);
    setModalTitle(department ? 'Edit Department' : 'Add New Department');
    setModalContent(
      <AddDepartmentForm
        initialData={department || undefined}
        onSubmit={handleDepartmentSubmit}
        onCancel={() => { setIsModalOpen(false); setDepartmentToEdit(null); }}
      />
    );
    setIsModalOpen(true);
  };

  const handleDepartmentSubmit = async (departmentData: DepartmentFormData) => {
    const isEditing = !!departmentToEdit;
    try {
      if (isEditing) {
        if (!updateDepartment) return toast.error("Update function not available.");
        await updateDepartment(departmentToEdit.id, departmentData);
        toast.success(`Department '${departmentData.name}' updated successfully!`);
      } else {
        if (!addDepartment) return toast.error("Add function not available.");
        await addDepartment(departmentData);
        toast.success(`Department '${departmentData.name}' added successfully!`);
      }
      setIsModalOpen(false);
      setDepartmentToEdit(null);
    } catch (err) {
      console.error("Failed to submit department:", err);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} department.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  const openActivityModal = (phaseId: string, activity: Activity | null = null) => {
    setCurrentPhaseIdForModal(phaseId);
    setActivityToEdit(activity);
    setModalTitle(activity ? 'Edit Activity' : 'Add New Activity');
    setModalContent(
      <AddActivityForm
        initialData={activity || undefined}
        onSubmit={handleActivitySubmit}
        onCancel={() => { setIsModalOpen(false); setActivityToEdit(null); setCurrentPhaseIdForModal(null); }}
      />
    );
    setIsModalOpen(true);
  };

  const handleActivitySubmit = async (activityData: ActivityFormData) => {
    const isEditing = !!activityToEdit;
    const phaseId = isEditing ? activityToEdit.phaseId : currentPhaseIdForModal;
    if (!phaseId) {
      toast.error("Cannot save activity without a phase context.");
      return;
    }
    const fullActivityData = { ...activityData, phaseId };
    try {
      if (isEditing) {
        if (!updateActivity) return toast.error("Update function not available.");
        await updateActivity(activityToEdit.id, fullActivityData);
        toast.success(`Activity '${activityData.name}' updated successfully!`);
      } else {
        if (!addActivity) return toast.error("Add function not available.");
        await addActivity(fullActivityData);
        toast.success(`Activity '${activityData.name}' added successfully!`);
      }
      setIsModalOpen(false);
      setActivityToEdit(null);
      setCurrentPhaseIdForModal(null);
    } catch (err) {
      console.error("Failed to submit activity:", err);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} activity.`, { description: err instanceof Error ? err.message : undefined });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <PageContainer>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Personnel & Organization</h1>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              {factories && factories.length > 0 && (
                <Select
                  value={selectedFactory?.id || ''}
                  onValueChange={(id) => setSelectedFactory(factories.find(f => f.id === id) || null)}
                  disabled={!factories || factories.length === 0}
                >
                  <SelectTrigger className="w-full md:w-[280px]">
                    <SelectValue placeholder={factories && factories.length > 0 ? "Select a Factory" : "No factories available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {factories?.map(factory => (
                      <SelectItem key={factory.id} value={factory.id}>
                        {factory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button onClick={() => openFactoryModal()} variant="outline" size="sm">Add Factory</Button> 
              {selectedFactory && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => openFactoryModal(selectedFactory)} title={`Edit ${selectedFactory.name}`}>
                     Edit Factory
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-100 hover:text-red-700"
                    onClick={() => confirmDeleteItem(selectedFactory.id, 'factory', selectedFactory.name)}
                    disabled={factories.length <= 1}
                    title={factories.length <= 1 ? "Cannot delete the last factory" : `Delete ${selectedFactory.name}`}
                  >
                     Delete Factory
                  </Button>
                </>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="organization" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-7 mb-4">
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
            </TabsList>

            <TabsContent value="organization" className="mt-4">
              {selectedFactory ? (
                <Card>
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <CardTitle>Organization Chart - {selectedFactory.name}</CardTitle>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button onClick={() => openRoleModal()} variant="outline" size="sm">Add Role</Button>
                      <Button onClick={() => openPersonnelModal()} variant="default" size="sm">Add Personnel</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <OrganizationDnd 
                       roles={filteredRoles}
                       personnel={personnel || []} 
                       onAssignPersonnel={assignPersonnelToRole}
                       onUnassignPersonnel={unassignPersonnel}
                       selectedFactoryId={selectedFactory.id}
                       onEditRole={openRoleModal}
                       onDeleteRole={(roleId) => confirmDeleteItem(roleId, 'role', roles.find(r=>r.id === roleId)?.title)}
                       onEditPersonnel={openPersonnelModal}
                       onDeletePersonnel={(personnelId) => confirmDeleteItem(personnelId, 'personnel', personnel.find(p=>p.id === personnelId)?.name)}
                     />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground py-10">Please select or add a factory to view the organization chart.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="tasks" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tasks</CardTitle>
                    <CardDescription>Manage tasks assigned to departments.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <DepartmentSelector 
                      departments={departments || []} 
                      selectedDepartmentId={selectedDepartmentId}
                      onSelectDepartment={setSelectedDepartmentId}
                    />
                    <Button onClick={() => openTaskModal()} variant="default" size="sm">Add Task</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <TaskList 
                    tasks={filteredTasks} 
                    allTasks={tasks || []}
                    departmentName={selectedDepartmentName}
                    onEditTask={openTaskModal}
                    onDeleteTask={(taskId) => confirmDeleteItem(taskId, 'task', tasks.find(t=>t.id === taskId)?.name)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="clients" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Clients</CardTitle>
                    <CardDescription>Manage client information.</CardDescription>
                  </div>
                  <Button onClick={() => openClientModal()} variant="default" size="sm">Add Client</Button>
                </CardHeader>
                <CardContent>
                  <ClientList 
                    clients={clients || []} 
                    onEditClient={openClientModal}
                    onDeleteClient={(clientId) => confirmDeleteItem(clientId, 'client', clients.find(c=>c.id === clientId)?.name)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="scenarios" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Scenarios</CardTitle>
                    <CardDescription>Manage potential operational scenarios.</CardDescription>
                  </div>
                  <Button onClick={() => openScenarioModal()} variant="default" size="sm">Add Scenario</Button>
                </CardHeader>
                <CardContent>
                  <ScenarioList 
                    scenarios={scenarios || []} 
                    onEditScenario={openScenarioModal}
                    onDeleteScenario={(scenarioId) => confirmDeleteItem(scenarioId, 'scenario', scenarios.find(s=>s.id === scenarioId)?.name)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Resources</CardTitle>
                    <CardDescription>Manage available resources.</CardDescription>
                  </div>
                  <Button onClick={() => openResourceModal()} variant="default" size="sm">Add Resource</Button>
                </CardHeader>
                <CardContent>
                  <ResourceList 
                    resources={resources || []} 
                    onEditResource={openResourceModal}
                    onDeleteResource={(resourceId) => confirmDeleteItem(resourceId, 'resource', resources.find(r=>r.id === resourceId)?.name)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="timeline" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Project Timeline</CardTitle>
                    <CardDescription>Manage project phases and associated activities.</CardDescription>
                  </div>
                  <Button onClick={() => openPhaseModal()} variant="default" size="sm">Add Phase</Button>
                </CardHeader>
                <CardContent>
                  <TimelineList 
                    phases={phases || []} 
                    activities={activities || []}
                    onEditPhase={openPhaseModal}
                    onDeletePhase={(phaseId) => confirmDeleteItem(phaseId, 'phase', phases.find(p=>p.id === phaseId)?.name)}
                    onAddActivity={openActivityModal}
                    onEditActivity={openActivityModal}
                    onDeleteActivity={(activityId) => confirmDeleteItem(activityId, 'activity', activities.find(a=>a.id === activityId)?.name)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="departments" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Departments</CardTitle>
                    <CardDescription>Manage organizational departments.</CardDescription>
                  </div>
                  <Button onClick={() => openDepartmentModal()} variant="default" size="sm">Add Department</Button>
                </CardHeader>
                <CardContent>
                  <DepartmentList
                    departments={departments || []}
                    onEditDepartment={openDepartmentModal}
                    onDeleteDepartment={(departmentId) => confirmDeleteItem(departmentId, 'department', departments.find(d=>d.id === departmentId)?.name)}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </PageContainer>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => { 
        if (!open) { 
          setIsModalOpen(false); 
          setFactoryToEdit(null);
          setRoleToEdit(null);
          setPersonnelToEdit(null);
          setTaskToEdit(null); 
          setClientToEdit(null);
          setScenarioToEdit(null); 
          setResourceToEdit(null); 
          setPhaseToEdit(null); 
          setDepartmentToEdit(null);
          setActivityToEdit(null);
          setCurrentPhaseIdForModal(null);
          setModalContent(null);
        } 
      }}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          {modalContent}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => { if (!open) cancelDelete(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {itemToDelete?.type.charAt(0).toUpperCase() + itemToDelete?.type.slice(1)}?</AlertDialogTitle>
            <AlertDialogDescription>
               {(() => {
                  let message = `This action cannot be undone. This will permanently delete the ${itemToDelete?.type} '${itemToDelete?.name || itemToDelete?.id}'.`;
                   // Add specific warnings based on type
                   if (itemToDelete?.type === 'phase') {
                       message += " All associated activities will also be deleted.";
                   } else if (itemToDelete?.type === 'department') {
                       const tasksInDeptCount = (tasks || []).filter(t => t.departmentId === itemToDelete?.id).length;
                       const rolesInDeptCount = (roles || []).filter(r => r.department === itemToDelete?.id).length;
                       if (tasksInDeptCount > 0 || rolesInDeptCount > 0) {
                           message += ` WARNING: This department currently has associated tasks (${tasksInDeptCount}) or roles (${rolesInDeptCount}).`;
                       }
                   } else if (itemToDelete?.type === 'role') {
                        message += " Personnel assigned may need to be reassigned.";
                   } else if (itemToDelete?.type === 'factory') {
                        if (factories.length <= 1) {
                            message = "Cannot delete the last factory."; // Override message
                        } else {
                            message += " Ensure roles/personnel are handled if necessary.";
                        }
                   }
                   return message;
               })()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
               onClick={executeDelete} 
               disabled={isDeleting || (itemToDelete?.type === 'factory' && factories.length <= 1)} // Disable if deleting or it's the last factory
               className="bg-red-600 hover:bg-red-700"
              >
              {isDeleting ? "Deleting..." : `Delete ${itemToDelete?.type}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
