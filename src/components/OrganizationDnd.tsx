"use client";

import React, { useEffect, useMemo } from 'react';
import { Role, Personnel } from '@/lib/types';
import { 
  DndContext, 
  closestCenter, 
  PointerSensor, 
  KeyboardSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Use Badge for tags
import { Button } from "@/components/ui/button"; // Import Button
import { Pencil, Trash2 } from 'lucide-react'; // Import icons
import { toast } from 'sonner'; // Import toast for feedback

// --- Sortable Personnel Item --- 
interface SortablePersonnelProps {
  personnel: Personnel;
  onEditPersonnel: (personnel: Personnel) => void;
  onDeletePersonnel: (personnelId: string) => void;
}

function SortablePersonnelItem({ personnel, onEditPersonnel, onDeletePersonnel }: SortablePersonnelProps) {
  // Prefix ID for uniqueness within DndContext
  const uniqueId = `personnel-${personnel.id}`;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: uniqueId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative', // Needed for absolute positioning of buttons
  };

  // Prevent button clicks from triggering drag
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none group relative pr-10"> {/* Add padding for buttons */}
      <Badge variant="secondary" className="py-1 px-2 text-xs cursor-grab">
        {personnel.name}
      </Badge>
      {/* Edit/Delete buttons - show on hover */}
      <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-5 w-5 text-blue-600 hover:text-blue-800" onClick={(e) => { stopPropagation(e); onEditPersonnel(personnel); }}>
          <Pencil className="h-3 w-3" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-5 w-5 text-red-600 hover:text-red-800" onClick={(e) => { stopPropagation(e); onDeletePersonnel(personnel.id); }}>
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
}

// --- Sortable Role Card (Droppable Area) --- 
interface SortableRoleCardProps {
  role: Role;
  assignedPersonnel: Personnel[];
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  onEditPersonnel: (personnel: Personnel) => void; // Pass down personnel handlers
  onDeletePersonnel: (personnelId: string) => void;
}

