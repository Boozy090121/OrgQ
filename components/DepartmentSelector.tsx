import React, { useState } from 'react';
import { DepartmentType } from '@/types';

interface DepartmentSelectorProps {
  selectedDepartment: DepartmentType;
  onDepartmentChange: (department: DepartmentType) => void;
  className?: string;
}

export default function DepartmentSelector({
  selectedDepartment,
  onDepartmentChange,
  className = ''
}: DepartmentSelectorProps) {
  const departments: { id: DepartmentType; name: string; color: string }[] = [
    { id: 'Quality', name: 'Quality', color: '#004B87' },
    { id: 'Operations', name: 'Operations', color: '#81C341' },
    { id: 'Engineering', name: 'Engineering', color: '#F47920' }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Department
      </label>
      <div className="flex flex-wrap gap-2">
        {departments.map(department => (
          <button
            key={department.id}
            onClick={() => onDepartmentChange(department.id)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              selectedDepartment === department.id
                ? `bg-[${department.color}] text-white`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: selectedDepartment === department.id ? department.color : undefined
            }}
          >
            {department.name}
          </button>
        ))}
      </div>
    </div>
  );
}
