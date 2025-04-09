"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import Modal from '@/lib/components/ui/modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs"
import { useAuth } from '@/lib/hooks/useAuth';
import { useData } from '@/lib/context/DataContext';
import OrganizationDnd from '@/components/OrganizationDnd';
import ScenarioManager from '@/components/features/ScenarioManager';
import ScenarioComparison from '@/components/features/ScenarioComparison';
import ResourceCalculator from '@/components/features/ResourceCalculator';
import GapAnalysis from '@/components/features/GapAnalysis';
import BudgetTable from '@/components/features/BudgetTable';
import BudgetChart from '@/components/features/BudgetChart';
import BudgetExport from '@/components/features/BudgetExport';
import TimelineVisualization from '@/components/features/TimelineVisualization';
import DepartmentSelector from '@/components/DepartmentSelector';
import DepartmentRoles from '@/components/DepartmentRoles';
import DepartmentTasks from '@/components/DepartmentTasks';
import ClientManagement from '@/components/ClientManagement';
import ClientBreakdown from '@/components/ClientBreakdown';
import PhasedApproach from '@/components/PhasedApproach';
import { Personnel, Role, Factory, Scenario, Department, Task, DepartmentType, Client, Phase, Activity } from '@/lib';
import AddFactoryForm from '@/components/forms/AddFactoryForm';
import AddRoleForm, { RoleFormData } from '@/components/forms/AddRoleForm';

// --- Mock Data --- 
// Existing mock data (adjust if needed)
const initialRoles: Role[] = [
  { id: 'r1', title: 'Quality Manager', department: 'Quality', level: 'leadership', responsibilities: [], detailedResponsibilities: {}, salary: { min: 80000, max: 120000 }, factorySpecific: false },
  { id: 'r2', title: 'Lead Inspector', department: 'Quality', level: 'specialist', responsibilities: [], detailedResponsibilities: {}, salary: { min: 60000, max: 80000 }, factorySpecific: false },
  { id: 'r3', title: 'Inspector', department: 'Quality', level: 'associate', responsibilities: [], detailedResponsibilities: {}, salary: { min: 40000, max: 60000 }, factorySpecific: false },
  { id: 'r4', title: 'Process Engineer', department: 'Engineering', level: 'specialist', responsibilities: [], detailedResponsibilities: {}, salary: { min: 70000, max: 95000 }, factorySpecific: false },
  { id: 'r5', title: 'Operations Lead', department: 'Operations', level: 'leadership', responsibilities: [], detailedResponsibilities: {}, salary: { min: 75000, max: 110000 }, factorySpecific: true, factoryId: 'f1' },
];
const initialPersonnel: Personnel[] = [
  { id: 'p1', name: 'Alice Wonderland', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'p2', name: 'Bob The Builder', assignedRole: 'r3', assignedFactory: 'f1', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'p3', name: 'Charlie Chaplin', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'p4', name: 'Diana Prince', assignedRole: 'r1', createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'p5', name: 'Ethan Hunt', assignedRole: 'r4', createdAt: Date.now(), updatedAt: Date.now() },
];
const initialFactories: Factory[] = [
  { id: 'f1', name: 'Factory A', clients: ['c1'], workOrderVolume: 1000, specialRequirements: ['ISO 9001'] },
  { id: 'f2', name: 'Factory B', clients: ['c2', 'c3'], workOrderVolume: 2500, specialRequirements: ['AS 9100'] },
];
const initialTimeline: Phase[] = [
  { 
    id: 'phase1', title: 'Phase 1: Setup', timeframe: 'Q1 2024', order: 1, 
    description: "Initial setup and role definition.", 
    startDate: new Date(2024, 0, 1).getTime(), 
    endDate: new Date(2024, 2, 31).getTime(),
    activities: [
      {id: 'a1', title: 'Define Roles', description: 'Finalize roles & responsibilities', order: 1, phaseId: 'phase1'},
      {id: 'a1.1', title: 'Create Job Descriptions', description: 'Draft JDs for new roles', order: 2, phaseId: 'phase1'}
    ] 
  },
  { 
    id: 'phase2', title: 'Phase 2: Rollout', timeframe: 'Q2 2024', order: 2, 
    description: "Hiring and first implementation steps.", 
    startDate: new Date(2024, 3, 1).getTime(), 
    endDate: new Date(2024, 5, 30).getTime(),
    activities: [
      {id: 'a2', title: 'Hire Staff', description: 'Recruit new personnel for roles', order: 1, phaseId: 'phase2'},
      {id: 'a2.1', title: 'Onboard New Hires', description: 'Train new staff', order: 2, phaseId: 'phase2'}
    ] 
  },
];
const initialScenarios: Scenario[] = [
  { 
    id: 's1', name: 'Baseline', userId: 'user1', factoryId: 'f1', 
    description: "Current state analysis",
    workOrderVolume: 1000,
    complexity: 3,
    staffing: { leadership: 1, specialist: 2, associate: 1 },
    calculatedHeadcount: { leadership: 1, specialists: 2, associates: 1, total: 4 },
    createdAt: Date.now() - 86400000 * 5, // 5 days ago
    updatedAt: Date.now() - 86400000 * 2, // 2 days ago
  },
  { 
    id: 's2', name: 'Expansion Plan', userId: 'user1', factoryId: 'f2',
    description: "Projected state after expansion",
    workOrderVolume: 2500,
    complexity: 4,
    staffing: { leadership: 2, specialist: 4, associate: 3 },
    calculatedHeadcount: { leadership: 2, specialists: 4, associates: 3, total: 9 },
    createdAt: Date.now() - 86400000 * 3, // 3 days ago
    updatedAt: Date.now() - 86400000 * 1, // 1 day ago
  },
];

