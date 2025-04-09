import { Personnel } from '@/types';

interface PersonnelCardProps {
  personnel: Personnel;
  isDraggable?: boolean;
  isAssigned?: boolean;
  onAssign?: () => void;
  onUnassign?: () => void;
  onEdit?: () => void;
}

export default function PersonnelCard({
  personnel,
  isDraggable = false,
  isAssigned = false,
  onAssign,
  onUnassign,
  onEdit
}: PersonnelCardProps) {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm p-3 mb-2
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isAssigned ? 'border-l-4 border-[#81C341]' : 'border-l-4 border-[#F1F1F1]'}
      `}
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium text-[#004B87]">{personnel.name}</h4>
          <p className="text-sm text-[#707070]">
            {personnel.assignedRole ? 'Assigned' : 'Unassigned'}
            {personnel.assignedFactory && ` • ${personnel.assignedFactory}`}
          </p>
        </div>
        <div className="flex space-x-2">
          {!isAssigned && onAssign && (
            <button 
              onClick={onAssign}
              className="text-xs bg-[#E6EEF4] hover:bg-[#81C341] hover:text-white px-2 py-1 rounded transition-colors"
            >
              Assign
            </button>
          )}
          {isAssigned && onUnassign && (
            <button 
              onClick={onUnassign}
              className="text-xs bg-[#E6EEF4] hover:bg-[#F47920] hover:text-white px-2 py-1 rounded transition-colors"
            >
              Unassign
            </button>
          )}
          {onEdit && (
            <button 
              onClick={onEdit}
              className="text-xs bg-[#E6EEF4] hover:bg-[#004B87] hover:text-white px-2 py-1 rounded transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
