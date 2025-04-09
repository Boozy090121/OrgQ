"use client";

import React, { useState, useMemo } from 'react';
import { Scenario } from '@/lib/types'; // Assuming Scenario type is defined in types
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';

type SortKey = keyof Pick<Scenario, 'name' | 'description'>; // Allow sorting by these fields

interface ScenarioListProps {
  scenarios: Scenario[];
  onEditScenario: (scenario: Scenario) => void; // Handler for edit
  onDeleteScenario: (scenarioId: string) => void; // Handler for delete
}

const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios, onEditScenario, onDeleteScenario }) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Memoized sorted scenarios
  const sortedScenarios = useMemo(() => {
    if (!sortKey) return scenarios;

    return [...scenarios].sort((a, b) => {
      const valA = a[sortKey] || '';
      const valB = b[sortKey] || '';

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [scenarios, sortKey, sortDirection]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of planning scenarios.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}><div className="flex items-center">Name {renderSortArrow('name')}</div></TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('description')}><div className="flex items-center">Description {renderSortArrow('description')}</div></TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedScenarios.length > 0 ? (
              sortedScenarios.map(scenario => (
                <TableRow key={scenario.id}>
                  <TableCell className="font-medium">{scenario.name}</TableCell>
                  <TableCell>{scenario.description || 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEditScenario(scenario)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Scenario</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDeleteScenario(scenario.id)} className="text-red-600 hover:text-red-700 h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Scenario</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  {/* Adjust colSpan */}
                  No scenarios found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ScenarioList; 