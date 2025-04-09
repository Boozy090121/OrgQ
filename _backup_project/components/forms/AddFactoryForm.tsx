"use client";

import React, { useState } from 'react';
import { Factory } from '@/lib/types'; // Assuming Factory type is defined here
import { Input } from '@/lib/components/ui/input';
import { Button } from '@/lib/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/lib/components/ui/card';
import { Label } from '@/lib/components/ui/label';

interface AddFactoryFormProps {
  onSubmit: (factoryData: Omit<Factory, 'id' | 'clients' | 'workOrderVolume' | 'specialRequirements'>) => Promise<void>; // Adjust based on required fields
  onCancel: () => void;
}

const AddFactoryForm: React.FC<AddFactoryFormProps> = ({ onSubmit, onCancel }) => {
  const [factoryName, setFactoryName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factoryName.trim()) {
      setError('Factory name cannot be empty.');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // For now, we only need the name. Other fields might be added later or have defaults.
      await onSubmit({ name: factoryName.trim() });
      // onSubmit should handle closing the modal upon success
    } catch (err) {
      console.error("Error adding factory:", err);
      setError(err instanceof Error ? err.message : 'Failed to add factory. Please try again.');
      setIsLoading(false); // Keep modal open on error
    }
    // setIsLoading(false) should ideally happen after onSubmit completes successfully,
    // but since onSubmit might close the modal, we don't explicitly set it back here
    // unless there's an error.
  };

  return (
    <Card className="border-none shadow-none"> {/* Remove card border/shadow inside modal */}
      <form onSubmit={handleSubmit}>
        <CardHeader>
          {/* Title is handled by the Modal component */}
          {/* <CardTitle>Add New Factory</CardTitle> */}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="factoryName">Factory Name</Label>
            <Input
              id="factoryName"
              value={factoryName}
              onChange={(e) => setFactoryName(e.target.value)}
              placeholder="e.g., Main Production Plant"
              disabled={isLoading}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {/* Add more fields here as needed (e.g., location, initial capacity) */}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !factoryName.trim()}>
            {isLoading ? 'Saving...' : 'Save Factory'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddFactoryForm; 