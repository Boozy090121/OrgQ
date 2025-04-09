import React from 'react';
import { Personnel, Role } from '@\/lib';
import { useDraggable } from '@dnd-kit/core';

interface PersonnelDragListProps {
  personnel: Personnel;
  roles: Role[];
  isAdmin: boolean;
  onEdit: (personnel: Personnel) => void;
  onRemove: (id: string) => void;
}

export default function PersonnelDragList({
  personnel,
  roles,
  isAdmin,
  onEdit,
  onRemove
}: PersonnelDragListProps) {
  // Get role information if assigned
  const assignedRole = personnel.assignedRole 
    ? roles.find(role => role.id === personnel.assignedRole) 
    : null;
  
  // Setup draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: personnel.id,
    data: {
      type: 'personnel',
      personnel
    }
  });
  
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
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-3 bg-white rounded-md border ${
        isDragging 
          ? 'border-[#004B87] opacity-50' 
          : 'border-gray-200 hover:border-gray-300'
      } cursor-grab transition-all`}
    >
      <div className="flex items-center justify-between">
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
        
        {isAdmin && (
          <div className="flex space-x-1">
            <button
              className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(personnel);
              }}
            >
              Edit
            </button>
            <button
              className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(personnel.id);
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
