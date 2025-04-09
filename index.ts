// Types for the PCI Quality Organization Dashboard

// Department type
export type DepartmentType = 'Quality' | 'Operations' | 'Engineering';

// Department interface
export interface Department {
  id: string;
  name: DepartmentType;
  description: string;
  color: string;
}

// Personnel type
export interface Personnel {
  id: string;
  name: string;
  assignedRole?: string;
  assignedFactory?: string;
  department?: DepartmentType;
  createdAt: number;
  updatedAt: number;
}

// Role type
export interface Role {
  id: string;
  title: string;
  department: DepartmentType;
  responsibilities: string[];
  detailedResponsibilities: {
    [category: string]: string[];
  };
  salary: {
    min: number;
    max: number;
  };
  level: 'leadership' | 'specialist' | 'associate';
  factorySpecific: boolean;
}

// Task type for migration tracking
export interface Task {
  id: string;
  name: string;
  description: string;
  currentDepartment: DepartmentType;
  targetDepartment: DepartmentType;
  complexity: number; // 1-5 scale
  effortHours: number;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  dependencies: string[]; // IDs of tasks that must be completed first
  personnelImpact: {
    [department in DepartmentType]?: {
      leadership: number;
      specialist: number;
      associate: number;
    };
  };
  phaseId: string; // ID of the deployment phase
  createdAt: number;
  updatedAt: number;
}

// Client interface
export interface Client {
  id: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  workOrderVolume: number;
  complaintVolume: number;
  complexity: number; // 1-5 scale
  specialRequirements: string[];
  createdAt: number;
  updatedAt: number;
}

// Activity type for timeline
export interface Activity {
  id: string;
  title: string;
  description: string;
  order: number;
}

// Phase type for timeline
export interface Phase {
  id: string;
  title: string;
  timeframe: string;
  activities: Activity[];
  order: number;
  tasks?: Task[]; // Tasks associated with this phase
  departmentImpact?: {
    [department in DepartmentType]?: {
      leadership: number;
      specialist: number;
      associate: number;
    };
  };
}

// Budget type
export interface Budget {
  leadership: {
    [roleId: string]: {
      headcount: number;
      cost: {
        min: number;
        max: number;
      };
    };
  };
  specialists: {
    [roleId: string]: {
      headcount: number;
      cost: {
        min: number;
        max: number;
      };
    };
  };
  associates: {
    [roleId: string]: {
      headcount: number;
      cost: {
        min: number;
        max: number;
      };
    };
  };
  total: {
    headcount: number;
    cost: {
      min: number;
      max: number;
    };
  };
  factoryBreakdown: {
    [factoryId: string]: {
      headcount: number;
      cost: {
        min: number;
        max: number;
      };
    };
  };
  departmentBreakdown?: {
    [department in DepartmentType]?: {
      headcount: number;
      cost: {
        min: number;
        max: number;
      };
    };
  };
}

// Factory type
export interface Factory {
  id: string;
  name: string;
  clients: Client[];
  workOrderVolume: number;
  complaintVolume: number;
  specialRequirements: string[];
  clientBreakdown?: {
    [clientId: string]: {
      workOrderVolume: number;
      complaintVolume: number;
    };
  };
}

// Resource calculation type
export interface ResourceCalculation {
  id: string;
  name: string;
  workOrders: number;
  complaints: number;
  complexity: number;
  clientRequirements: string[];
  managerToClientRatio: number;
  specialistToWorkOrderRatio: number;
  specialistToComplaintRatio: number;
  calculatedHeadcount: {
    leadership: number;
    specialists: number;
    associates: number;
    total: number;
  };
  departmentBreakdown?: {
    [department in DepartmentType]?: {
      leadership: number;
      specialists: number;
      associates: number;
      total: number;
    };
  };
}

// User type
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
}

// Scenario type for resource planning
export interface Scenario {
  id: string;
  name: string;
  description?: string;
  factoryId: string;
  workOrderVolume: number;
  complaintVolume?: number;
  complexity?: number;
  clientRequirements?: string[];
  managerToClientRatio?: number;
  staffing: {
    leadership: number;
    specialist: number;
    associate: number;
  };
  departmentStaffing?: {
    [department in DepartmentType]?: {
      leadership: number;
      specialist: number;
      associate: number;
    };
  };
  clientBreakdown?: {
    [clientId: string]: {
      workOrderVolume: number;
      complaintVolume: number;
    };
  };
  recommended?: {
    leadership: number;
    specialist: number;
    associate: number;
    total: number;
  };
  gap?: {
    leadership: number;
    specialist: number;
    associate: number;
    total: number;
  };
  phaseId?: string; // ID of the deployment phase this scenario represents
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
}

// Resource Calculator type
export interface ResourceCalculator {
  id: string;
  factoryId: string;
  workOrderVolume: number;
  complaintVolume?: number;
  managerToClientRatio?: number;
  staffing: {
    leadership: number;
    specialist: number;
    associate: number;
  };
  departmentStaffing?: {
    [department in DepartmentType]?: {
      leadership: number;
      specialist: number;
      associate: number;
    };
  };
  recommended?: {
    leadership: number;
    specialist: number;
    associate: number;
    total: number;
  };
  gap?: {
    leadership: number;
    specialist: number;
    associate: number;
    total: number;
  };
}

// Task Migration type
export interface TaskMigration {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  phases: Phase[];
  currentState: {
    [department in DepartmentType]?: {
      leadership: number;
      specialist: number;
      associate: number;
      total: number;
    };
  };
  targetState: {
    [department in DepartmentType]?: {
      leadership: number;
      specialist: number;
      associate: number;
      total: number;
    };
  };
  createdAt: number;
  updatedAt: number;
}
