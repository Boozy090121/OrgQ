import React, { useState } from 'react';
import { Phase, Task, DepartmentType } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface PhasedApproachProps {
  phases: Phase[];
  tasks: Task[];
  onPhaseCreate?: (phase: Phase) => void;
  onPhaseUpdate?: (phase: Phase) => void;
  onPhaseDelete?: (phaseId: string) => void;
  isAdmin?: boolean;
  className?: string;
}

export default function PhasedApproach({
  phases,
  tasks,
  onPhaseCreate,
  onPhaseUpdate,
  onPhaseDelete,
  isAdmin = false,
  className = ''
}: PhasedApproachProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);
  const [newPhase, setNewPhase] = useState<Partial<Phase>>({
    title: '',
    timeframe: '',
    activities: [],
    order: phases.length + 1,
    tasks: []
  });
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  
  // Sort phases by order
  const sortedPhases = [...phases].sort((a, b) => a.order - b.order);
  
  // Get department color
  const getDepartmentColor = (departmentType: DepartmentType): string => {
    switch (departmentType) {
      case 'Quality':
        return '#004B87';
      case 'Operations':
        return '#81C341';
      case 'Engineering':
        return '#F47920';
      default:
        return '#004B87';
    }
  };
  
  // Calculate department impact for a phase
  const calculateDepartmentImpact = (phase: Phase) => {
    const phaseTasks = tasks.filter(task => phase.tasks?.includes(task.id));
    
    const impact: {
      [department in DepartmentType]?: {
        leadership: number;
        specialist: number;
        associate: number;
      };
    } = {};
    
    phaseTasks.forEach(task => {
      if (task.personnelImpact) {
        Object.entries(task.personnelImpact).forEach(([dept, staffing]) => {
          const department = dept as DepartmentType;
          
          if (!impact[department]) {
            impact[department] = {
              leadership: 0,
              specialist: 0,
              associate: 0
            };
          }
          
          impact[department]!.leadership += staffing.leadership || 0;
          impact[department]!.specialist += staffing.specialist || 0;
          impact[department]!.associate += staffing.associate || 0;
        });
      }
    });
    
    return impact;
  };
  
  // Handle creating a new phase
  const handleCreatePhase = () => {
    if (!newPhase.title || !onPhaseCreate) return;
    
    const phase: Phase = {
      id: `phase-${Date.now()}`,
      title: newPhase.title,
      timeframe: newPhase.timeframe || '',
      activities: newPhase.activities || [],
      order: newPhase.order || phases.length + 1,
      tasks: selectedTaskIds
    };
    
    onPhaseCreate(phase);
    setNewPhase({
      title: '',
      timeframe: '',
      activities: [],
      order: phases.length + 2,
      tasks: []
    });
    setSelectedTaskIds([]);
    setIsCreateModalOpen(false);
  };
  
  // Handle updating a phase
  const handleUpdatePhase = () => {
    if (!selectedPhase || !onPhaseUpdate) return;
    
    const updatedPhase: Phase = {
      ...selectedPhase,
      tasks: selectedTaskIds
    };
    
    onPhaseUpdate(updatedPhase);
    setSelectedPhase(null);
    setSelectedTaskIds([]);
    setIsEditModalOpen(false);
  };
  
  // Toggle task selection
  const toggleTaskSelection = (taskId: string) => {
    if (selectedTaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedTaskIds.filter(id => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
    }
  };
  
  // Initialize edit modal
  const initEditModal = (phase: Phase) => {
    setSelectedPhase(phase);
    setSelectedTaskIds(phase.tasks || []);
    setIsEditModalOpen(true);
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#004B87]">Phased Deployment Approach</h3>
          <p className="text-sm text-gray-600">
            Plan and visualize the phased implementation of your focus factory build
          </p>
        </div>
        
        {isAdmin && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Phase
          </Button>
        )}
      </div>
      
      {/* Timeline visualization */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Phases */}
        <div className="space-y-8 ml-8">
          {sortedPhases.map((phase, index) => {
            const phaseTasks = tasks.filter(task => phase.tasks?.includes(task.id));
            const departmentImpact = calculateDepartmentImpact(phase);
            
            return (
              <div key={phase.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-[#004B87] border-2 border-white shadow-sm"></div>
                
                <Card className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-[#004B87]">
                        Phase {index + 1}: {phase.title}
                      </h4>
                      {phase.timeframe && (
                        <p className="text-sm text-gray-600 mt-1">{phase.timeframe}</p>
                      )}
                    </div>
                    
                    {isAdmin && (
                      <div className="flex space-x-2">
                        <button
                          className="text-sm text-gray-500 hover:text-[#004B87]"
                          onClick={() => initEditModal(phase)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-sm text-red-500 hover:text-red-700"
                          onClick={() => onPhaseDelete && onPhaseDelete(phase.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Tasks in this phase */}
                  {phaseTasks.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Tasks</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {phaseTasks.map(task => (
                          <div 
                            key={task.id}
                            className="p-3 bg-gray-50 rounded-md border border-gray-200"
                          >
                            <div className="flex justify-between items-start">
                              <h6 className="font-medium text-[#004B87]">{task.name}</h6>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                task.status === 'planned' ? 'bg-gray-100 text-gray-600' :
                                task.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                                task.status === 'completed' ? 'bg-green-100 text-green-600' :
                                'bg-red-100 text-red-600'
                              }`}>
                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                              </span>
                            </div>
                            
                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                              <div>
                                <span style={{ color: getDepartmentColor(task.currentDepartment) }}>
                                  {task.currentDepartment}
                                </span>
                                {' → '}
                                <span style={{ color: getDepartmentColor(task.targetDepartment) }}>
                                  {task.targetDepartment}
                                </span>
                              </div>
                              <div>
                                Effort: {task.effortHours} hours
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Department impact */}
                  {Object.keys(departmentImpact).length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Department Impact</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Object.entries(departmentImpact).map(([dept, staffing]) => (
                          <div 
                            key={dept}
                            className="p-3 rounded-md"
                            style={{ backgroundColor: `${getDepartmentColor(dept as DepartmentType)}20` }}
                          >
                            <h6 className="font-medium" style={{ color: getDepartmentColor(dept as DepartmentType) }}>
                              {dept}
                            </h6>
                            <div className="mt-1 space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Leadership:</span>
                                <span className="font-medium">{staffing.leadership}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Specialist:</span>
                                <span className="font-medium">{staffing.specialist}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Associate:</span>
                                <span className="font-medium">{staffing.associate}</span>
                              </div>
                              <div className="flex justify-between pt-1 border-t border-gray-200 mt-1">
                                <span>Total:</span>
                                <span className="font-medium">
                                  {staffing.leadership + staffing.specialist + staffing.associate}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
          
          {sortedPhases.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">No phases defined yet</p>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Your First Phase
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Create Phase Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Phase"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="phaseTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Phase Title
            </label>
            <input
              type="text"
              id="phaseTitle"
              value={newPhase.title}
              onChange={(e) => setNewPhase({ ...newPhase, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Initial Deployment"
            />
          </div>
          
          <div>
            <label htmlFor="phaseTimeframe" className="block text-sm font-medium text-gray-700 mb-1">
              Timeframe
            </label>
            <input
              type="text"
              id="phaseTimeframe"
              value={newPhase.timeframe}
              onChange={(e) => setNewPhase({ ...newPhase, timeframe: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Q1 2026"
            />
          </div>
          
          <div>
            <label htmlFor="phaseOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Order
            </label>
            <input
              type="number"
              id="phaseOrder"
              value={newPhase.order}
              onChange={(e) => setNewPhase({ ...newPhase, order: parseInt(e.target.value) || phases.length + 1 })}
              min={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Tasks for this Phase
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No tasks available</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div 
                      key={task.id}
                      className={`p-2 rounded-md cursor-pointer ${
                        selectedTaskIds.includes(task.id) 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleTaskSelection(task.id)}
                    >
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={selectedTaskIds.includes(task.id)}
                          onChange={() => toggleTaskSelection(task.id)}
                          className="mt-1 mr-2"
                        />
                        <div>
                          <h6 className="font-medium text-[#004B87]">{task.name}</h6>
                          <div className="text-xs text-gray-500 mt-1">
                            <span style={{ color: getDepartmentColor(task.currentDepartment) }}>
                              {task.currentDepartment}
                            </span>
                            {' → '}
                            <span style={{ color: getDepartmentColor(task.targetDepartment) }}>
                              {task.targetDepartment}
                            </span>
                            {' • '}
                            <span>Effort: {task.effortHours} hours</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              varian
(Content truncated due to size limit. Use line ranges to read in chunks)