function SortableRoleCard({ role, assignedPersonnel, onEditRole, onDeleteRole, onEditPersonnel, onDeletePersonnel }: SortableRoleCardProps) {
  // Define role card as a droppable area
  // Prefix ID for uniqueness within DndContext
  const uniqueRoleId = `role-${role.id}`;
  const { setNodeRef: droppableRef, isOver } = useSortable({ id: uniqueRoleId });

  const cardStyle = {
    border: isOver ? '2px dashed #004B87' : '1px solid #e5e7eb', // Highlight when dragging over
    minHeight: '100px', // Ensure drop area is targetable
  };

  return (
    <Card ref={droppableRef} style={cardStyle}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{role.title}</CardTitle>
        {/* Role Edit/Delete Buttons */}
        <div className="flex">
           <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-600 hover:text-blue-800" onClick={() => onEditRole(role)}>
             <Pencil className="h-4 w-4" />
             <span className="sr-only">Edit Role</span>
           </Button>
           <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600 hover:text-red-800" onClick={() => onDeleteRole(role.id)}>
             <Trash2 className="h-4 w-4" />
             <span className="sr-only">Delete Role</span>
           </Button>
         </div>
      </CardHeader>
      <CardContent className="space-y-1">
        <SortableContext 
          items={assignedPersonnel.map(p => `personnel-${p.id}`)} // Use prefixed IDs
          strategy={rectSortingStrategy} // Use grid strategy if items wrap
        >
          <div className="flex flex-wrap gap-1 min-h-[30px]">{/* Ensure droppable area inside */}
            {assignedPersonnel.map(person => (
              <SortablePersonnelItem 
                 key={`personnel-${person.id}`} // Prefixed React key
                 personnel={person} 
                 onEditPersonnel={onEditPersonnel} 
                 onDeletePersonnel={onDeletePersonnel} 
               />
            ))}
          </div>
        </SortableContext>
        {assignedPersonnel.length === 0 && (
           <p className="text-xs text-muted-foreground pt-2">Drop personnel here</p>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-2">
         Salary: ${role.salary.min/1000}k - ${role.salary.max/1000}k
      </CardFooter>
    </Card>
  );
}

// --- Main Organization DND Component --- 
interface OrganizationDndProps {
  roles: Role[];
  personnel: Personnel[];
  selectedFactoryId: string; // Need factory ID for assignments
  onAssignPersonnel: (personnelId: string, roleId: string, factoryId: string) => void;
  onUnassignPersonnel: (personnelId: string) => void;
  // Add CRUD handlers for Roles and Personnel
  onEditRole: (role: Role) => void;
  onDeleteRole: (roleId: string) => void;
  onEditPersonnel: (personnel: Personnel) => void;
  onDeletePersonnel: (personnelId: string) => void;
}

export default function OrganizationDnd({
  roles,
  personnel,
  selectedFactoryId,
  onAssignPersonnel,
  onUnassignPersonnel,
  onEditRole,
  onDeleteRole,
  onEditPersonnel,
  onDeletePersonnel,
}: OrganizationDndProps) {

  // --- DEBUGGING: Check for duplicate IDs and log array changes ---
  useEffect(() => {
    console.log("OrganizationDnd received personnel update:", personnel);

    const roleIds = new Set<string>();
    const duplicateRoles = roles.filter(role => {
      if (roleIds.has(role.id)) return true;
      roleIds.add(role.id);
      return false;
    });
    if (duplicateRoles.length > 0) {
      console.warn('OrganizationDnd received duplicate role IDs:', duplicateRoles.map(r => r.id));
    }

    const personnelIds = new Set<string>();
    const duplicatePersonnel = personnel.filter(p => {
      if (personnelIds.has(p.id)) return true;
      personnelIds.add(p.id);
      return false;
    });
    if (duplicatePersonnel.length > 0) {
      console.warn('OrganizationDnd received duplicate personnel IDs:', duplicatePersonnel.map(p => p.id));
    }
  }, [roles, personnel]);
  // --- END DEBUGGING ---

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Require slight drag movement
    useSensor(KeyboardSensor)
  );

  const getPersonnelInRole = (roleId: string): Personnel[] => {
    return personnel.filter(p => p.assignedRole === roleId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return; // Dropped outside

    const activePrefixedId = active.id.toString();
    const overPrefixedId = over.id.toString();
    
    // Parse IDs
    const parseId = (prefixedId: string): { type: 'personnel' | 'role' | 'zone' | 'unknown', id: string } => {
        if (prefixedId.startsWith('personnel-')) return { type: 'personnel', id: prefixedId.substring(10) };
        if (prefixedId.startsWith('role-')) return { type: 'role', id: prefixedId.substring(5) };
        if (prefixedId === 'zone-unassigned') return { type: 'zone', id: 'unassigned' }; // Handle prefixed zone
        return { type: 'unknown', id: prefixedId };
    };

    const activeParsed = parseId(activePrefixedId);
    const overParsed = parseId(overPrefixedId);

    // Ensure the active item is personnel
    if (activeParsed.type !== 'personnel') return; 
    const activeId = activeParsed.id;

    const draggedPersonnel = personnel.find(p => p.id === activeId);
    if (!draggedPersonnel) return; // Personnel not found

    // Scenario 1: Dragging to a Role Card (overParsed.type === 'role')
    if (overParsed.type === 'role') {
        const targetRoleId = overParsed.id;
        const targetRole = roles.find(r => r.id === targetRoleId);
        if (!targetRole) return; // Target role not found

        // --- Check Assignment Limit (assuming 1 person per role instance) ---
        const personnelAlreadyInRole = getPersonnelInRole(targetRoleId);
        if (personnelAlreadyInRole.length > 0 && personnelAlreadyInRole[0].id !== activeId) {
            toast.warning(`Role '${targetRole.title}' is already assigned.`);
            return; // Prevent assignment
        }
        // --- End Check ---

        // Assign if it's a new role
        if (draggedPersonnel.assignedRole !== targetRoleId) {
            onAssignPersonnel(activeId, targetRoleId, selectedFactoryId);
        }
        return;
    }

    // Scenario 2: Dragging to Unassigned Area (now a zone)
    if (overParsed.type === 'zone' && overParsed.id === 'unassigned') { 
      if (draggedPersonnel.assignedRole) {
        onUnassignPersonnel(activeId);
      }
      return; 
    }
    
    // Scenario 3: Dragging onto another Personnel item
    if (overParsed.type === 'personnel') {
        const targetPersonnelId = overParsed.id;
        const targetPersonnel = personnel.find(p => p.id === targetPersonnelId);
        if (targetPersonnel && targetPersonnel.assignedRole) { 
            const targetPersonnelRoleId = targetPersonnel.assignedRole;
            const targetPersonnelRole = roles.find(r => r.id === targetPersonnelRoleId);
            if (targetPersonnelRole) {
                 // --- Check Assignment Limit (assuming 1 person per role instance) ---
                 const personnelAlreadyInRole = getPersonnelInRole(targetPersonnelRoleId);
                 if (personnelAlreadyInRole.length > 0 && personnelAlreadyInRole[0].id !== activeId) {
                     toast.warning(`Role '${targetPersonnelRole.title}' is already assigned.`);
                     return; // Prevent assignment
                 }
                 // --- End Check ---

                 // Assign to the new role if different
                 if (draggedPersonnel.assignedRole !== targetPersonnelRoleId) {
                     onAssignPersonnel(activeId, targetPersonnelRoleId, selectedFactoryId);
                 }
            }
        } // If dropped on unassigned personnel, treat as dropping in unassigned area? Or do nothing?
        // Current logic does nothing if dropped on unassigned personnel
        return;
    } 
    // If dropped onto empty space not covered, do nothing.
  };

  const rolesByLevel = {
    leadership: roles.filter(role => role.level === 'leadership'),
    specialist: roles.filter(role => role.level === 'specialist'),
    associate: roles.filter(role => role.level === 'associate')
  };

  // Ensure unassignedPersonnel is memoized based on the personnel prop
  const unassignedPersonnel = useMemo(() => 
    personnel.filter(p => !p.assignedRole)
  , [personnel]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-8">
        {/* Render Roles by Level */} 
        {Object.entries(rolesByLevel).map(([level, levelRoles]) => (
          levelRoles.length > 0 && (
            <div key={`${level}-roles`}>
              <h3 className="text-lg font-semibold text-primary mb-4 capitalize">{level} Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levelRoles.map(role => (
                  <SortableRoleCard 
                    key={`role-${role.id}`}
                    role={role} 
                    assignedPersonnel={getPersonnelInRole(role.id)}
                    onEditRole={onEditRole}
                    onDeleteRole={() => onDeleteRole(role.id)}
                    onEditPersonnel={onEditPersonnel}
                    onDeletePersonnel={(personnelId) => onDeletePersonnel(personnelId)}
                  />
                ))}
              </div>
            </div>
          )
        ))}

        {/* Unassigned Personnel Area */}
        <div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-4">Unassigned Personnel</h3>
          <SortableContext items={unassignedPersonnel.map(p => `personnel-${p.id}`)} strategy={rectSortingStrategy}>
             {/* Define Unassigned area as a droppable */}
             <div 
               ref={useSortable({ id: 'zone-unassigned' }).setNodeRef}
               className="p-4 bg-muted border border-dashed rounded-lg min-h-[60px] flex flex-wrap gap-2"
             >
                {unassignedPersonnel.length === 0 ? (
                  <p className="text-center text-muted-foreground italic w-full">Drag assigned personnel here to unassign</p>
                ) : (
                  unassignedPersonnel.map(person => (
                    <SortablePersonnelItem 
                      key={`personnel-${person.id}`}
                      personnel={person} 
                      onEditPersonnel={onEditPersonnel}
                      onDeletePersonnel={() => onDeletePersonnel(person.id)}
                    />
                  ))
                )}
             </div>
           </SortableContext>
        </div>
      </div>
    </DndContext>
  );
} 