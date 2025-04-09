"use client";

import React, { useState, useMemo } from 'react';
import { Resource } from '@/lib/types'; // Assuming Resource type exists
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';

type SortKey = keyof Pick<Resource, 'name' | 'type' | 'description' | 'cost'>; // Allow sorting by these fields

interface ResourceListProps {
  resources: Resource[];
  onEditResource: (resource: Resource) => void; // Handler for edit
  onDeleteResource: (resourceId: string) => void; // Handler for delete
}

const ResourceList: React.FC<ResourceListProps> = ({ resources, onEditResource, onDeleteResource }) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Memoized sorted resources
  const sortedResources = useMemo(() => {
    if (!sortKey) return resources;

    return [...resources].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      // Handle cost sorting numerically, others alphabetically (case-insensitive)
      if (sortKey === 'cost') {
        valA = valA ?? -Infinity; // Treat null/undefined cost as lowest
        valB = valB ?? -Infinity;
      } else {
        valA = (valA as string || '').toLowerCase();
        valB = (valB as string || '').toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [resources, sortKey, sortDirection]);

  // Handler to update sorting state
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
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
  
  // Calculate total cost from the original (unsorted) resources array
  const totalCost = resources.reduce((sum, resource) => sum + (resource.cost || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources & Budget</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of project resources and their costs. Total Estimated Cost: ${totalCost.toFixed(2)}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}>
                 <div className="flex items-center">Name {renderSortArrow('name')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('type')}>
                 <div className="flex items-center">Type {renderSortArrow('type')}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('description')}>
                 <div className="flex items-center">Description {renderSortArrow('description')}</div>
              </TableHead>
              <TableHead className="text-right cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('cost')}>
                 <div className="flex items-center justify-end">Cost ($) {renderSortArrow('cost')}</div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResources.length > 0 ? (
              sortedResources.map(resource => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">{resource.name}</TableCell>
                  <TableCell>{resource.type || 'N/A'}</TableCell>
                  <TableCell>{resource.description || 'N/A'}</TableCell>
                  <TableCell className="text-right">{(resource.cost || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditResource(resource)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Resource</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteResource(resource.id)} className="text-red-600 hover:text-red-700 h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Resource</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No resources found.
                </TableCell>
              </TableRow>
            )}
            {/* Total cost row remains unsorted */}
            <TableRow className="font-bold bg-muted/50">
              <TableCell colSpan={4} className="text-right">Total Estimated Cost</TableCell>
              <TableCell className="text-right">${totalCost.toFixed(2)}</TableCell>
               <TableCell></TableCell> 
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ResourceList; 