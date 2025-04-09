import React, { useState, useEffect } from 'react';
import { Department, DepartmentType, Task, TaskStatus } from '@/lib';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import Modal from '@/lib/components/ui/modal';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface DepartmentTasksProps {
  tasks: Task[];
  departments: Department[];
  selectedDepartment: DepartmentType | null;
  onTaskUpdate?: (taskId: string, data: Partial<Task>) => Promise<boolean>;
  onTaskCreate?: (task: Partial<Task>) => Promise<string | null>;
  onTaskDelete?: (taskId: string) => Promise<boolean>;
  isAdmin?: boolean;
  className?: string;
}

const TASK_STATUSES: TaskStatus[] = ['planned', 'in-progress', 'completed', 'cancelled'];

export default function DepartmentTasks({
  tasks,
  departments,
  selectedDepartment,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  isAdmin = false,
  className = ''
}: DepartmentTasksProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editTaskState, setEditTaskState] = useState<Partial<Task>>({});
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  
  const resetNewTaskForm = () => {
    setNewTask({
      name: '',
      description: '',
      currentDepartment: selectedDepartment || departments[0]?.id || 'Quality',
      targetDepartment: departments[1]?.id || departments[0]?.id || 'Operations',
      complexity: 3,
      effortHours: 0,
      status: 'planned',
      dependencies: [],
      personnelImpact: {}
    });
  };

  useEffect(() => {
    resetNewTaskForm();
  }, [selectedDepartment, departments]);
  
  const plannedTasks = tasks.filter(task => task.status === 'planned');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const cancelledTasks = tasks.filter(task => task.status === 'cancelled');
  
  const getDepartmentColor = (departmentType: DepartmentType): string => {
    const department = departments.find(d => d.id === departmentType);
    return department?.color || '#004B87';
  };
  
  const handleCreateTask = async () => {
    if (!newTask.name || !onTaskCreate) return;
    const newTaskId = await onTaskCreate(newTask);
    if (newTaskId) {
      resetNewTaskForm();
      setIsCreateModalOpen(false);
    }
  };
  
  const handleUpdateTask = async () => {
    if (!taskToEdit || !onTaskUpdate) return;
    const success = await onTaskUpdate(taskToEdit.id, editTaskState);
    if (success) {
      setTaskToEdit(null);
      setEditTaskState({});
      setIsEditModalOpen(false);
    }
  };
  
  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setEditTaskState(task);
    setIsEditModalOpen(true);
  };
  
  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    if (!onTaskUpdate) return;
    onTaskUpdate(task.id, { status: newStatus });
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, formStateSetter: React.Dispatch<React.SetStateAction<Partial<Task>>>) => {
    const { name, value, type } = e.target;
    formStateSetter(prev => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? parseInt(value) || 0 : value
    }));
  };
  
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
                className="text-xs text-gray-500 hover:text-[#004B87] p-1"
                onClick={() => openEditModal(task)}
                title="Edit Task"
              >
                <Edit2 size={14} />
              </button>
              <button
                className="text-xs text-red-500 hover:text-red-700 p-1"
                onClick={() => onTaskDelete && onTaskDelete(task.id)}
                title="Delete Task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
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
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          {isAdmin ? (
            <select 
              value={task.status}
              onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
              className="text-xs p-1 border border-gray-200 rounded bg-white"
            >
              {TASK_STATUSES.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <span className={`text-xs px-2 py-1 rounded ${
              task.status === 'planned' ? 'bg-gray-100 text-gray-600' :
              task.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
              task.status === 'completed' ? 'bg-green-100 text-green-600' :
              'bg-red-100 text-red-600'
            }`}>
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          )}
        </div>
      </Card>
    );
  };
  
  if (!selectedDepartment) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#004B87]">Task Migration</h3>
          <p className="text-sm text-gray-600">
            Tasks involving the <span className="font-semibold">{selectedDepartment}</span> department.
          </p>
        </div>
        
        {isAdmin && (
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-1" /> Add Task
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-md font-semibold mb-3 text-gray-600">Planned</h4>
          <div className="space-y-4">
            {plannedTasks.map(renderTaskCard)}
            {plannedTasks.length === 0 && (
              <p className="text-sm text-center text-gray-400 py-4">No planned tasks.</p>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-semibold mb-3 text-gray-600">In Progress</h4>
          <div className="space-y-4">
            {inProgressTasks.map(renderTaskCard)}
            {inProgressTasks.length === 0 && (
              <p className="text-sm text-center text-gray-400 py-4">No tasks in progress.</p>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-semibold mb-3 text-gray-600">Completed</h4>
          <div className="space-y-4">
            {completedTasks.map(renderTaskCard)}
            {completedTasks.length === 0 && (
              <p className="text-sm text-center text-gray-400 py-4">No completed tasks.</p>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-semibold mb-3 text-gray-600">Cancelled</h4>
          <div className="space-y-4">
            {cancelledTasks.map(renderTaskCard)}
            {cancelledTasks.length === 0 && (
              <p className="text-sm text-center text-gray-400 py-4">No cancelled tasks.</p>
            )}
          </div>
        </div>
      </div>
      
      {isCreateModalOpen && (
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Task">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Name *</label>
              <input 
                type="text" name="name" value={newTask.name || ''}
                onChange={(e) => handleFormChange(e, setNewTask)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                name="description" value={newTask.description || ''}
                onChange={(e) => handleFormChange(e, setNewTask)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Dept</label>
                <select name="currentDepartment" value={newTask.currentDepartment} onChange={(e) => handleFormChange(e, setNewTask)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}                 
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Dept</label>
                <select name="targetDepartment" value={newTask.targetDepartment} onChange={(e) => handleFormChange(e, setNewTask)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}                 
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Complexity (1-5)</label>
                <input type="range" name="complexity" min="1" max="5" value={newTask.complexity || 3} onChange={(e) => handleFormChange(e, setNewTask)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Effort (Hours)</label>
                <input type="number" name="effortHours" value={newTask.effortHours || 0} onChange={(e) => handleFormChange(e, setNewTask)} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Status</label>
              <select name="status" value={newTask.status} onChange={(e) => handleFormChange(e, setNewTask)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {TASK_STATUSES.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}                 
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateTask} disabled={!newTask.name}>Create Task</Button>
          </div>
        </Modal>
      )}
      
      {isEditModalOpen && taskToEdit && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={`Edit Task: ${taskToEdit.name}`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Name *</label>
              <input 
                type="text" name="name" value={editTaskState.name || ''}
                onChange={(e) => handleFormChange(e, setEditTaskState)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                name="description" value={editTaskState.description || ''}
                onChange={(e) => handleFormChange(e, setEditTaskState)}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Dept</label>
                <select name="currentDepartment" value={editTaskState.currentDepartment} onChange={(e) => handleFormChange(e, setEditTaskState)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}                 
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Dept</label>
                <select name="targetDepartment" value={editTaskState.targetDepartment} onChange={(e) => handleFormChange(e, setEditTaskState)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}                 
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Complexity (1-5)</label>
                <input type="range" name="complexity" min="1" max="5" value={editTaskState.complexity || 3} onChange={(e) => handleFormChange(e, setEditTaskState)} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Effort (Hours)</label>
                <input type="number" name="effortHours" value={editTaskState.effortHours || 0} onChange={(e) => handleFormChange(e, setEditTaskState)} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select name="status" value={editTaskState.status} onChange={(e) => handleFormChange(e, setEditTaskState)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                {TASK_STATUSES.map(status => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}                 
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdateTask} disabled={!editTaskState.name}>Save Changes</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}