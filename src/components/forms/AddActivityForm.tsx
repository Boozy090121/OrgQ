"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from '@/lib/types';

export interface ActivityFormData {
  name: string;
  description?: string;
  startDate?: number | null;
  endDate?: number | null;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
}

interface AddActivityFormProps {
  initialData?: Activity;
  onSubmit: (data: ActivityFormData) => Promise<void>;
  onCancel: () => void;
}

const formatDateForInput = (timestamp: number | null | undefined): string => {
  if (!timestamp) return '';
  try {
    return new Date(timestamp).toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
};

const parseDateFromInput = (dateString: string): number | null => {
  if (!dateString) return null;
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getTime();
  } catch (e) {
    console.error("Error parsing date:", e);
    return null;
  }
};

const AddActivityForm: React.FC<AddActivityFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    status: 'pending',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        startDate: initialData.startDate || null,
        endDate: initialData.endDate || null,
        status: initialData.status,
      });
    } else {
      setFormData({ name: '', description: '', startDate: null, endDate: null, status: 'pending' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseDateFromInput(value) }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as Activity['status'] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to submit activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Activity Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Design Review"
        />
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the activity"
        />
      </div>
       <div className="grid grid-cols-2 gap-4">
        <div>
            <Label htmlFor="startDate">Start Date (Optional)</Label>
            <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formatDateForInput(formData.startDate)}
                onChange={handleDateChange}
            />
        </div>
        <div>
            <Label htmlFor="endDate">End Date (Optional)</Label>
            <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formatDateForInput(formData.endDate)}
                onChange={handleDateChange}
            />
        </div>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={formData.status} onValueChange={handleSelectChange}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Activity')}
        </Button>
      </div>
    </form>
  );
};

export default AddActivityForm; 