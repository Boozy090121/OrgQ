"use client";

import React, { useState, useMemo } from 'react';
import { Task } from '@/lib/types'; // Assuming Task type is defined in types
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react'; // Icons for buttons and status
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // For dependency popover

type SortKey = keyof Pick<Task, 'name' | 'description' | 'status'>; // Allow sorting by these fields

interface TaskListProps {
  tasks: Task[];
  allTasks: Task[]; // Pass all tasks to resolve dependency names
  departmentName?: string; // Optional: To show in the title or caption
  onEditTask: (task: Task) => void; // Handler for edit button
  onDeleteTask: (taskId: string) => void; // Handler for delete button
}

// Helper to get dependency names
const getDependencyNames = (dependsOn: string[] | undefined, allTasks: Task[]): string => {
    if (!dependsOn || dependsOn.length === 0) return "None";
    const taskMap = new Map(allTasks.map(task => [task.id, task.name]));
    return dependsOn.map(id => taskMap.get(id) || `Unknown Task (${id.substring(0, 4)}...)`).join(", ");
}

// Helper to check if dependencies are met
const areDependenciesMet = (task: Task, allTasks: Task[]): boolean => {
  if (!task.dependsOn || task.dependsOn.length === 0) return true;
  const taskMap = new Map(allTasks.map(t => [t.id, t]));
  return task.dependsOn.every(depId => {
    const dependentTask = taskMap.get(depId);
    return dependentTask?.status === 'completed';
  });
};

const TaskList: React.FC<TaskListProps> = ({ tasks, allTasks, departmentName, onEditTask, onDeleteTask }) => {
  const title = departmentName ? `Tasks for ${departmentName}` : 'All Tasks';

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Memoized sorted tasks
  const sortedTasks = useMemo(() => {
    if (!sortKey) return tasks;

    return [...tasks].sort((a, b) => {
      const valA = a[sortKey] || '';
      const valB = b[sortKey] || '';

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, sortKey, sortDirection]);

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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('name')}><div className="flex items-center">Name {renderSortArrow('name')}</div></TableHead>
              <TableHead>Dependencies</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('status')}><div className="flex items-center">Status {renderSortArrow('status')}</div></TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length > 0 ? (
              sortedTasks.map(task => {
                const dependenciesMet = areDependenciesMet(task, allTasks);
                const depNames = getDependencyNames(task.dependsOn, allTasks);
                
                return (
                  <TableRow key={task.id} className={!dependenciesMet && task.status !== 'completed' ? 'opacity-60' : ''}> 
                     {/* Optional: Dim row if deps not met */}
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>
                      {task.dependsOn && task.dependsOn.length > 0 ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              {dependenciesMet ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 mr-1" />
                              ) : (
                                <AlertCircle className="h-3.5 w-3.5 text-orange-500 mr-1" />
                              )}
                               {task.dependsOn.length} prerequisite(s)
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="text-xs w-auto max-w-xs p-2">
                            <p className="font-semibold mb-1">Depends on:</p>
                            <p>{depNames}</p>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                        {/* Improve status display */}
                        <Badge 
                           variant={
                               task.status === 'completed' ? 'default' 
                             : task.status === 'in-progress' ? 'secondary' 
                             : task.status === 'on-hold' ? 'outline' 
                             : 'secondary'}
                           className={task.status === 'pending' ? 'bg-amber-100 text-amber-800' : ''} 
                        >
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right"> 
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => onEditTask(task)} 
                         className="mr-1 h-8 w-8" 
                         disabled={!dependenciesMet && task.status !== 'completed'} // Disable edit if deps not met?
                        >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Task</span>
                      </Button>
                      <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => onDeleteTask(task.id)} 
                         className="text-red-600 hover:text-red-700 h-8 w-8" 
                        >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete Task</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground"> 
                  {/* Adjust colSpan if more columns are added */}
                  No tasks found for this department.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {sortedTasks.length > 0 && (
             <TableCaption>A list of tasks for {departmentName || 'all departments'}.</TableCaption>
          )}
        </Table>
      </CardContent>
    </Card>
  );
};

export default TaskList; 