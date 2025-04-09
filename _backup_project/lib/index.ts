// Types for the PCI Quality Organization Dashboard

// Personnel type
export interface Personnel {
  id: string;
  name: string;
  assignedRole?: string;
  assignedFactory?: string;
  createdAt: number;
  updatedAt: number;
  // Add other potential fields like skills, certifications, etc.
}

// Role type
export interface Role {
  id: string;
  title: string;
  department: string;
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
  factoryId?: string;
}

// Department Type (Union of possible department names)
export type DepartmentType = 'Quality' | 'Operations' | 'Engineering';

// Department Interface
export interface Department {
  id: DepartmentType; 
  name: string;       
  color: string;      
}

// Activity type for timeline
export interface Activity {
  id: string;
  title: string;
  description: string; // Was missing
  order: number;
  phaseId?: string; // Link back to phase
}

// Phase type for timeline
export interface Phase {
  id: string;
  title: string;
  timeframe: string; // Could be more structured (startDate, endDate)
  startDate?: number; // Added start date timestamp
  endDate?: number; // Added end date timestamp
  description?: string; // Added description
  activities: Activity[]; 
  order: number;
}

// Budget type (Consider simplifying or refining based on actual use)
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
}

// Factory type
export interface Factory {
  id: string;
  name: string;
  clients: string[]; // Array of Client IDs
  workOrderVolume: number;
  specialRequirements: string[];
}

// Resource calculation type (Likely calculated, not stored directly?)
export interface ResourceCalculation {
  id: string;
  name: string;
  workOrders: number;
  complexity: number;
  clientRequirements: string[];
  managerToClientRatio: number;
  specialistToWorkOrderRatio: number;
  calculatedHeadcount: {
    leadership: number;
    specialists: number;
    associates: number;
    total: number;
  };
}

// User type
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  role?: string;
}

// Client type
export interface Client {
  id: string;
  name: string;
  factoryId?: string; // Added factoryId to link client to factory
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  workOrderVolume: number;
  complaintVolume: number;
  complexity: number; 
  specialRequirements: string[];
  createdAt: number;
  updatedAt: number;
}

// Scenario type
export interface Scenario {
  id: string;
  name: string;
  description?: string; // Added description
  userId?: string; 
  factoryId?: string; // Added factoryId
  workOrderVolume?: number; // Added workOrderVolume
  complexity?: number; // Added complexity
  clientRequirements?: string[]; // Added clientRequirements
  staffing?: { // Added staffing structure
    leadership: number;
    specialist: number;
    associate: number;
  };
  calculatedHeadcount?: { // Keep if used separately
      leadership: number;
      specialists: number;
      associates: number;
      total: number;
  };
  createdAt?: number; // Added createdAt
  updatedAt?: number; // Added updatedAt
}

// Task Status Type
export type TaskStatus = 'planned' | 'in-progress' | 'completed' | 'cancelled';

// Task Interface
export interface Task {
  id: string;
  name: string;
  description?: string;
  currentDepartment: DepartmentType;
  targetDepartment: DepartmentType;
  complexity: number; 
  effortHours: number;
  status: TaskStatus;
  dependencies: string[];
  personnelImpact: Record<string, any>; // Kept as placeholder - needs specific structure
  phaseId?: string; // Link to Phase
  createdAt: number;
  updatedAt: number;
}
