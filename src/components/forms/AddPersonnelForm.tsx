"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Personnel, Role, Factory } from '@/lib/types';

// Ensure PersonnelFormData matches the fields used in the form
export interface PersonnelFormData extends Omit<Personnel, 'id' | 'createdAt' | 'updatedAt' | 'employeeId'> {
  name: string;
  assignedRole?: string;
}

interface AddPersonnelFormProps {
  initialData?: PersonnelFormData; // Optional initial data for editing
  onSubmit: (personnelData: PersonnelFormData) => Promise<void>;
  onCancel: () => void;
  roles: Role[];
  factories: Factory[];
  selectedFactoryId?: string | null;
}

const AddPersonnelForm: React.FC<AddPersonnelFormProps> = ({ 
  initialData,
  onSubmit, 
  onCancel,
  roles, 
  factories: _factories, // Prefix with _ to mark as unused
  selectedFactoryId
}) => {
  // Initialize state with initialData or defaults
  const [name, setName] = useState(initialData?.name || '');
  const [assignedRole, setAssignedRole] = useState(initialData?.assignedRole || 'unassigned'); // Default to 'unassigned'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter roles based on selected factory or non-specific roles
  const availableRoles = roles.filter(role => 
    !role.factorySpecific || role.factoryId === selectedFactoryId
  );

  // Effect to update state if initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      // Check if the previously assigned role is still valid in the current context
      const roleIsValid = availableRoles.some(role => role.id === initialData.assignedRole);
      setAssignedRole(roleIsValid ? (initialData.assignedRole || 'unassigned') : 'unassigned'); // Reset if role not valid
    } else {
      // Reset form when switching to add mode
      setName('');
      setAssignedRole('unassigned'); // Reset to 'unassigned'
    }
  // Only re-run this effect if the initialData prop changes (i.e., switching between add/edit)
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const personnelData: PersonnelFormData = { 
      name, 
      assignedRole: assignedRole === 'unassigned' ? null : assignedRole, // Send null instead of undefined
    };

    try {
      await onSubmit(personnelData);
    } catch (err) {
      console.error("Failed to submit personnel:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {/* Name */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="personnel-name" className="text-right">Name</Label>
        <Input 
          id="personnel-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="col-span-3" 
          required 
        />
      </div>
      {/* Assigned Role */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="assigned-role" className="text-right">Assign Role</Label>
        <Select value={assignedRole} onValueChange={setAssignedRole}>
            <SelectTrigger id="assigned-role" className="col-span-3">
                <SelectValue placeholder="Select role (optional)" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                {availableRoles.length > 0 ? (
                    availableRoles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.title}</SelectItem>
                    ))
                ) : (
                    <p className="p-2 text-sm text-muted-foreground text-center">No roles available for this factory context.</p>
                )}
            </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-red-600 col-span-4 text-center">{error}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...': 'Adding...') : (initialData ? 'Save Changes' : 'Add Personnel')}
        </Button>
      </div>
    </form>
  );
};

export default AddPersonnelForm; 