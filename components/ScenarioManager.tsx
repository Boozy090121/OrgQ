import React, { useState } from 'react';
import { Scenario } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface ScenarioManagerProps {
  scenarios: Scenario[];
  onSaveScenario: (scenario: Scenario) => void;
  onDeleteScenario: (scenarioId: string) => void;
  onEditScenario: (scenario: Scenario) => void;
  isAdmin: boolean;
}

export default function ScenarioManager({
  scenarios,
  onSaveScenario,
  onDeleteScenario,
  onEditScenario,
  isAdmin
}: ScenarioManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    name: '',
    description: '',
  });
  
  // Handle creating a new scenario
  const handleCreateScenario = () => {
    if (!newScenario.name) return;
    
    const scenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: newScenario.name,
      description: newScenario.description || '',
      factoryId: newScenario.factoryId || '1',
      workOrderVolume: newScenario.workOrderVolume || 0,
      complexity: newScenario.complexity || 1,
      clientRequirements: newScenario.clientRequirements || [],
      staffing: newScenario.staffing || {
        leadership: 0,
        specialist: 0,
        associate: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    onSaveScenario(scenario);
    setNewScenario({ name: '', description: '' });
    setIsCreateModalOpen(false);
  };
  
  // Handle editing a scenario
  const handleEditScenario = () => {
    if (!selectedScenario || !selectedScenario.name) return;
    
    const updatedScenario: Scenario = {
      ...selectedScenario,
      updatedAt: Date.now()
    };
    
    onEditScenario(updatedScenario);
    setSelectedScenario(null);
    setIsEditModalOpen(false);
  };
  
  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#004B87]">Scenario Management</h3>
        
        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Scenario
          </Button>
        )}
      </div>
      
      {scenarios.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No scenarios available</p>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Your First Scenario
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map(scenario => (
            <div
              key={scenario.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-md font-medium text-[#004B87]">{scenario.name}</h4>
                {isAdmin && (
                  <div className="flex space-x-1">
                    <button
                      className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        setSelectedScenario(scenario);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs px-2 py-1 text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this scenario?')) {
                          onDeleteScenario(scenario.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              {scenario.description && (
                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
              )}
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Factory:</span>
                  <span className="font-medium">Factory {scenario.factoryId}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Work Orders:</span>
                  <span className="font-medium">{scenario.workOrderVolume}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Leadership:</span>
                  <span className="font-medium">{scenario.staffing.leadership}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Specialist:</span>
                  <span className="font-medium">{scenario.staffing.specialist}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Associate:</span>
                  <span className="font-medium">{scenario.staffing.associate}</span>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Total:</span>
                  <span className="font-medium">
                    {scenario.staffing.leadership + scenario.staffing.specialist + scenario.staffing.associate}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Created: {formatDate(scenario.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Scenario Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Scenario"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Scenario Name
            </label>
            <input
              type="text"
              id="name"
              value={newScenario.name}
              onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Growth Plan 2025"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={newScenario.description}
              onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Brief description of this scenario"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateScenario}
              disabled={!newScenario.name}
            >
              Create Scenario
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Scenario Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Scenario"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">
              Scenario Name
            </label>
            <input
              type="text"
              id="editName"
              value={selectedScenario?.name || ''}
              onChange={(e) => setSelectedScenario(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="editDescription"
              value={selectedScenario?.description || ''}
              onChange={(e) => setSelectedScenario(prev => prev ? { ...prev, description: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
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
              onClick={handleEditScenario}
              disabled={!selectedScenario?.name}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
