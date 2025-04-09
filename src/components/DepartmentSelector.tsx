"use client";

import React from 'react';
import { Department } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DepartmentSelectorProps {
  departments: Department[];
  selectedDepartmentId: string | null;
  onSelectDepartment: (departmentId: string | null) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({ 
  departments, 
  selectedDepartmentId, 
  onSelectDepartment 
}) => {

  const handleValueChange = (value: string) => {
    onSelectDepartment(value === 'all' ? null : value);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Select Department</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedDepartmentId || 'all'} onValueChange={handleValueChange}>
          <SelectTrigger className="w-full md:w-[300px]"> {' Provide a reasonable width '}
            <SelectValue placeholder="Select a department..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem> {' Option to see all or reset '}
            {departments.length > 0 ? (
              departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))
            ) : (
              <p className="p-2 text-sm text-muted-foreground">No departments found.</p>
            )}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default DepartmentSelector; 