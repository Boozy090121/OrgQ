"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Client } from '@/lib/types';

export interface ClientFormData extends Omit<Client, 'id'> {
  // Can add form-specific fields here if needed later
}

interface AddClientFormProps {
  initialData?: ClientFormData;
  onSubmit: (clientData: ClientFormData) => Promise<void>;
  onCancel: () => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setContactPerson(initialData.contactPerson || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
    } else {
      setName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const clientData: ClientFormData = { name, contactPerson, email, phone };

    try {
      await onSubmit(clientData);
    } catch (err) {
      console.error("Failed to submit client:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-name" className="text-right">Name</Label>
        <Input id="client-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-contact" className="text-right">Contact Person</Label>
        <Input id="client-contact" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-email" className="text-right">Email</Label>
        <Input id="client-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="client-phone" className="text-right">Phone</Label>
        <Input id="client-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
      </div>

      {error && <p className="text-sm text-red-600 col-span-4 text-center">{error}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...': 'Adding...') : (initialData ? 'Save Changes' : 'Add Client')}
        </Button>
      </div>
    </form>
  );
};

export default AddClientForm; 