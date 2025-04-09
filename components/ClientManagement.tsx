import React, { useState } from 'react';
import { Client } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface ClientManagementProps {
  clients: Client[];
  factoryId: string;
  onClientCreate?: (client: Client) => void;
  onClientUpdate?: (client: Client) => void;
  onClientDelete?: (clientId: string) => void;
  isAdmin?: boolean;
  className?: string;
}

export default function ClientManagement({
  clients,
  factoryId,
  onClientCreate,
  onClientUpdate,
  onClientDelete,
  isAdmin = false,
  className = ''
}: ClientManagementProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    workOrderVolume: 0,
    complaintVolume: 0,
    complexity: 3,
    specialRequirements: []
  });
  const [newRequirement, setNewRequirement] = useState('');
  
  // Filter clients for this factory
  const factoryClients = clients.filter(client => 
    client.id.startsWith(factoryId) || client.id.includes(`factory-${factoryId}`)
  );
  
  // Calculate factory totals
  const factoryTotals = {
    workOrderVolume: factoryClients.reduce((sum, client) => sum + client.workOrderVolume, 0),
    complaintVolume: factoryClients.reduce((sum, client) => sum + client.complaintVolume, 0),
    avgComplexity: factoryClients.length > 0 
      ? factoryClients.reduce((sum, client) => sum + client.complexity, 0) / factoryClients.length
      : 0
  };
  
  // Handle creating a new client
  const handleCreateClient = () => {
    if (!newClient.name || !onClientCreate) return;
    
    const client: Client = {
      id: `client-${factoryId}-${Date.now()}`,
      name: newClient.name,
      contactName: newClient.contactName || '',
      contactEmail: newClient.contactEmail || '',
      contactPhone: newClient.contactPhone || '',
      workOrderVolume: newClient.workOrderVolume || 0,
      complaintVolume: newClient.complaintVolume || 0,
      complexity: newClient.complexity || 3,
      specialRequirements: newClient.specialRequirements || [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    onClientCreate(client);
    setNewClient({
      name: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      workOrderVolume: 0,
      complaintVolume: 0,
      complexity: 3,
      specialRequirements: []
    });
    setIsCreateModalOpen(false);
  };
  
  // Handle updating a client
  const handleUpdateClient = () => {
    if (!selectedClient || !onClientUpdate) return;
    
    const updatedClient: Client = {
      ...selectedClient,
      updatedAt: Date.now()
    };
    
    onClientUpdate(updatedClient);
    setSelectedClient(null);
    setIsEditModalOpen(false);
  };
  
  // Add special requirement to new client
  const handleAddRequirement = () => {
    if (!newRequirement) return;
    
    setNewClient({
      ...newClient,
      specialRequirements: [...(newClient.specialRequirements || []), newRequirement]
    });
    setNewRequirement('');
  };
  
  // Add special requirement to selected client
  const handleAddRequirementToSelected = () => {
    if (!newRequirement || !selectedClient) return;
    
    setSelectedClient({
      ...selectedClient,
      specialRequirements: [...selectedClient.specialRequirements, newRequirement]
    });
    setNewRequirement('');
  };
  
  // Remove special requirement from new client
  const handleRemoveRequirement = (index: number) => {
    const requirements = [...(newClient.specialRequirements || [])];
    requirements.splice(index, 1);
    setNewClient({
      ...newClient,
      specialRequirements: requirements
    });
  };
  
  // Remove special requirement from selected client
  const handleRemoveRequirementFromSelected = (index: number) => {
    if (!selectedClient) return;
    
    const requirements = [...selectedClient.specialRequirements];
    requirements.splice(index, 1);
    setSelectedClient({
      ...selectedClient,
      specialRequirements: requirements
    });
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#004B87]">Client Management</h3>
          <p className="text-sm text-gray-600">
            Manage clients for Factory {factoryId}
          </p>
        </div>
        
        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Client
          </Button>
        )}
      </div>
      
      {/* Factory summary */}
      <Card className="p-5">
        <h4 className="text-md font-medium text-[#004B87] mb-3">Factory Summary</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Total Clients</div>
            <div className="text-xl font-bold text-[#004B87]">{factoryClients.length}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Work Order Volume</div>
            <div className="text-xl font-bold text-[#004B87]">{factoryTotals.workOrderVolume}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Complaint Volume</div>
            <div className="text-xl font-bold text-[#004B87]">{factoryTotals.complaintVolume}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Avg. Complexity</div>
            <div className="text-xl font-bold text-[#004B87]">
              {factoryTotals.avgComplexity.toFixed(1)}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Client list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factoryClients.map(client => (
          <Card key={client.id} className="p-5">
            <div className="flex justify-between items-start">
              <h4 className="text-md font-medium text-[#004B87]">{client.name}</h4>
              
              {isAdmin && (
                <div className="flex space-x-2">
                  <button
                    className="text-xs text-gray-500 hover:text-[#004B87]"
                    onClick={() => {
                      setSelectedClient(client);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs text-red-500 hover:text-red-700"
                    onClick={() => onClientDelete && onClientDelete(client.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            {client.contactName && (
              <p className="text-sm text-gray-600 mt-1">
                Contact: {client.contactName}
              </p>
            )}
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-xs text-gray-500 block">Work Orders:</span>
                <span className="font-medium">{client.workOrderVolume}</span>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 block">Complaints:</span>
                <span className="font-medium">{client.complaintVolume}</span>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 block">Complexity:</span>
                <span className="font-medium">{client.complexity}/5</span>
              </div>
              
              <div>
                <span className="text-xs text-gray-500 block">Requirements:</span>
                <span className="font-medium">{client.specialRequirements.length}</span>
              </div>
            </div>
            
            {client.specialRequirements.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500 block mb-1">Special Requirements:</span>
                <div className="flex flex-wrap gap-1">
                  {client.specialRequirements.map((req, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
        
        {factoryClients.length === 0 && (
          <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No clients for this factory</p>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Add Your First Client
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Create Client Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Client"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              value={newClient.name}
              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Acme Corporation"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                id="contactName"
                value={newClient.contactName}
                onChange={(e) => setNewClient({ ...newClient, contactName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., John Smith"
              />
            </div>
            
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                value={newClient.contactEmail}
                onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., john@acme.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              id="contactPhone"
              value={newClient.contactPhone}
              onChange={(e) => setNewClient({ ...newClient, contactPhone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., (555) 123-4567"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="workOrderVolume" className="block text-sm font-medium text-gray-700 mb-1">
                Work Order Volume
              </label>
              <input
                type="number"
                id="workOrderVolume"
                value={newClient.workOrderVolume}
                onChange={(e) => setNewClient({ ...newClient, workOrderVolume: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="complaintVolume" className="block text-sm font-medium text-gray-700 mb-1">
                Complaint Volume
              </label>
              <input
                type="number"
                id="complaintVolume"
                value={newClient.complaintVolume}
                onChange={(e) => setNewClient({ ...newClient, complaintVolume: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-1">
                Complexity (1-5)
              </label>
              <input
                type="range"
                id="complexity"
                min="1"
                max="5"
                step="1"
                value={newClient.complexity}
                onChange={(e) => setNewClient({ ...newClient, complexity: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Simple</span>
                <span>Average</span>
                <span>Complex</span>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Requirements
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., ISO 9001 certification"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddRequirement}
                disabled={!newRequirement}
              >
                Add
              </Button>
            </div>
            
            {newClient.specialRequirements && newClient.specialRequirements.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {newClient.specialRequirements.map((req, index) => (
                  <div 
                    key={index}
                    className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    <span>{req}</span>
                    <button
                      className="ml-1 text-gray-500 hover:text-red-500"
                      onClick={() => handleRemoveRequirement(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              vari
(Content truncated due to size limit. Use line ranges to read in chunks)