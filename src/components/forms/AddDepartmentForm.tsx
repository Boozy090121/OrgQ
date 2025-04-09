"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Department, DepartmentType } from '@/lib/types';

// Define the data structure for the form
export interface DepartmentFormData {
  name: string;
  type: DepartmentType;
  description?: string;
}

interface AddDepartmentFormProps {
  initialData?: Department;
  onSubmit: (data: DepartmentFormData) => Promise<void>;
  onCancel: () => void;
}

const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    type: 'Core' as DepartmentType,
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.id as DepartmentType,
        description: initialData.description || '',
      });
    } else {
      // Reset form when adding new (or if initialData becomes null)
      setFormData({ name: '', type: 'Core' as DepartmentType, description: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as DepartmentType }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      // Let the parent component handle closing/resetting
    } catch (error) {
      console.error("Failed to submit department:", error);
      // Optionally: display error to user within the form
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Department Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Engineering"
        />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select name="type" value={formData.type} onValueChange={handleSelectChange}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select department type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Core">Core</SelectItem>
            <SelectItem value="Support">Support</SelectItem>
            <SelectItem value="Management">Management</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional description"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Department')}
        </Button>
      </div>
    </form>
  );
};

export default AddDepartmentForm; 