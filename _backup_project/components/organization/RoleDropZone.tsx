import React from 'react';
import { Role, Personnel } from '@\/lib';
import { useDroppable } from '@dnd-kit/core';

interface RoleDropZoneProps {
  role: Role;
  personnel: Personnel[];
  isAdmin: boolean;
  onUnassign: (personnelId: string) => void;
}

export default function RoleDropZone({
  role,
  personnel,
  isAdmin,
  onUnassign
}: RoleDropZoneProps) {
  // Setup droppable
  const { setNodeRef, isOver } = useDroppable({
    id: `role-${role.id}`,
    data: {
      type: 'role',
      role
    }
  });
  
  // Get border color based on role level
  const getBorderColor = () => {
    switch (role.level) {
      case 'leadership':
        return 'border-[#004B87]';
      case 'specialist':
        return 'border-[#81C341]';
      case 'associate':
        return 'border-[#F47920]';
      default:
        return 'border-gray-300';
    }
  };
  
  // Get text color based on role level
  const getTextColor = () => {
    switch (role.level) {
      case 'leadership':
        return 'text-[#004B87]';
      case 'specialist':
        return 'text-[#81C341]';
      case 'associate':
        return 'text-[#F47920]';
      default:
        return 'text-gray-700';
    }
  };
  
  // Get background color for personnel avatar
  const getAvatarColor = () => {
    switch (role.level) {
      case 'leadership':
        return 'bg-[#004B87]';
      case 'specialist':
        return 'bg-[#81C341]';
      case 'associate':
        return 'bg-[#F47920]';
      default:
        return 'bg-gray-400';
    }
  };
  
  return (
    <div
      ref={setNodeRef}
      className={`p-4 bg-white rounded-lg border ${getBorderColor()} border-opacity-30`}
    >
      <div className="mb-2">
        <h4 className={`font-medium ${getTextColor()}`}>{role.title}</h4>
        <p className="text-xs text-gray-500">{role.department}</p>
      </div>
      
      <div 
        className={`min-h-[100px] p-2 rounded border border-dashed ${
          isOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'
        }`}
      >
        {personnel.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-2">Drop personnel here</p>
        ) : (
          <div className="space-y-2">
            {personnel.map(person => (
              <div
                key={person.id}
                className="p-2 bg-white rounded border border-gray-200 flex justify-between items-center"
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full ${getAvatarColor()} flex items-center justify-center text-white text-xs`}>
                    {person.name.charAt(0)}
                  </div>
                  <span className="ml-2 text-sm">{person.name}</span>
                </div>
                
                {isAdmin && (
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => onUnassign(person.id)}
                  >
                    Unassign
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
