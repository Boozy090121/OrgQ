"use client";

import React, { useState } from 'react';
import { Role, Department, Factory } from '@/lib/types';
import { Input } from '@/lib/components/ui/input';
import { Button } from '@/lib/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/lib/components/ui/card';
import { Label } from '@/lib/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { Textarea } from "@/lib/components/ui/textarea";

// Type for the role data being submitted (excluding generated id)
export type RoleFormData = Omit<Role, 'id' | 'detailedResponsibilities'>;

interface AddRoleFormProps {
  onSubmit: (roleData: RoleFormData) => Promise<void>;
  onCancel: () => void;
  departments: Department[]; // Pass available departments for dropdown
  factories: Factory[];     // Pass factories for factory-specific dropdown
  selectedFactoryId?: string; // Pre-select if adding role within a factory context
}

const AddRoleForm: React.FC<AddRoleFormProps> = ({ 
  onSubmit, 
  onCancel, 
  departments,
  factories,
  selectedFactoryId
}) => {
  const [title, setTitle] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [level, setLevel] = useState<'leadership' | 'specialist' | 'associate'>('associate');
  const [minSalary, setMinSalary] = useState<string>('');
  const [maxSalary, setMaxSalary] = useState<string>('');
  const [factorySpecific, setFactorySpecific] = useState<boolean>(!!selectedFactoryId);
  const [factoryId, setFactoryId] = useState<string | undefined>(selectedFactoryId || undefined);
  const [responsibilities, setResponsibilities] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!title.trim()) return setError('Title is required.');
    if (!department) return setError('Department is required.');
    const minSalNum = parseInt(minSalary);
    const maxSalNum = parseInt(maxSalary);
    if (isNaN(minSalNum) || minSalNum <= 0) return setError('Valid Minimum Salary is required.');
    if (isNaN(maxSalNum) || maxSalNum <= 0) return setError('Valid Maximum Salary is required.');
    if (minSalNum >= maxSalNum) return setError('Maximum Salary must be greater than Minimum Salary.');
    if (factorySpecific && !factoryId) return setError('Please select a factory if role is factory-specific.');

    setIsLoading(true);

    const roleData: RoleFormData = {
      title: title.trim(),
      department,
      level,
      salary: { min: minSalNum, max: maxSalNum },
      factorySpecific,
      factoryId: factorySpecific ? factoryId : undefined,
      responsibilities: responsibilities.split('\n').map(r => r.trim()).filter(r => r !== ''),
      // detailedResponsibilities can be added later or default to empty
    };

    try {
      await onSubmit(roleData);
      // Parent (onSubmit handler) should close the modal on success
    } catch (err) {
      console.error("Error adding role:", err);
      setError(err instanceof Error ? err.message : 'Failed to add role. Please try again.');
      setIsLoading(false); // Keep modal open on error
    }
  };

  return (
    <Card className="border-none shadow-none">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          {/* Title handled by Modal */}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="roleTitle">Role Title *</Label>
            <Input
              id="roleTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Quality Inspector"
              disabled={isLoading}
              required
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="roleDepartment">Department *</Label>
            <Select 
              value={department} 
              onValueChange={setDepartment} 
              disabled={isLoading}
              required
            >
              <SelectTrigger id="roleDepartment">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label htmlFor="roleLevel">Level *</Label>
            <Select 
              value={level} 
              onValueChange={(value: 'leadership' | 'specialist' | 'associate') => setLevel(value)}
              disabled={isLoading}
              required
            >
              <SelectTrigger id="roleLevel">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="specialist">Specialist</SelectItem>
                <SelectItem value="associate">Associate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Min Salary ($) *</Label>
              <Input
                id="minSalary"
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="e.g., 40000"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSalary">Max Salary ($) *</Label>
              <Input
                id="maxSalary"
                type="number"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                placeholder="e.g., 60000"
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          {/* Factory Specific */}
          <div className="items-top flex space-x-2 pt-2">
             <Checkbox 
                id="factorySpecific"
                checked={factorySpecific}
                onCheckedChange={(checked) => {
                    const isChecked = checked === true;
                    console.log('Checkbox clicked, isChecked:', isChecked);
                    setFactorySpecific(isChecked);
                    if (!isChecked) {
                        setFactoryId(undefined); // Clear factory ID if unchecked
                    } else if (selectedFactoryId) {
                        setFactoryId(selectedFactoryId); // Reset to initial if checked again
                    }
                }}
                disabled={isLoading}
             />
             <div className="grid gap-1.5 leading-none">
               <label
                 htmlFor="factorySpecific"
                 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
               >
                 Factory Specific Role
               </label>
               <p className="text-sm text-muted-foreground">
                 If checked, this role only exists within a specific factory.
               </p>
             </div>
           </div>

          {/* Factory Select (Conditional) - Using Ternary */}
          {console.log('Rendering Ternary, factorySpecific:', factorySpecific)}
          {factorySpecific ? (
            <div className="space-y-2">
              <Label htmlFor="factoryId">Factory *</Label>
              <Select 
                value={factoryId || ''} 
                onValueChange={setFactoryId} 
                disabled={isLoading}
                required={factorySpecific}
              >
                <SelectTrigger id="factoryId">
                  <SelectValue placeholder="Select Factory" />
                </SelectTrigger>
                <SelectContent>
                  {factories.map(fac => (
                    <SelectItem key={fac.id} value={fac.id}>{fac.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null} {* Explicitly render null when false *}

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
            <Textarea
              id="responsibilities"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="Enter key responsibilities, separated by new lines..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Role'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddRoleForm; 