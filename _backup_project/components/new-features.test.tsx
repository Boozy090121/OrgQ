// Test script for new PCI Dashboard functionality
// This script tests the new components and features added to the dashboard

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClientManagement from '@/components/client/ClientManagement';
import ClientBreakdown from '@/components/client/ClientBreakdown';
import DepartmentSelector from '@/components/department/DepartmentSelector';
import DepartmentRoles from '@/components/department/DepartmentRoles';
import DepartmentTasks from '@/components/department/DepartmentTasks';
import PhasedApproach from '@/components/department/PhasedApproach';
import ResourceCalculator from '@/components/resource/ResourceCalculator';

// Mock data for testing
const mockClients = [
  {
    id: 'client-1-1',
    name: 'Acme Corporation',
    contactName: 'John Smith',
    contactEmail: 'john@acme.com',
    contactPhone: '(555) 123-4567',
    workOrderVolume: 150,
    complaintVolume: 25,
    complexity: 4,
    specialRequirements: ['ISO 9001', 'FDA Compliance'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'client-2-1',
    name: 'TechSolutions Inc',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@techsolutions.com',
    contactPhone: '(555) 987-6543',
    workOrderVolume: 200,
    complaintVolume: 15,
    complexity: 3,
    specialRequirements: ['ISO 13485', 'IATF 16949'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const mockDepartments = [
  {
    id: 'dept-quality',
    name: 'Quality',
    description: 'Responsible for quality assurance and control',
    color: '#004B87'
  },
  {
    id: 'dept-operations',
    name: 'Operations',
    description: 'Responsible for manufacturing operations',
    color: '#81C341'
  },
  {
    id: 'dept-engineering',
    name: 'Engineering',
    description: 'Responsible for product and process engineering',
    color: '#F47920'
  }
];

const mockRoles = [
  {
    id: 'role-quality-director',
    title: 'Quality Director',
    department: 'Quality',
    responsibilities: ['Strategic quality planning', 'Quality system oversight', 'Regulatory compliance'],
    detailedResponsibilities: {
      'Strategic Planning': ['Quality strategy development', 'Quality objectives setting', 'Resource allocation']
    },
    salary: { min: 120000, max: 160000 },
    level: 'leadership',
    factorySpecific: false
  },
  {
    id: 'role-operations-manager',
    title: 'Operations Manager',
    department: 'Operations',
    responsibilities: ['Production oversight', 'Team management', 'Process improvement'],
    detailedResponsibilities: {
      'Management': ['Team leadership', 'Resource allocation', 'Performance management']
    },
    salary: { min: 90000, max: 120000 },
    level: 'leadership',
    factorySpecific: true
  }
];

const mockTasks = [
  {
    id: 'task-1',
    name: 'Transfer Quality Inspection Process',
    description: 'Move routine quality inspection tasks from Quality to Operations department',
    currentDepartment: 'Quality',
    targetDepartment: 'Operations',
    complexity: 3,
    effortHours: 120,
    status: 'in-progress',
    dependencies: [],
    personnelImpact: {
      'Quality': {
        leadership: 0,
        specialist: -1,
        associate: -2
      },
      'Operations': {
        leadership: 0,
        specialist: 1,
        associate: 2
      }
    },
    phaseId: 'phase-1',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

const mockPhases = [
  {
    id: 'phase-1',
    title: 'Initial Task Transfer',
    timeframe: 'Q3 2025',
    activities: [
      { id: 'activity-1', title: 'Identify tasks', description: 'Review and select tasks', order: 1 }
    ],
    order: 1,
    tasks: ['task-1'],
    departmentImpact: {
      'Quality': {
        leadership: 0,
        specialist: -1,
        associate: -2
      },
      'Operations': {
        leadership: 0,
        specialist: 1,
        associate: 2
      }
    }
  }
];

// Test functions
describe('Client Management Component', () => {
  test('renders client list correctly', () => {
    render(
      <ClientManagement
        clients={mockClients}
        factoryId="1"
        isAdmin={true}
      />
    );
    
    // Check if client names are displayed
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('TechSolutions Inc')).toBeInTheDocument();
    
    // Check if work order and complaint volumes are displayed
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });
  
  test('allows adding new clients when admin', () => {
    const handleCreate = jest.fn();
    
    render(
      <ClientManagement
        clients={mockClients}
        factoryId="1"
        onClientCreate={handleCreate}
        isAdmin={true}
      />
    );
    
    // Check if Add Client button is present
    const addButton = screen.getByText('Add Client');
    expect(addButton).toBeInTheDocument();
    
    // Click the button to open modal
    fireEvent.click(addButton);
    
    // Check if modal is displayed
    expect(screen.getByText('Add New Client')).toBeInTheDocument();
  });
});

describe('Client Breakdown Component', () => {
  test('renders client breakdown correctly', () => {
    render(
      <ClientBreakdown
        clients={mockClients}
        factoryId="1"
      />
    );
    
    // Check if component title is displayed
    expect(screen.getByText('Client Breakdown')).toBeInTheDocument();
    
    // Check if work order and complaint tabs are present
    expect(screen.getByText('Work Orders')).toBeInTheDocument();
    expect(screen.getByText('Complaints')).toBeInTheDocument();
    
    // Check if client names are displayed in the breakdown
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('TechSolutions Inc')).toBeInTheDocument();
  });
  
  test('switches between work orders and complaints view', () => {
    render(
      <ClientBreakdown
        clients={mockClients}
        factoryId="1"
      />
    );
    
    // Default view should be work orders
    expect(screen.getByText('Work Order Distribution')).toBeInTheDocument();
    
    // Click on Complaints tab
    fireEvent.click(screen.getByText('Complaints'));
    
    // View should change to complaints
    expect(screen.getByText('Complaint Distribution')).toBeInTheDocument();
  });
});

describe('Department Selector Component', () => {
  test('renders department options correctly', () => {
    const handleChange = jest.fn();
    
    render(
      <DepartmentSelector
        selectedDepartment="Quality"
        onDepartmentChange={handleChange}
      />
    );
    
    // Check if all department options are displayed
    expect(screen.getByText('Quality')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });
  
  test('calls change handler when department is selected', () => {
    const handleChange = jest.fn();
    
    render(
      <DepartmentSelector
        selectedDepartment="Quality"
        onDepartmentChange={handleChange}
      />
    );
    
    // Click on Operations department
    fireEvent.click(screen.getByText('Operations'));
    
    // Check if change handler was called with correct department
    expect(handleChange).toHaveBeenCalledWith('Operations');
  });
});

describe('Department Roles Component', () => {
  test('renders roles filtered by department', () => {
    render(
      <DepartmentRoles
        roles={mockRoles}
        departments={mockDepartments}
      />
    );
    
    // Initially should show Quality roles
    expect(screen.getByText('Quality Director')).toBeInTheDocument();
    
    // Operations roles should not be visible yet
    expect(screen.queryByText('Operations Manager')).not.toBeInTheDocument();
    
    // Click on Operations department
    fireEvent.click(screen.getByText('Operations'));
    
    // Now Operations roles should be visible
    expect(screen.getByText('Operations Manager')).toBeInTheDocument();
    
    // Quality roles should no longer be visible
    expect(screen.queryByText('Quality Director')).not.toBeInTheDocument();
  });
});

describe('Department Tasks Component', () => {
  test('renders task migration board correctly', () => {
    render(
      <DepartmentTasks
        tasks={mockTasks}
        departments={mockDepartments}
        isAdmin={true}
      />
    );
    
    // Check if component title is displayed
    expect(screen.getByText('Task Migration')).toBeInTheDocument();
    
    // Check if task is displayed
    expect(screen.getByText('Transfer Quality Inspection Process')).toBeInTheDocument();
    
    // Check if departments are displayed
    expect(screen.getByText('From:')).toBeInTheDocument();
    expect(screen.getByText('To:')).toBeInTheDocument();
    expect(screen.getAllByText('Quality')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Operations')[0]).toBeInTheDocument();
  });
  
  test('allows adding new tasks when admin', () => {
    const handleCreate = jest.fn();
    
    render(
      <DepartmentTasks
        tasks={mockTasks}
        departments={mockDepartments}
        onTaskCreate={handleCreate}
        isAdmin={true}
      />
    );
    
    // Check if Add Task button is present
    const addButton = screen.getByText('Add Task');
    expect(addButton).toBeInTheDocument();
    
    // Click the button to open modal
    fireEvent.click(addButton);
    
    // Check if modal is displayed
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });
});

describe('Phased Approach Component', () => {
  test('renders phases correctly', () => {
    render(
      <PhasedApproach
        phases={mockPhases}
        tasks={mockTasks}
        isAdmin={true}
      />
    );
    
    // Check if component title is displayed
    expect(screen.getByText('Phased Deployment Approach')).toBeInTheDocument();
    
    // Check if phase is displayed
    expect(screen.getByText('Phase 1: Initial Task Transfer')).toBeInTheDocument();
    expect(screen.getByText('Q3 2025')).toBeInTheDocument();
    
    // Check if task is displayed in the phase
    expect(screen.getByText('Transfer Quality Inspection Process')).toBeInTheDocument();
    
    // Check if department impact is displayed
    expect(screen.getByText('Department Impact')).toBeInTheDocument();
    expect(screen.getAllByText('Quality')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Operations')[0]).toBeInTheDocument();
  });
  
  test('allows adding new phases when admin', () => {
    const handleCreate = jest.fn();
    
    render(
      <PhasedApproach
        phases={mockPhases}
        tasks={mockTasks}
        onPhaseCreate={handleCreate}
        isAdmin={true}
      />
    );
    
    // Check if Add Phase button is present
    const addButton = screen.getByText('Add Phase');
    expect(addButton).toBeInTheDocument();
    
    // Click the button to open modal
    fireEvent.click(addButton);
    
    // Check if modal is displayed
    expect(screen.getByText('Create New Phase')).toBeInTheDocument();
  });
});

describe('Resource Calculator Component', () => {
  test('renders calculator with complaint metrics', () => {
    render(
      <ResourceCalculator
        initialData={{
          id: 'calculator',
          factoryId: '1',
          workOrderVolume: 400,
          complaintVolume: 50,
          managerToClientRatio: 3,
          staffing: {
            leadership: 3,
            specialist: 10,
            associate: 12
          }
        }}
        isAdmin={true}
      />
    );
    
    // Check if work order and complaint inputs are displayed
    expect(screen.getByLabelText('Work Order Volume')).toBeInTheDocument();
    expect(screen.getByLabelText('Complaint Volume')).toBeInTheDocument();
    
    // Check if manager to client ratio input is displayed
    expect(screen.getByLabelText('Manager to Client Ratio')).toBeInTheDocument();
    
    // Check if calculation factors section is displayed
    expect(screen.getByText('Calculation Factors')).toBeInTheDocument();
    expect(screen.getByText(/1 specialist per 100 complaints/)).toBeInTheDocument();
  });
  
  test('updates calculations when inputs change', () => {
    render(
      <ResourceCalculator
        initialData={{
          id: 'calculator',
          factoryId: '1',
          workOrderVolume: 400,
          complaintVolume: 50,
          managerToClientRatio: 3,
          staffing: {
            leadership: 3,
            specialist: 10,
            associate: 12
          }
        }}
        isAdmin={true}
      />
    );
    
    // Get the complaint volume input
    const complaintInput = screen.getByLabelText('Complaint Volume');
    
    // Change the complaint volume
    fireEvent.change(complaintInput, { target: { value: '100' } });
    
    // Check if the recommended staffing updates
    // This would require more specific implementation details to test accurately
    // For now, we'll just verify the input change worked
    expect(complaintInput.value).toBe('100');
  });
});

// Run all tests
console.log('Running tests for new PCI Dashboard functionality...');
// In a real environment, these tests would be run with Jest or another testing framework
