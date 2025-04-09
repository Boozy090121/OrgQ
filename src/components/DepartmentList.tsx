"use client";

import React from 'react';
import { Department } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface DepartmentListProps {
  departments: Department[];
  onEditDepartment: (department: Department) => void;
  onDeleteDepartment: (departmentId: string) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ departments, onEditDepartment, onDeleteDepartment }) => {
  if (!departments || departments.length === 0) {
    return (
       <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm p-10">
         <div className="flex flex-col items-center gap-1 text-center">
           <h3 className="text-2xl font-semibold tracking-tight">No Departments Found</h3>
           <p className="text-sm text-muted-foreground">Add a department to get started.</p>
         </div>
       </div>
      );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.map((department) => (
          <TableRow key={department.id}>
            <TableCell className="font-medium">{department.name}</TableCell>
            <TableCell className="capitalize">{department.type}</TableCell>
            <TableCell>{department.description || '-'}</TableCell>
            <TableCell className="text-right space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onEditDepartment(department)} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Department</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDeleteDepartment(department.id)} className="text-red-600 hover:text-red-700 h-8 w-8">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Department</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DepartmentList; 