// New Mock Data for Departments, Clients, Tasks
const mockDepartments: Department[] = [
  { id: 'Quality', name: 'Quality Assurance', color: '#3b82f6' },
  { id: 'Operations', name: 'Manufacturing Ops', color: '#10b981' },
  { id: 'Engineering', name: 'Process Engineering', color: '#f97316' },
];
const mockClients: Client[] = [
  { id: 'c1', name: 'Client Alpha', factoryId: 'f1', workOrderVolume: 500, complaintVolume: 10, complexity: 3, specialRequirements: [], createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'c2', name: 'Client Beta', factoryId: 'f2', workOrderVolume: 1200, complaintVolume: 5, complexity: 4, specialRequirements: ['BetaSpec Rev. 2'], createdAt: Date.now(), updatedAt: Date.now() },
  { id: 'c3', name: 'Client Gamma', factoryId: 'f2', workOrderVolume: 800, complaintVolume: 15, complexity: 2, specialRequirements: [], createdAt: Date.now(), updatedAt: Date.now() },
];
const mockTasks: Task[] = [
  { id: 't1', name: 'Implement SPC', phaseId: 'phase1', currentDepartment: 'Quality', targetDepartment: 'Engineering', complexity: 4, effortHours: 80, status: 'planned', dependencies: [], personnelImpact: { Engineering: { specialist: 1 } }, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 't2', name: 'Transfer Audit Process', phaseId: 'phase2', currentDepartment: 'Quality', targetDepartment: 'Operations', complexity: 3, effortHours: 40, status: 'in-progress', dependencies: ['t1'], personnelImpact: { Quality: { associate: -1 }, Operations: { associate: 1 } }, createdAt: Date.now(), updatedAt: Date.now() },
  { id: 't3', name: 'Document Control Update', phaseId: 'phase1', currentDepartment: 'Quality', targetDepartment: 'Quality', complexity: 2, effortHours: 20, status: 'completed', dependencies: [], personnelImpact: {}, createdAt: Date.now(), updatedAt: Date.now() },
];
// --- End Mock Data ---

