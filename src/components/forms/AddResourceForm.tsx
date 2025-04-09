"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Resource } from '@/lib/types';

export interface ResourceFormData extends Omit<Resource, 'id'> {
  // Can add form-specific fields here if needed later
}

interface AddResourceFormProps {
  initialData?: ResourceFormData;
  onSubmit: (resourceData: ResourceFormData) => Promise<void>;
  onCancel: () => void;
}

const AddResourceForm: React.FC<AddResourceFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [cost, setCost] = useState<number | '' >(initialData?.cost ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setType(initialData.type || '');
      setDescription(initialData.description || '');
      setCost(initialData.cost ?? '');
    } else {
      setName('');
      setType('');
      setDescription('');
      setCost('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const resourceData: ResourceFormData = { 
      name, 
      type, 
      description, 
      cost: typeof cost === 'number' ? cost : undefined
    };

    try {
      await onSubmit(resourceData);
    } catch (err) {
      console.error("Failed to submit resource:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="resource-name" className="text-right">Name</Label>
        <Input 
          id="resource-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="col-span-3" 
          required 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="resource-type" className="text-right">Type</Label>
        <Input 
          id="resource-type" 
          value={type} 
          onChange={(e) => setType(e.target.value)} 
          className="col-span-3" 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="resource-description" className="text-right">Description</Label>
        <Textarea 
          id="resource-description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="col-span-3" 
          rows={3}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="resource-cost" className="text-right">Cost ($)</Label>
        <Input 
          id="resource-cost" 
          type="number"
          value={cost} 
          onChange={(e) => setCost(e.target.value === '' ? '' : parseFloat(e.target.value))} 
          className="col-span-3" 
          step="0.01"
          min="0"
        />
      </div>

      {error && <p className="text-sm text-red-600 col-span-4 text-center">{error}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Resource')}
        </Button>
      </div>
    </form>
  );
};

export default AddResourceForm; 