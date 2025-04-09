"use client";

import React, { useState, useEffect } from 'react';
import { Factory } from '@/lib/types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export interface FactoryFormData extends Omit<Factory, 'id'> {
   // Add form-specific fields if needed
}

interface AddFactoryFormProps {
  initialData?: FactoryFormData; // For editing
  onSubmit: (factoryData: FactoryFormData) => Promise<void>;
  onCancel: () => void;
}

const AddFactoryForm: React.FC<AddFactoryFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setLocation(initialData.location || '');
    } else {
      setName('');
      setLocation('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const factoryData: FactoryFormData = { name, location };

    try {
      await onSubmit(factoryData);
      // Success handling (closing modal, toast) is done by the parent
    } catch (err) {
      console.error("Failed to submit factory:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="factory-name" className="text-right">Name</Label>
        <Input 
          id="factory-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="col-span-3" 
          required 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="factory-location" className="text-right">Location</Label>
        <Textarea 
          id="factory-location" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          className="col-span-3" 
          rows={2}
        />
      </div>

      {error && <p className="text-sm text-red-600 col-span-4 text-center">{error}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...': 'Adding...') : (initialData ? 'Save Changes' : 'Add Factory')}
        </Button>
      </div>
    </form>
  );
};

export default AddFactoryForm; 