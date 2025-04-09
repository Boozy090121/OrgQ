"use client";

import React, { useState, useMemo } from 'react';
import { Client } from '@/lib/types'; // Assuming Client type is defined in types
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';

type SortKey = keyof Pick<Client, 'name' | 'contactPerson' | 'email' | 'phone'>; // Allow sorting by these fields

interface ClientListProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEditClient, onDeleteClient }) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null); 
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Memoized sorted clients
  const sortedClients = useMemo(() => {
    if (!sortKey) return clients; // Return original if no sort key

    return [...clients].sort((a, b) => {
      const valA = a[sortKey] || ''; // Handle null/undefined values
      const valB = b[sortKey] || '';

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [clients, sortKey, sortDirection]);

  // Handler to update sorting state
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // If already sorting by this key, reverse direction
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, sort by new key in ascending order
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Helper to render sort indicator
  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    return sortDirection === 'asc' 
      ? <ArrowUpDown className="ml-2 h-4 w-4 rotate-0" /> 
      : <ArrowUpDown className="ml-2 h-4 w-4 rotate-180" />; 
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your clients.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center">Name {renderSortArrow('name')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('contactPerson')}>
                 <div className="flex items-center">Contact Person {renderSortArrow('contactPerson')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('email')}>
                 <div className="flex items-center">Email {renderSortArrow('email')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('phone')}>
                 <div className="flex items-center">Phone {renderSortArrow('phone')}</div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.length > 0 ? (
              sortedClients.map(client => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.contactPerson || 'N/A'}</TableCell>
                  <TableCell>{client.email || 'N/A'}</TableCell>
                  <TableCell>{client.phone || 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditClient(client)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Client</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteClient(client.id)} className="text-red-600 hover:text-red-700 h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Client</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClientList; 