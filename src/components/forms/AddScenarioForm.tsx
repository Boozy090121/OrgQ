"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Scenario } from '@/lib/types';

export interface ScenarioFormData extends Omit<Scenario, 'id'> {
  // Can add form-specific fields here if needed later
}

interface AddScenarioFormProps {
  initialData?: ScenarioFormData;
  onSubmit: (scenarioData: ScenarioFormData) => Promise<void>;
  onCancel: () => void;
}

const AddScenarioForm: React.FC<AddScenarioFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const scenarioData: ScenarioFormData = { name, description };

    try {
      await onSubmit(scenarioData);
    } catch (err) {
      console.error("Failed to submit scenario:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="scenario-name" className="text-right">Name</Label>
        <Input 
          id="scenario-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="col-span-3" 
          required 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="scenario-description" className="text-right">Description</Label>
        <Textarea 
          id="scenario-description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="col-span-3" 
          rows={3}
        />
      </div>
      {/* Add more fields relevant to a scenario as needed */}

      {error && <p className="text-sm text-red-600 col-span-4 text-center">{error}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...': 'Adding...') : (initialData ? 'Save Changes' : 'Add Scenario')}
        </Button>
      </div>
    </form>
  );
};

export default AddScenarioForm; 