"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Department, Factory } from '@/lib/types';

// Adjusted FormData to match form fields more closely
export interface RoleFormData {
  title: string;
  departmentId?: string; // Department might be optional or general
  level: 'leadership' | 'specialist' | 'associate';
  salaryMin: number | '';
  salaryMax: number | '';
  factorySpecific: boolean;
  factoryId?: string;
}

interface AddRoleFormProps {
  initialData?: RoleFormData; // Use the adjusted form data type
  onSubmit: (roleData: RoleFormData) => Promise<void>;
  onCancel: () => void;
  departments: Department[];
  factories: Factory[];
  selectedFactoryId?: string | null;
}

const AddRoleForm: React.FC<AddRoleFormProps> = ({ 
  initialData,
  onSubmit, 
  onCancel,
  departments,
  factories,
  selectedFactoryId
}) => {
  // Initialize state with initialData or defaults
  const [title, setTitle] = useState(initialData?.title || '');
  const [departmentId, setDepartmentId] = useState(initialData?.departmentId || 'none');
  const [level, setLevel] = useState<RoleFormData['level']>(initialData?.level || 'associate');
  const [salaryMin, setSalaryMin] = useState<number | ''>(initialData?.salaryMin ?? '');
  const [salaryMax, setSalaryMax] = useState<number | ''>(initialData?.salaryMax ?? '');
  const [factorySpecific, setFactorySpecific] = useState(initialData?.factorySpecific || !!selectedFactoryId); // Default to true if a factory is selected
  const [factoryId, setFactoryId] = useState(initialData?.factoryId || selectedFactoryId || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to update state if initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDepartmentId(initialData.departmentId || 'none');
      setLevel(initialData.level || 'associate');
      setSalaryMin(initialData.salaryMin ?? '');
      setSalaryMax(initialData.salaryMax ?? '');
      setFactorySpecific(initialData.factorySpecific || false);
      setFactoryId(initialData.factoryId || '');
    } else {
      // Reset form - keep factorySpecific logic
      setTitle('');
      setDepartmentId('none');
      setLevel('associate');
      setSalaryMin('');
      setSalaryMax('');
      setFactorySpecific(!!selectedFactoryId);
      setFactoryId(selectedFactoryId || '');
    }
  }, [initialData, selectedFactoryId]);

  // Update factoryId when factorySpecific changes
   useEffect(() => {
    if (factorySpecific && !factoryId && selectedFactoryId) {
      setFactoryId(selectedFactoryId);
    } else if (!factorySpecific) {
      setFactoryId(''); // Clear factoryId if not specific
    }
  }, [factorySpecific, factoryId, selectedFactoryId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (factorySpecific && !factoryId) {
        setError('Please select a factory for a factory-specific role.');
        setIsLoading(false);
        return;
    }
    
    if (salaryMin !== '' && salaryMax !== '' && salaryMin > salaryMax) {
        setError('Minimum salary cannot be greater than maximum salary.');
        setIsLoading(false);
        return;
    }

    const roleData: RoleFormData = {
      title,
      departmentId: departmentId === 'none' ? undefined : departmentId,
      level,
      salaryMin: salaryMin === '' ? 0 : salaryMin, // Default to 0 if empty
      salaryMax: salaryMax === '' ? 0 : salaryMax,
      factorySpecific,
      factoryId: factorySpecific ? factoryId : undefined,
    };

    try {
      await onSubmit(roleData);
    } catch (err) {
      console.error("Failed to submit role:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
       {/* Title */}
       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role-title" className="text-right">Title</Label>
        <Input id="role-title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" required />
      </div>
      {/* Department */}
      <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="department" className="text-right">Department</Label>
          <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger id="department" className="col-span-3">
                  <SelectValue placeholder="Select department (optional)" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="none">-- No specific department --</SelectItem>
                  {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
      </div>
      {/* Level */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role-level" className="text-right">Level</Label>
         <Select value={level} onValueChange={(value: RoleFormData['level']) => setLevel(value)}>
            <SelectTrigger id="role-level" className="col-span-3">
                <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="specialist">Specialist</SelectItem>
                <SelectItem value="associate">Associate</SelectItem>
            </SelectContent>
        </Select>
      </div>
      {/* Salary Min */}
       <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="salary-min" className="text-right">Min Salary ($)</Label>
          <Input 
              id="salary-min" 
              type="number" 
              value={salaryMin} 
              onChange={(e) => setSalaryMin(e.target.value === '' ? '' : parseFloat(e.target.value))} 
              className="col-span-3" 
              min="0"
          />
      </div>
      {/* Salary Max */}
      <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="salary-max" className="text-right">Max Salary ($)</Label>
          <Input 
              id="salary-max" 
              type="number" 
              value={salaryMax} 
              onChange={(e) => setSalaryMax(e.target.value === '' ? '' : parseFloat(e.target.value))} 
              className="col-span-3" 
              min={salaryMin !== '' ? salaryMin : 0} // Max must be >= Min
          />
      </div>
       {/* Factory Specific Checkbox */}
      <div className="flex items-center space-x-2 col-start-2 col-span-3">
          <Checkbox 
              id="factory-specific" 
              checked={factorySpecific} 
              onCheckedChange={(checked) => setFactorySpecific(Boolean(checked))} 
              disabled={!factories || factories.length === 0} // Disable if no factories
          />
          <Label htmlFor="factory-specific">Role is specific to a factory</Label>
      </div>
      {/* Factory Selector (conditional) */}
      {factorySpecific && (
          <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="factory" className="text-right">Factory</Label>
              <Select value={factoryId} onValueChange={setFactoryId} required={factorySpecific}>
                  <SelectTrigger id="factory" className="col-span-3">
                      <SelectValue placeholder="Select factory" />
                  </SelectTrigger>
                  <SelectContent>
                      {factories.map(factory => (
                          <SelectItem key={factory.id} value={factory.id}>{factory.name}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
      )}

      {error && <p className="text-sm text-red-600 col-span-4 text-center">{error}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...': 'Adding...') : (initialData ? 'Save Changes' : 'Add Role')}
        </Button>
      </div>
    </form>
  );
};

export default AddRoleForm; 