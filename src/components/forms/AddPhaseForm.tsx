"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phase } from '@/lib/types';

export interface PhaseFormData extends Omit<Phase, 'id'> {
  // Can add form-specific fields here if needed later
}

interface AddPhaseFormProps {
  initialData?: Partial<PhaseFormData>; // Optional initial data for editing
  onSubmit: (phaseData: PhaseFormData) => Promise<void>;
  onCancel: () => void;
}

const AddPhaseForm: React.FC<AddPhaseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  // Helper to format date for input[type=date]
  const formatDateForInput = (dateString: string | undefined | null): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString + 'T00:00:00Z'); // Treat as UTC
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    } catch {
      return '';
    }
  };

  // Initialize state with initialData or defaults
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState(formatDateForInput(initialData?.startDate));
  const [endDate, setEndDate] = useState(formatDateForInput(initialData?.endDate));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to update state if initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setStartDate(formatDateForInput(initialData.startDate));
      setEndDate(formatDateForInput(initialData.endDate));
    } else {
      // Reset form if switching from edit to add
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const phaseData: PhaseFormData = { 
      name, 
      description, 
      startDate: startDate || undefined,
      endDate: endDate || undefined 
    };

    try {
      await onSubmit(phaseData);
    } catch (err) {
      console.error("Failed to submit phase:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phase-name" className="text-right">Name</Label>
        <Input 
          id="phase-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="col-span-3" 
          required 
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phase-description" className="text-right">Description</Label>
        <Textarea 
          id="phase-description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="col-span-3" 
          rows={3}
        />
      </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phase-start-date" className="text-right">Start Date</Label>
        <Input 
          id="phase-start-date" 
          type="date"
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          className="col-span-3" 
        />
      </div>
       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phase-end-date" className="text-right">End Date</Label>
        <Input 
          id="phase-end-date" 
          type="date"
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          className="col-span-3" 
        />
      </div>
      {/* Add more fields relevant to a phase as needed */}

      {error && <p className="text-sm text-red-600 col-span-4 text-center">{error}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...': 'Adding...') : (initialData ? 'Save Changes' : 'Add Phase')}
        </Button>
      </div>
    </form>
  );
};

export default AddPhaseForm; 