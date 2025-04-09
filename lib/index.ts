// Types for the PCI Quality Organization Dashboard

// Personnel type
export interface Personnel {
  id: string;
  name: string;
  assignedRole?: string;
  assignedFactory?: string;
  createdAt: number;
  updatedAt: number;
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
}

// Factory type
export interface Factory {
  id: string;
  name: string;
  clients: string[];
  workOrderVolume: number;
  specialRequirements: string[];
}

// Resource calculation type
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
}
