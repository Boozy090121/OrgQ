import React from 'react';
import { Role, Personnel } from '@\/lib';

interface DraggablePersonnelProps {
  personnel: Personnel;
  roles: Role[];
}

export default function DraggablePersonnel({
  personnel,
  roles
}: DraggablePersonnelProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  
  // Get role information if assigned
  const assignedRole = personnel.assignedRole 
    ? roles.find(role => role.id === personnel.assignedRole) 
    : null;
  
  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'personnel',
      id: personnel.id
    }));
    setIsDragging(true);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  // Get role level color
  const getRoleLevelColor = () => {
    if (!assignedRole) return 'bg-gray-200';
    
    switch (assignedRole.level) {
      case 'leadership':
        return 'bg-[#004B87]';
      case 'specialist':
        return 'bg-[#81C341]';
      case 'associate':
        return 'bg-[#F47920]';
      default:
        return 'bg-gray-200';
    }
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`p-3 bg-white rounded-md border ${
        isDragging 
          ? 'border-[#004B87] opacity-50' 
          : 'border-gray-200 hover:border-gray-300'
      } cursor-grab transition-all`}
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getRoleLevelColor()}`}>
          {personnel.name.charAt(0)}
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">{personnel.name}</div>
          <div className="text-xs text-gray-500">
            {assignedRole ? assignedRole.title : 'Unassigned'}
          </div>
        </div>
      </div>
    </div>
  );
}
