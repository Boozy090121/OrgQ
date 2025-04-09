"use client";

import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/lib/hooks/useAuth';
import { useData } from '@/lib/hooks/useData';
import { Personnel, Role, Factory } from '@/types';
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import PersonnelDragList from '@/components/organization/PersonnelDragList';
import RoleDropZone from '@/components/organization/RoleDropZone';
import UnassignedDropZone from '@/components/organization/UnassignedDropZone';
import FactorySelector from '@/components/organization/FactorySelector';

export default function PersonnelPage() {
  const [activeFactory, setActiveFactory] = useState<string>('1');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [newPersonnel, setNewPersonnel] = useState<Partial<Personnel>>({
    name: '',
  });
  const [activePersonnel, setActivePersonnel] = useState<string | null>(null);

  const { isAdmin } = useAuth();
  const { personnel, roles, factories, updatePersonnel, addPersonnel, removePersonnel } = useData();

  // Filter personnel by search term
  const filteredPersonnel = personnel.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unassigned personnel
  const unassignedPersonnel = filteredPersonnel.filter(person => 
    !person.assignedRole || (person.assignedFactory && person.assignedFactory !== activeFactory)
  );

  // Get roles for the active factory
  const factoryRoles = roles.filter(role => 
    !role.factorySpecific || (role.factorySpecific && role.id.includes(activeFactory))
  );

  // Group roles by level
  const rolesByLevel = {
    leadership: factoryRoles.filter(role => role.level === 'leadership'),
    specialist: factoryRoles.filter(role => role.level === 'specialist'),
    associate: factoryRoles.filter(role => role.level === 'associate')
  };

  // Get personnel assigned to a specific role
  const getPersonnelForRole = (roleId: string) => {
    return personnel.filter(person => 
      person.assignedRole === roleId && 
      person.assignedFactory === activeFactory
    );
  };

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActivePersonnel(active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActivePersonnel(null);
      return;
    }
    
    const personnelId = active.id as string;
    const targetId = over.id as string;
    
    // If dropping on a role
    if (typeof targetId === 'string' && targetId.startsWith('role-')) {
      const roleId = targetId.replace('role-', '');
      
      // Update personnel assignment
      updatePersonnel(personnelId, {
        assignedRole: roleId,
        assignedFactory: activeFactory,
        updatedAt: Date.now()
      });
    }
    
    // If dropping on unassigned area
    if (targetId === 'unassigned') {
      // Unassign personnel
      updatePersonnel(personnelId, {
        assignedRole: undefined,
        assignedFactory: undefined,
        updatedAt: Date.now()
      });
    }
    
    setActivePersonnel(null);
  };

  // Handle adding new personnel
  const handleAddPersonnel = () => {
    if (!newPersonnel.name) return;
    
    addPersonnel({
      ...newPersonnel,
      id: `personnel-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as Personnel);
    
    setNewPersonnel({ name: '' });
    setIsAddModalOpen(false);
  };

  // Handle editing personnel
  const handleEditPersonnel = () => {
    if (!selectedPersonnel || !selectedPersonnel.name) return;
    
    updatePersonnel(selectedPersonnel.id, {
      name: selectedPersonnel.name,
      updatedAt: Date.now()
    });
    
    setSelectedPersonnel(null);
    setIsEditModalOpen(false);
  };

  // Handle removing personnel
  const handleRemovePersonnel = (id: string) => {
    if (window.confirm('Are you sure you want to remove this personnel?')) {
      removePersonnel(id);
    }
  };

  // Handle unassigning personnel
  const handleUnassignPersonnel = (personnelId: string) => {
    updatePersonnel(personnelId, {
      assignedRole: undefined,
      assignedFactory: undefined,
      updatedAt: Date.now()
    });
  };

  // Get stats
  const stats = {
    total: personnel.length,
    assigned: personnel.filter(p => p.assignedRole && p.assignedFactory === activeFactory).length,
    unassigned: personnel.filter(p => !p.assignedRole || p.assignedFactory !== activeFactory).length
  };

  return (
    <PageContainer title="Personnel Management">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#004B87]">Personnel Management</h1>
          <p className="text-gray-600 mt-1">Assign personnel to roles using drag and drop</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Personnel Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#004B87]">Personnel List</h2>
              {isAdmin && (
                <Button 
                  variant="accent" 
                  size="sm" 
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add New
                </Button>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between text-sm">
              <span>Total: <span className="font-medium">{stats.total}</span></span>
              <span>Assigned: <span className="font-medium">{stats.assigned}</span></span>
              <span>Available: <span className="font-medium">{stats.unassigned}</span></span>
            </div>
            
            <div className="p-4">
              <input
                type="text"
                placeholder="Search personnel..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto">
                <DndContext
                  sensors={sensors}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToWindowEdges]}
                >
                  {unassignedPersonnel.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No personnel available</p>
                  ) : (
                    unassignedPersonnel.map(person => (
                      <PersonnelDragList
                        key={person.id}
                        personnel={person}
                        roles={roles}
                        isAdmin={isAdmin}
                        onEdit={(personnel) => {
                          setSelectedPersonnel(personnel);
                          setIsEditModalOpen(true);
                        }}
                        onRemove={handleRemovePersonnel}
                      />
                    ))
                  )}
                </DndContext>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Organization Chart */}
        <div className="lg:col-span-3">
          <Card>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-[#004B87]">Organization Chart</h2>
              
              <FactorySelector 
                factories={factories}
                activeFactory={activeFactory}
                setActiveFactory={setActiveFactory}
              />
            </div>
            
            <div className="p-6">
              <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToWindowEdges]}
              >
                <div className="space-y-8">
                  {/* Leadership roles */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#004B87] mb-4">Leadership Roles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rolesByLevel.leadership.map(role => (
                        <RoleDropZone
                          key={role.id}
                          role={role}
                          personnel={getPersonnelForRole(role.id)}
                          isAdmin={isAdmin}
                          onUnassign={handleUnassignPersonnel}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Specialist roles */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#81C341] mb-4">Specialist Roles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rolesByLevel.specialist.map(role => (
                        <RoleDropZone
                          key={role.id}
                          role={role}
                          personnel={getPersonnelForRole(role.id)}
                          isAdmin={isAdmin}
                          onUnassign={handleUnassignPersonnel}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Associate roles */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#F47920] mb-4">Associate Roles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rolesByLevel.associate.map(role => (
                        <RoleDropZone
                          key={role.id}
                          role={role}
                          personnel={getPersonnelForRole(role.id)}
                          isAdmin={isAdmin}
                          onUnassign={handleUnassignPersonnel}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Unassigned drop area */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Unassigned Area</h3>
                    <UnassignedDropZone />
                  </div>
                </div>
              </DndContext>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Add Personnel Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Personnel"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={newPersonnel.name}
              onChange={(e) => setNewPersonnel({ ...newPersonnel, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddPersonnel}
              disabled={!newPersonnel.name}
            >
              Add Personnel
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Personnel Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personnel"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="editName"
              value={selectedPersonnel?.name || ''}
              onChange={(e) => setSelectedPersonnel(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleEditPersonnel}
              disabled={!selectedPersonnel?.name}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
