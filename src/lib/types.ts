// Types for the PCI Quality Organization Dashboard

// Personnel type
export interface Personnel {
  id: string;
  name: string;
  assignedRole?: string | null;
  assignedFactory?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Role type
export interface Role {
  id: string;
  title: string;
  department: string; // Use DepartmentType if strict typing desired, but string is often easier for Firestore keys
  responsibilities: string[];
  detailedResponsibilities?: {
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
// Consider fetching these from Firestore instead of hardcoding
// export type DType = string; // Temporarily commented out for testing

// Department Interface
export interface Department {
  id: DepartmentType; // Use DepartmentType again
  name: string;
  color?: string; // Made optional
}

// Activity type for timeline
export interface Activity {
  id: string;
  phaseId: string; // Link to Phase
  name: string; // Use name consistently
  description?: string;
  startDate?: number | null; // Use number (milliseconds) or null
  endDate?: number | null;   // Use number (milliseconds) or null
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  assignedPersonnelIds?: string[]; // Optional: Link to Personnel
  order?: number; // Added optional order from previous definition
}

// Phase type for timeline
export interface Phase {
  id: string;
  name: string; // Use name consistently
  timeframe?: string; 
  startDate?: number; 
  endDate?: number; 
  description?: string; 
  // activities?: Activity[]; // Remove - activities fetched separately
  order?: number; // Made optional - consider if needed
}

// Factory type
export interface Factory {
  id: string;
  name: string;
  clients?: string[]; // Array of Client IDs (optional at creation)
  workOrderVolume?: number; // Optional at creation
  specialRequirements?: string[]; // Optional at creation
  // Consider adding createdAt, updatedAt Timestamps
}

// User type
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
  role?: string; // e.g., 'admin', 'manager', 'viewer', fetched from Firestore
}

// Client type
export interface Client {
  id: string;
  name: string;
  factoryId?: string; 
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  workOrderVolume: number;
  complaintVolume?: number; // Made optional
  complexity?: number; 
  specialRequirements?: string[];
  createdAt: number;
  updatedAt: number;
}

// Scenario type
export interface Scenario {
  id: string;
  name: string;
  description?: string;
  userId?: string; 
  factoryId?: string; 
  workOrderVolume?: number; 
  complexity?: number; 
  clientRequirements?: string[]; 
  staffing?: { 
    leadership: number;
    specialist: number;
    associate: number;
  };
  calculatedHeadcount?: { 
      leadership: number;
      specialists: number;
      associates: number;
      total: number;
  };
  createdAt?: number;
  updatedAt?: number;
}

// Task Status Type - Align with form/usage
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'on-hold';

// Task Interface
export interface Task {
  id: string;
  name: string;
  description?: string;
  departmentId: string; // Use departmentId consistently for association
  // targetDepartment?: DepartmentType; // Remove if not used
  factoryId?: string;    // Optional: Link to Factory (for context)
  complexity?: number; 
  effortHours?: number;
  status: TaskStatus;
  // dependencies?: string[]; // Keep dependsOn instead
  personnelImpact?: Record<string, any>; 
  phaseId?: string; // Link to Phase
  createdAt: number;
  updatedAt: number;
  dependsOn?: string[]; // IDs of tasks that must be completed first
}

// Note: Removed Budget and ResourceCalculation types as they seem complex and possibly derived data.
// They can be added back later if needed, perhaps with simpler structures.

// Resource Type (Completed Definition)
export interface Resource {
  id: string;
  name: string;
  category?: string;
  quantity?: number;
  unitCost?: number;
  // Add other fields if necessary
  createdAt: number;
  updatedAt: number;
}

// Department Type Definition (moved)
export type DepartmentType = string; 