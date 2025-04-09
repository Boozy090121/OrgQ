"use client";

import React, { useState, useMemo } from 'react';
import { Phase, Activity } from '@/lib/types'; // Import Activity
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2, PlusCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

type SortKey = keyof Pick<Phase, 'name' | 'description' | 'startDate' | 'endDate'>; // Allow sorting by these fields

interface TimelineListProps {
  phases: Phase[];
  activities: Activity[]; // Add activities prop
  onEditPhase: (phase: Phase) => void; // Handler for edit
  onDeletePhase: (phaseId: string) => void; // Handler for delete
  onAddActivity: (phaseId: string) => void; // Handler to add activity to a phase
  onEditActivity: (phaseId: string, activity: Activity) => void; // Handler to edit activity
  onDeleteActivity: (activityId: string) => void; // Handler to delete activity
}

// Helper function to format dates for display
const formatDate = (timestamp: number | null | undefined): string => {
  if (!timestamp) return '-';
  try {
    return new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    return 'Invalid Date';
  }
};

// Helper function to get a comparable value for dates (milliseconds or infinity)
const getDateValue = (dateString: string | undefined | null): number => {
  if (!dateString) return Infinity; // Treat null/undefined dates as latest for sorting purposes
  try {
    const date = new Date(dateString + 'T00:00:00Z');
    return isNaN(date.getTime()) ? Infinity : date.getTime();
  } catch {
    return Infinity;
  }
}

// Helper to get a badge variant based on activity status
const getStatusBadgeVariant = (status: Activity['status']): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'completed': return 'default';
    case 'in-progress': return 'secondary';
    case 'on-hold': return 'outline';
    case 'pending':
    default: return 'secondary'; // Or a specific 'pending' variant if you add one
  }
};

const TimelineList: React.FC<TimelineListProps> = ({
  phases,
  activities,
  onEditPhase,
  onDeletePhase,
  onAddActivity,
  onEditActivity,
  onDeleteActivity
}) => {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Memoized sorted phases
  const sortedPhases = useMemo(() => {
    if (!sortKey) return phases;

    return [...phases].sort((a, b) => {
      let valA, valB;

      if (sortKey === 'startDate' || sortKey === 'endDate') {
        valA = getDateValue(a[sortKey]);
        valB = getDateValue(b[sortKey]);
      } else {
        valA = (a[sortKey] as string || '').toLowerCase();
        valB = (b[sortKey] as string || '').toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [phases, sortKey, sortDirection]);

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

  if (!phases || phases.length === 0) {
    return <p className="text-center text-muted-foreground py-6">No timeline phases defined yet. Add a phase to begin.</p>;
  }

  return (
    <div className="space-y-6">
      {sortedPhases.map((phase) => {
        // Filter activities for the current phase
        const phaseActivities = activities.filter(act => act.phaseId === phase.id)
                                   // Optional: Sort activities within a phase, e.g., by start date
                                   .sort((a, b) => (a.startDate ?? Infinity) - (b.startDate ?? Infinity));
        
        return (
          <Card key={phase.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">{phase.name}</CardTitle>
                <CardDescription>
                  {phase.description || 'No description'} - {formatDate(phase.startDate)} to {formatDate(phase.endDate)}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1 pt-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onAddActivity(phase.id)}>
                  <PlusCircle className="h-4 w-4" />
                  <span className="sr-only">Add Activity</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEditPhase(phase)}>
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit Phase</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => onDeletePhase(phase.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Phase</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {phaseActivities.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]" >Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {phaseActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell><Badge variant={getStatusBadgeVariant(activity.status)}>{activity.status}</Badge></TableCell>
                        <TableCell>{formatDate(activity.startDate)}</TableCell>
                        <TableCell>{formatDate(activity.endDate)}</TableCell>
                        <TableCell className="text-right space-x-1">
                           <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditActivity(phase.id, activity)}>
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit Activity</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700" onClick={() => onDeleteActivity(activity.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete Activity</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No activities added to this phase yet.</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TimelineList; 