import React from 'react';
import { Role, Personnel } from '@/types';
import { 
  DndContext, 
  closestCenter,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import SortableRoleCard from './SortableRoleCard';
import SortablePersonnelCard from './SortablePersonnelCard';

interface OrganizationDndProps {
  roles: Role[];
  personnel: Personnel[];
  onAssignPersonnel: (personnelId: string, roleId: string) => void;
  onUnassignPersonnel: (personnelId: string) => void;
}

export default function OrganizationDnd({
  roles,
  personnel,
  onAssignPersonnel,
  onUnassignPersonnel
}: OrganizationDndProps) {
  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // Get data from active item
    const activeData = JSON.parse(active.id.toString());
    
    // Get data from over item
    const overData = JSON.parse(over.id.toString());
    
    // If dragging personnel to a role
    if (activeData.type === 'personnel' && overData.type === 'role') {
      onAssignPersonnel(activeData.id, overData.id);
    }
    
    // If dragging personnel to unassigned area
    if (activeData.type === 'personnel' && overData.type === 'unassigned') {
      onUnassignPersonnel(activeData.id);
    }
  };
  
  // Group roles by level
  const rolesByLevel = {
    leadership: roles.filter(role => role.level === 'leadership'),
    specialist: roles.filter(role => role.level === 'specialist'),
    associate: roles.filter(role => role.level === 'associate')
  };
  
  // Get unassigned personnel
  const unassignedPersonnel = personnel.filter(person => !person.assignedRole);
  
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        {/* Leadership roles */}
        <div>
          <h3 className="text-lg font-semibold text-[#004B87] mb-4">Leadership Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SortableContext
              items={rolesByLevel.leadership.map(role => ({ id: JSON.stringify({ type: 'role', id: role.id }) }))}
              strategy={verticalListSortingStrategy}
            >
              {rolesByLevel.leadership.map(role => (
                <SortableRoleCard
                  key={role.id}
                  role={role}
                  personnel={personnel.filter(person => person.assignedRole === role.id)}
                />
              ))}
            </SortableContext>
          </div>
        </div>
        
        {/* Specialist roles */}
        <div>
          <h3 className="text-lg font-semibold text-[#81C341] mb-4">Specialist Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SortableContext
              items={rolesByLevel.specialist.map(role => ({ id: JSON.stringify({ type: 'role', id: role.id }) }))}
              strategy={verticalListSortingStrategy}
            >
              {rolesByLevel.specialist.map(role => (
                <SortableRoleCard
                  key={role.id}
                  role={role}
                  personnel={personnel.filter(person => person.assignedRole === role.id)}
                />
              ))}
            </SortableContext>
          </div>
        </div>
        
        {/* Associate roles */}
        <div>
          <h3 className="text-lg font-semibold text-[#F47920] mb-4">Associate Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SortableContext
              items={rolesByLevel.associate.map(role => ({ id: JSON.stringify({ type: 'role', id: role.id }) }))}
              strategy={verticalListSortingStrategy}
            >
              {rolesByLevel.associate.map(role => (
                <SortableRoleCard
                  key={role.id}
                  role={role}
                  personnel={personnel.filter(person => person.assignedRole === role.id)}
                />
              ))}
            </SortableContext>
          </div>
        </div>
        
        {/* Unassigned personnel */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Unassigned Personnel</h3>
          <div 
            className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg"
            id={JSON.stringify({ type: 'unassigned', id: 'unassigned' })}
          >
            {unassignedPersonnel.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No unassigned personnel</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <SortableContext
                  items={unassignedPersonnel.map(person => ({ id: JSON.stringify({ type: 'personnel', id: person.id }) }))}
                  strategy={verticalListSortingStrategy}
                >
                  {unassignedPersonnel.map(person => (
                    <SortablePersonnelCard
                      key={person.id}
                      personnel={person}
                    />
                  ))}
                </SortableContext>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
