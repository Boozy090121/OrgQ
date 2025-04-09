import React from 'react';
import { Role, Personnel } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRoleCardProps {
  role: Role;
  personnel: Personnel[];
}

export default function SortableRoleCard({
  role,
  personnel
}: SortableRoleCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: JSON.stringify({ type: 'role', id: role.id })
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  // Get role level color
  const getRoleLevelColor = () => {
    switch (role.level) {
      case 'leadership':
        return 'border-[#004B87] bg-[#E6EEF4]';
      case 'specialist':
        return 'border-[#81C341] bg-[#81C341] bg-opacity-10';
      case 'associate':
        return 'border-[#F47920] bg-[#F47920] bg-opacity-10';
      default:
        return 'border-gray-200';
    }
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 rounded-lg border-2 ${getRoleLevelColor()} hover:shadow-md transition-shadow`}
    >
      <div className="mb-3">
        <h4 className="text-base font-semibold text-[#004B87]">{role.title}</h4>
        <p className="text-sm text-gray-500">{role.department}</p>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Personnel</span>
          <span>{personnel.length} assigned</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#004B87] h-2 rounded-full" 
            style={{ width: `${Math.min((personnel.length / (role.headcount || 1)) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {personnel.length > 0 ? (
        <div className="space-y-2">
          {personnel.map(person => (
            <div 
              key={person.id}
              className="p-2 bg-white rounded border border-gray-200 flex items-center"
            >
              <div className="w-6 h-6 rounded-full bg-[#E6EEF4] flex items-center justify-center text-[#004B87] text-xs font-medium">
                {person.name.charAt(0)}
              </div>
              <span className="ml-2 text-sm">{person.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 border border-dashed border-gray-300 rounded-md text-center text-sm text-gray-500">
          Drop personnel here
        </div>
      )}
    </div>
  );
}