export default function PersonnelManagementPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // --- Use Live Data --- 
  // Destructure data directly from useData hook
  const {
    personnel, // Use live personnel
    roles,     // Use live roles
    factories, // Use live factories
    scenarios,
    timeline,
    departments, // Use live departments
    tasks,       // Use live tasks
    clients,     // Use live clients
    loading: dataLoading,
    error,
    // Real mutation functions
    addPersonnel,
    updatePersonnel,
    deletePersonnel,
    addRole,
    updateRole,
    deleteRole,
    addFactory,
    updateFactory,
    deleteFactory,
    addScenario,
    updateScenario,
    deleteScenario,
    assignPersonnelToRole,
    unassignPersonnelFromRole,
    addClient,
    updateClient,
    deleteClient,
    addPhase,
    updatePhase,
    deletePhase,
    addActivity,
    updateActivity,
    deleteActivity
  } = useData();

  // --- Remove Mock Data Override ---
  /* 
  // Override data with mock data for UI testing (COMMENTED OUT)
  const personnel = initialPersonnel; 
  const roles = initialRoles;         
  const factories = initialFactories;   
  const scenarios = initialScenarios;   
  const timeline = initialTimeline;     
  const departments = mockDepartments;  
  const clients = mockClients;          
  const tasks = mockTasks;              
  */
  // --- End Remove Mock Data Override ---
  
  const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [activeTab, setActiveTab] = useState("organization");
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (factories.length > 0 && !selectedFactory) {
      setSelectedFactory(factories[0]);
    }
    if (departments.length > 0 && !selectedDepartment) {
       setSelectedDepartment(departments[0].id);
    }
  }, [factories, selectedFactory, departments, selectedDepartment]);

  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      setSelectedClient(clients[0]);
    }
  }, [clients, selectedClient]);

  const budgetCalculations = useMemo(() => {
    const factoryId = selectedFactory?.id;
    const relevantRoles = factoryId
      ? roles.filter(role => role.factoryId === factoryId)
      : roles;

    const result = {
      leadership: 0,
      specialist: 0,
      associate: 0,
      total: 0
    };

    personnel.forEach(person => {
      if (person.assignedRole) {
        const role = relevantRoles.find(r => r.id === person.assignedRole);
        const belongsToFactory = !factoryId || person.assignedFactory === factoryId;

        if (role && belongsToFactory) {
          const midpointSalary = (role.salary.min + role.salary.max) / 2;
          result[role.level] += midpointSalary;
          result.total += midpointSalary;
        }
      }
    });

    return {
      budgetByLevel: {
        leadership: result.leadership,
        specialist: result.specialist,
        associate: result.associate
      },
      totalBudget: result.total
    };
  }, [roles, personnel, selectedFactory]);

  const handleAddPersonnel = () => {
    setModalTitle('Add New Personnel');
    setModalContent(<div>Add Personnel Form Placeholder...</div>); 
    setIsModalOpen(true);
  };

  const handleAddRole = () => {
    setModalTitle('Add New Role');
    setModalContent(<div>Add Role Form Placeholder...</div>);
    setIsModalOpen(true);
  };

  const handleAddFactory = () => {
    setModalTitle('Add New Factory');
    setModalContent(<div>Add Factory Form Placeholder...</div>); 
    setIsModalOpen(true);
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
  };

  const handleSelectClient = (client: Client | null) => {
    setSelectedClient(client);
  };

  // --- Add Factory Modal Logic --- 
  const openAddFactoryModal = () => {
    setModalTitle('Add New Factory');
    setModalContent(
      <AddFactoryForm 
        onSubmit={handleFactorySubmit} 
        onCancel={() => setIsModalOpen(false)} 
      />
    );
    setIsModalOpen(true);
  };

  const handleFactorySubmit = async (factoryData: Omit<Factory, 'id' | 'clients' | 'workOrderVolume' | 'specialRequirements'>) => {
    if (!addFactory) {
        console.error("addFactory function is not available from useData context");
        // Optionally, show an error message to the user in the modal
        // setError("Failed to add factory: Function unavailable."); 
        return; 
    }
    try {
      // Assume addFactory returns the new factory or its ID, or throws error
      await addFactory(factoryData);
      setIsModalOpen(false); // Close modal on success
      // Optionally: add success notification/toast
      // Optionally: update selectedFactory if this is the first one
    } catch (err) {
      console.error("Failed to submit factory:", err);
      // Error state is handled within AddFactoryForm, but re-throwing or handling here is possible
      throw err; // Re-throw to let the form know submission failed
    }
  };
  // --- End Add Factory Modal Logic ---

  // --- Add Role Modal Logic --- 
  const openAddRoleModal = () => {
    setModalTitle('Add New Role');
    setModalContent(
      <AddRoleForm 
        onSubmit={handleRoleSubmit} 
        onCancel={() => setIsModalOpen(false)} 
        departments={departments} // Pass departments data
        factories={factories}       // Pass factories data
        selectedFactoryId={selectedFactory?.id} // Pass selected factory ID
      />
    );
    setIsModalOpen(true);
  };

  const handleRoleSubmit = async (roleData: RoleFormData) => {
    if (!addRole) {
        console.error("addRole function is not available from useData context");
        // Optionally show error in modal
        return; 
    }
    try {
      await addRole(roleData);
      setIsModalOpen(false); // Close modal on success
      // Optionally add success notification
    } catch (err) {
      console.error("Failed to submit role:", err);
      // Error state handled within AddRoleForm
      throw err; // Re-throw to let the form know submission failed
    }
  };
  // --- End Add Role Modal Logic ---

  if (authLoading || dataLoading) {
    return <PageContainer><div className="flex justify-center items-center h-screen"><p>Loading data structure...</p></div></PageContainer>;
  }

  if (error) {
    return <PageContainer><p>Error loading underlying data: {error}</p></PageContainer>; 
  }

  if (!user) {
     return null;
  }

  const filteredRolesByFactory = selectedFactory
    ? roles.filter(role => role.factoryId === selectedFactory.id)
    : roles;
  
  const filteredRolesByDept = selectedDepartment
    ? roles.filter(role => role.department === selectedDepartment)
    : roles;

  const filteredTasksByDept = selectedDepartment
    ? tasks.filter(task => task.currentDepartment === selectedDepartment || task.targetDepartment === selectedDepartment)
    : tasks;

  return (
    <PageContainer>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#004B87]">Personnel & Organization</h1>
        <div className="flex items-center space-x-2">
          <select
            value={selectedFactory?.id || ''}
            onChange={(e) => setSelectedFactory(factories.find(f => f.id === e.target.value) || null)}
            className="p-2 border rounded"
            aria-label="Select Factory"
          >
            <option value="">Select Factory</option>
            {factories.map(factory => (
              <option key={factory.id} value={factory.id}>{factory.name}</option>
            ))}
          </select>
          <Button onClick={openAddFactoryModal} variant="outline">Add Factory</Button> 
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="organization" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-4">
          <TabsTrigger value="organization">Organization Chart</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
          <TabsTrigger value="resources">Resource & Budget</TabsTrigger>
          <TabsTrigger value="timeline">Implementation Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          {selectedFactory ? (
            <Card title={`Organization Chart - ${selectedFactory.name}`}>
              <div className="mb-4 text-right space-x-2">
                 <Button onClick={openAddRoleModal} variant="secondary">Add Role</Button>
                 <Button onClick={handleAddPersonnel} variant="primary">Add Personnel</Button>
              </div>
              <OrganizationDnd
                roles={filteredRolesByFactory}
                personnel={personnel}
                onAssignPersonnel={(personnelId, roleId) => {
                  if (selectedFactory) {
                    assignPersonnelToRole(personnelId, roleId, selectedFactory.id)
                      .catch(err => console.error("Failed to assign personnel:", err));
                  } else {
                    console.error("Cannot assign personnel: No factory selected.");
                  }
                }}
                onUnassignPersonnel={(personnelId) => {
                  unassignPersonnelFromRole(personnelId)
                    .catch(err => console.error("Failed to unassign personnel:", err));
                }}
               />
            </Card>
          ) : (
            <Card>
              <p className="text-center py-10">Please select a factory to view the organization chart.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="departments">
          <Card title="Department Management">
            <div className="mb-4">
              <DepartmentSelector 
                departments={departments} 
                selectedDepartment={selectedDepartment} 
                onSelectDepartment={setSelectedDepartment} 
              />
            </div>
            {selectedDepartment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <h3 className="text-lg font-semibold mb-2">Roles in {selectedDepartment}</h3>
                   <DepartmentRoles 
                     roles={filteredRolesByDept}
                     departments={departments}
                     selectedDepartment={selectedDepartment}
                   />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold mb-2">Tasks for {selectedDepartment}</h3>
                   <DepartmentTasks 
                     tasks={filteredTasksByDept}
                     departments={departments}
                     selectedDepartment={selectedDepartment}
                     isAdmin={user?.isAdmin || false}
                   />
                 </div>
              </div>
            )}
            {!selectedDepartment && (
              <p className="text-center py-10">Please select a department to view roles and tasks.</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card title="Client Management & Analysis">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-3 text-[#004B87]">Manage Clients</h3>
                  <ClientManagement 
                    clients={clients} 
                    selectedFactory={selectedFactory}
                    onAddClient={addClient}
                    onUpdateClient={updateClient}
                    onDeleteClient={deleteClient}
                    onSelectClient={handleSelectClient}
                    selectedClientId={selectedClient?.id}
                    isAdmin={user?.isAdmin || false}
                  />
               </div>
               <div className="lg:col-span-1">
                 <h3 className="text-lg font-semibold mb-3 text-[#004B87]">Client Breakdown</h3>
                 {selectedFactory ? (
                   <ClientBreakdown 
                     clients={clients}
                     factoryId={selectedFactory.id}
                   />
                 ) : (
                   <p className="text-center text-gray-500 py-10">Select a factory to see client breakdown.</p>
                 )}
               </div>
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios">
          <Card> 
            <h3 className="text-xl font-semibold text-[#004B87] mb-4">Scenario Management</h3>
            <ScenarioManager 
              scenarios={scenarios}
              selectedScenarioId={selectedScenario?.id}
              onSaveScenario={addScenario}
              onEditScenario={updateScenario}
              onDeleteScenario={deleteScenario}
              onSelectScenario={handleSelectScenario}
              isAdmin={user?.isAdmin || false}
            />
            <hr className="my-6"/> 
            <h3 className="text-xl font-semibold text-[#004B87] mb-4">Scenario Comparison</h3>
            <ScenarioComparison 
              scenarios={scenarios} 
            /> 
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <Card> 
            <h3 className="text-xl font-semibold text-[#004B87] mb-4">Resource Calculator</h3>
             <ResourceCalculator 
               initialData={selectedScenario} 
               onSave={updateScenario} 
               readOnly={!selectedScenario}
               clients={clients}
               factories={factories}
               activeFactory={selectedFactory?.id || ''}
             />
             <hr className="my-6"/>
             <h3 className="text-xl font-semibold text-[#004B87] mb-4">Gap Analysis</h3>
             <GapAnalysis selectedScenario={selectedScenario} /> 
             <hr className="my-6"/>
             <h3 className="text-xl font-semibold text-[#004B87] mb-4">Budget Table</h3>
             <BudgetTable 
                roles={roles} 
                personnel={personnel} 
                factories={factories} 
                selectedFactory={selectedFactory?.id}
             />
             <hr className="my-6"/>
             <h3 className="text-xl font-semibold text-[#004B87] mb-4">Budget Chart</h3>
             <BudgetChart 
                factories={factories}
                budget={null}
                selectedFactory={selectedFactory?.id}
             /> 
             {selectedFactory && (
               <>
                 <hr className="my-6"/>
                 <BudgetExport 
                    roles={roles} 
                    personnel={personnel} 
                    factories={factories} 
                    selectedFactory={selectedFactory.id}
                    totalBudget={budgetCalculations.totalBudget}
                    budgetByLevel={budgetCalculations.budgetByLevel}
                 /> 
               </>
             )}
          </Card>
        </TabsContent>

        <TabsContent value="timeline"> 
          <Card title="Implementation Timeline & Phased Approach">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#004B87]">Timeline Visualization</h3>
                  <TimelineVisualization 
                     timeline={timeline}
                     isAdmin={user?.isAdmin || false}
                  />
               </div>
               <div>
                  <h3 className="text-lg font-semibold mb-3 text-[#004B87]">Phased Deployment Planning</h3>
                  <PhasedApproach 
                    phases={timeline}
                    tasks={tasks}
                    departments={departments}
                    isAdmin={user?.isAdmin || false}
                  />
               </div>
             </div>
          </Card>
        </TabsContent>

      </Tabs>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle}
      >
        {modalContent}
      </Modal>

    </PageContainer>
  );
}
