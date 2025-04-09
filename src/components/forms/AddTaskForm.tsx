"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Task } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TaskFormData extends Omit<Task, 'id' | 'departmentId' | 'factoryId' | 'createdAt' | 'updatedAt'> {
  name: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  dependsOn?: string[];
}

interface AddTaskFormProps {
  initialData?: Task;
  allTasks: Task[];
  onSubmit: (taskData: TaskFormData, departmentId: string | null) => Promise<void>;
  onCancel: () => void;
  selectedDepartmentId: string | null;
}

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, placeholder = "Select dependencies..." }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {selected.length > 0 
              ? selected.map(val => options.find(opt => opt.value === val)?.label).filter(Boolean).join(", ") 
              : placeholder}
           </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandInput placeholder="Search tasks..." />
          <CommandList>
            <CommandEmpty>No tasks found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(currentValue) => {
                    const matchingOption = options.find(opt => opt.label.toLowerCase() === currentValue.toLowerCase());
                    if(matchingOption) {
                      handleSelect(matchingOption.value);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const AddTaskForm: React.FC<AddTaskFormProps> = ({ 
  initialData,
  allTasks = [],
  onSubmit, 
  onCancel,
  selectedDepartmentId
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    status: 'pending',
    dependsOn: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableTasksForDeps = useMemo(() => { 
    return allTasks.filter(task => task.id !== initialData?.id);
  }, [allTasks, initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        dependsOn: initialData.dependsOn || [],
      });
    } else {
      setFormData({ name: '', description: '', status: 'pending', dependsOn: [] });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as Task['status'] }));
  };
  
  const handleDependsOnChange = (selectedIds: string[]) => {
      setFormData(prev => ({ ...prev, dependsOn: selectedIds }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onSubmit(formData, selectedDepartmentId);
    } catch (err) { 
      console.error("Failed to submit task:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Task Name</Label>
        <Input 
          id="name" 
          name="name"
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea 
          id="description" 
          name="description"
          value={formData.description}
          onChange={handleChange} 
          rows={3}
        />
      </div>
       <div>
        <Label htmlFor="status">Status</Label>
        <Select name="status" value={formData.status} onValueChange={handleStatusChange}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="dependsOn">Depends On (Optional)</Label>
        <MultiSelect
          options={availableTasksForDeps.map(task => ({ value: task.id, label: task.name }))}
          selected={formData.dependsOn || []}
          onChange={handleDependsOnChange}
          placeholder="Select prerequisite tasks..."
        />
      </div>

      {error && <p className="text-sm text-red-600 text-center">{error}</p>}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (initialData ? 'Saving...': 'Adding...') : (initialData ? 'Save Changes' : 'Add Task')}
        </Button>
      </div>
    </form>
  );
};

export default AddTaskForm; 