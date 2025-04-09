import React from 'react';
import { Department, DepartmentType, Role } from '@/lib';
import { Card } from '@/lib/components/ui/card';

interface DepartmentRolesProps {
  roles: Role[];
  departments: Department[];
  selectedDepartment: DepartmentType | null;
  onRoleClick?: (role: Role) => void;
  className?: string;
}

export default function DepartmentRoles({
  roles,
  departments,
  selectedDepartment,
  onRoleClick,
  className = ''
}: DepartmentRolesProps) {
  // Roles are now expected to be pre-filtered by the parent
  const leadershipRoles = roles.filter(role => role.level === 'leadership');
  const specialistRoles = roles.filter(role => role.level === 'specialist');
  const associateRoles = roles.filter(role => role.level === 'associate');
  
  // Get department color based on the selected department passed from parent
  const getDepartmentColor = (departmentType: DepartmentType | null): string => {
    if (!departmentType) return '#004B87'; // Default color if none selected
    // Find department by ID (which is DepartmentType)
    const department = departments.find(d => d.id === departmentType); 
    return department?.color || '#004B87'; // Default color if not found
  };
  
  const departmentColor = getDepartmentColor(selectedDepartment);
  
  // Handle case where no department is selected in parent
  if (!selectedDepartment) {
    // Optionally render a placeholder or null
    return null; 
    // Or: return <p>Select a department to see roles.</p>; 
  }

  return (
    <div className={`space-y-6 ${className}`}>
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
