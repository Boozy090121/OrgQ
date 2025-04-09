import React, { useState } from 'react';
import { Department, DepartmentType, Role } from '@/types';
import Card from '@/components/ui/Card';
import DepartmentSelector from '@/components/department/DepartmentSelector';

interface DepartmentRolesProps {
  roles: Role[];
  departments: Department[];
  onRoleClick?: (role: Role) => void;
  className?: string;
}

export default function DepartmentRoles({
  roles,
  departments,
  onRoleClick,
  className = ''
}: DepartmentRolesProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>('Quality');
  
  // Filter roles by selected department
  const filteredRoles = roles.filter(role => role.department === selectedDepartment);
  
  // Group roles by level
  const leadershipRoles = filteredRoles.filter(role => role.level === 'leadership');
  const specialistRoles = filteredRoles.filter(role => role.level === 'specialist');
  const associateRoles = filteredRoles.filter(role => role.level === 'associate');
  
  // Get department color
  const getDepartmentColor = (departmentType: DepartmentType): string => {
    const department = departments.find(d => d.name === departmentType);
    return department?.color || '#004B87';
  };
  
  const departmentColor = getDepartmentColor(selectedDepartment);
  
  return (
    <div className={`space-y-6 ${className}`}>
      <DepartmentSelector 
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
      />
      
      <div className="space-y-6">
        {/* Leadership Roles */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: departmentColor }}>
            Leadership Roles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leadershipRoles.map(role => (
              <Card 
                key={role.id}
                className={`p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow`}
                style={{ borderLeftColor: departmentColor }}
                onClick={() => onRoleClick && onRoleClick(role)}
              >
                <h4 className="font-medium" style={{ color: departmentColor }}>{role.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {role.responsibilities.slice(0, 2).join(', ')}
                  {role.responsibilities.length > 2 && '...'}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {role.factorySpecific ? 'Factory Specific' : 'Shared Resource'}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                    ${role.salary.min.toLocaleString()} - ${role.salary.max.toLocaleString()}
                  </span>
                </div>
              </Card>
            ))}
            
            {leadershipRoles.length === 0 && (
              <div className="col-span-full text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No leadership roles in this department</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Specialist Roles */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: departmentColor }}>
            Specialist Roles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialistRoles.map(role => (
              <Card 
                key={role.id}
                className={`p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow`}
                style={{ borderLeftColor: departmentColor }}
                onClick={() => onRoleClick && onRoleClick(role)}
              >
                <h4 className="font-medium" style={{ color: departmentColor }}>{role.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {role.responsibilities.slice(0, 2).join(', ')}
                  {role.responsibilities.length > 2 && '...'}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {role.factorySpecific ? 'Factory Specific' : 'Shared Resource'}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                    ${role.salary.min.toLocaleString()} - ${role.salary.max.toLocaleString()}
                  </span>
                </div>
              </Card>
            ))}
            
            {specialistRoles.length === 0 && (
              <div className="col-span-full text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No specialist roles in this department</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Associate Roles */}
        <div>
          <h3 className="text-lg font-semibold mb-3" style={{ color: departmentColor }}>
            Associate Roles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {associateRoles.map(role => (
              <Card 
                key={role.id}
                className={`p-4 border-l-4 cursor-pointer hover:shadow-md transition-shadow`}
                style={{ borderLeftColor: departmentColor }}
                onClick={() => onRoleClick && onRoleClick(role)}
              >
                <h4 className="font-medium" style={{ color: departmentColor }}>{role.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {role.responsibilities.slice(0, 2).join(', ')}
                  {role.responsibilities.length > 2 && '...'}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {role.factorySpecific ? 'Factory Specific' : 'Shared Resource'}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
                    ${role.salary.min.toLocaleString()} - ${role.salary.max.toLocaleString()}
                  </span>
                </div>
              </Card>
            ))}
            
            {associateRoles.length === 0 && (
              <div className="col-span-full text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No associate roles in this department</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
