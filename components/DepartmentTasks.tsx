import React, { useState } from 'react';
import { Department, DepartmentType, Task } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface DepartmentTasksProps {
  tasks: Task[];
  departments: Department[];
  onTaskUpdate?: (task: Task) => void;
  onTaskCreate?: (task: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  isAdmin?: boolean;
  className?: string;
}

export default function DepartmentTasks({
  tasks,
  departments,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  isAdmin = false,
  className = ''
}: DepartmentTasksProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | 'all'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: '',
    description: '',
    currentDepartment: 'Quality',
    targetDepartment: 'Operations',
    complexity: 3,
    effortHours: 0,
    status: 'planned',
    dependencies: [],
    personnelImpact: {}
  });
  
  // Filter tasks by selected department
  const filteredTasks = selectedDepartment === 'all' 
    ? tasks 
    : tasks.filter(task => 
        task.currentDepartment === selectedDepartment || 
        task.targetDepartment === selectedDepartment
      );
  
  // Group tasks by status
  const plannedTasks = filteredTasks.filter(task => task.status === 'planned');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  // Get department color
  const getDepartmentColor = (departmentType: DepartmentType): string => {
    const department = departments.find(d => d.name === departmentType);
    return department?.color || '#004B87';
  };
  
  // Handle creating a new task
  const handleCreateTask = () => {
    if (!newTask.name || !onTaskCreate) return;
    
    const task: Task = {
      id: `task-${Date.now()}`,
      name: newTask.name,
      description: newTask.description || '',
      currentDepartment: newTask.currentDepartment as DepartmentType,
      targetDepartment: newTask.targetDepartment as DepartmentType,
      complexity: newTask.complexity || 3,
      effortHours: newTask.effortHours || 0,
      status: newTask.status as 'planned' | 'in-progress' | 'completed' | 'cancelled',
      dependencies: newTask.dependencies || [],
      personnelImpact: newTask.personnelImpact || {},
      phaseId: newTask.phaseId || '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    onTaskCreate(task);
    setNewTask({
      name: '',
      description: '',
      currentDepartment: 'Quality',
      targetDepartment: 'Operations',
      complexity: 3,
      effortHours: 0,
      status: 'planned',
      dependencies: [],
      personnelImpact: {}
    });
    setIsCreateModalOpen(false);
  };
  
  // Handle updating a task
  const handleUpdateTask = () => {
    if (!selectedTask || !onTaskUpdate) return;
    
    const updatedTask: Task = {
      ...selectedTask,
      updatedAt: Date.now()
    };
    
    onTaskUpdate(updatedTask);
    setSelectedTask(null);
    setIsEditModalOpen(false);
  };
  
  // Handle task status change
  const handleStatusChange = (task: Task, newStatus: 'planned' | 'in-progress' | 'completed' | 'cancelled') => {
    if (!onTaskUpdate) return;
    
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: Date.now()
    };
    
    onTaskUpdate(updatedTask);
  };
  
  // Render task card
  const renderTaskCard = (task: Task) => {
    const currentDeptColor = getDepartmentColor(task.currentDepartment);
    const targetDeptColor = getDepartmentColor(task.targetDepartment);
    
    return (
      <Card 
        key={task.id}
        className="p-4 border-l-4 hover:shadow-md transition-shadow"
        style={{ borderLeftColor: currentDeptColor }}
      >
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-[#004B87]">{task.name}</h4>
          {isAdmin && (
            <div className="flex space-x-1">
              <button
                className="text-xs text-gray-500 hover:text-[#004B87]"
                onClick={() => {
                  setSelectedTask(task);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-xs text-red-500 hover:text-red-700"
                onClick={() => onTaskDelete && onTaskDelete(task.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        )}
        
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div>
            <span className="block">From:</span>
            <span className="font-medium" style={{ color: currentDeptColor }}>
              {task.currentDepartment}
            </span>
          </div>
          <div>
            <span className="block">To:</span>
            <span className="font-medium" style={{ color: targetDeptColor }}>
              {task.targetDepartment}
            </span>
          </div>
          <div>
            <span className="block">Complexity:</span>
            <span className="font-medium">{task.complexity}/5</span>
          </div>
          <div>
            <span className="block">Effort:</span>
            <span className="font-medium">{task.effortHours} hours</span>
          </div>
        </div>
        
        {isAdmin && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
            <div className="flex space-x-2">
              {task.status !== 'planned' && (
                <button
                  className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded"
                  onClick={() => handleStatusChange(task, 'planned')}
                >
                  Set Planned
                </button>
              )}
              {task.status !== 'in-progress' && (
                <button
                  className="text-xs px-2 py-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded"
                  onClick={() => handleStatusChange(task, 'in-progress')}
                >
                  Start
                </button>
              )}
              {task.status !== 'completed' && (
                <button
                  className="text-xs px-2 py-1 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 rounded"
                  onClick={() => handleStatusChange(task, 'completed')}
                >
                  Complete
                </button>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              task.status === 'planned' ? 'bg-gray-100 text-gray-600' :
              task.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
              task.status === 'completed' ? 'bg-green-100 text-green-600' :
              'bg-red-100 text-red-600'
            }`}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          </div>
        )}
      </Card>
    );
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#004B87]">Task Migration</h3>
          <p className="text-sm text-gray-600">
            Manage tasks being migrated between departments
          </p>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value as DepartmentType | 'all')}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          
          {isAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add Task
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planned Tasks */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 border-b pb-2">Planned</h4>
          
          <div className="space-y-3">
            {plannedTasks.map(task => renderTaskCard(task))}
            
            {plannedTasks.length === 0 && (
              <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No planned tasks</p>
              </div>
            )}
          </div>
        </div>
        
        {/* In Progress Tasks */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 border-b pb-2">In Progress</h4>
          
          <div className="space-y-3">
            {inProgressTasks.map(task => renderTaskCard(task))}
            
            {inProgressTasks.length === 0 && (
              <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No tasks in progress</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Completed Tasks */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 border-b pb-2">Completed</h4>
          
          <div className="space-y-3">
            {completedTasks.map(task => renderTaskCard(task))}
            
            {completedTasks.length === 0 && (
              <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No completed tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <input
              type="text"
              id="taskName"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Transfer Quality Inspection Process"
            />
          </div>
          
          <div>
            <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="taskDescription"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Brief description of this task"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="currentDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                Current Department
              </label>
              <select
                id="currentDepartment"
                value={newTask.currentDepartment}
                onChange={(e) => setNewTask({ ...newTask, currentDepartment: e.target.value as DepartmentType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {departments.map(dept => (
                  <option key={`current-${dept.id}`} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="targetDepartment" className="block text-sm font-medium text-gray-700 mb-1">
                Target Department
              </label>
              <select
                id="targetDepartment"
                value={newTask.targetDepartment}
                onChange={(e) => setNewTask({ ...newTask, targetDepartment: e.target.value as DepartmentType })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {departments.map(dept => (
                  <option key={`target-${dept.id}`} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
                value={newTask.complexity}
                onChange={(e) => setNewTask({ ...newTask, complexity: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Simple</span>
                <span>Average</span>
                <span>Complex</span>
              </div>
            </div>
            
            <div>
              <label htmlFor="effortHours" className="block text-sm font-medium text-gray-700 mb-1">
                Effort Hours
              </label>
              <input
                type="number"
                id="effortHours"
                value={newTask.effortHours}
                onChange={(e) => setNewTask({ ...newTask, effortHours: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
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
              onClick={handleCreateTask}
              disabled={!newTask.name}
            >
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Task"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="editTaskName" className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <input
              type="text"
              id="editTaskName"
              value={selectedTask?.name || ''}
              onChange={(e) => setSelectedTask(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
        
(Content truncated due to size limit. Use line ranges to read in chunks)