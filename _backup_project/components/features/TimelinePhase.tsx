import { Phase } from '@\/lib';

interface TimelinePhaseProps {
  phase: Phase;
  isExpanded?: boolean;
  isAdmin?: boolean;
  onToggleExpand?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddActivity?: () => void;
}

export default function TimelinePhase({
  phase,
  isExpanded = false,
  isAdmin = false,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddActivity
}: TimelinePhaseProps) {
  return (
    <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center bg-[#E6EEF4]"
        onClick={onToggleExpand}
      >
        <div>
          <h3 className="text-lg font-semibold text-[#004B87]">{phase.title}</h3>
          <p className="text-[#707070]">{phase.timeframe}</p>
        </div>
        <div className="flex items-center">
          <span className="text-[#707070]">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {phase.activities.length > 0 ? (
            <div className="mb-4">
              <h4 className="font-medium text-[#004B87] mb-2">Activities</h4>
              <ul className="space-y-2">
                {phase.activities.map((activity) => (
                  <li key={activity.id} className="p-3 bg-[#F1F1F1] rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-[#004B87]">{activity.title}</h5>
                        <p className="text-sm text-[#707070]">{activity.description}</p>
                      </div>
                      {isAdmin && (
                        <div className="flex space-x-2">
                          <button className="text-xs bg-white hover:bg-[#004B87] hover:text-white px-2 py-1 rounded transition-colors">
                            Edit
                          </button>
                          <button className="text-xs bg-white hover:bg-[#F47920] hover:text-white px-2 py-1 rounded transition-colors">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-[#707070] italic mb-4">No activities added yet.</p>
          )}
          
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
              <div>
                <button 
                  onClick={onAddActivity}
                  className="bg-[#81C341] hover:bg-[#6ba235] text-white px-4 py-2 rounded-md transition-colors mr-2"
                >
                  Add Activity
                </button>
                <button 
                  onClick={onEdit}
                  className="bg-[#004B87] hover:bg-[#002D56] text-white px-4 py-2 rounded-md transition-colors"
                >
                  Edit Phase
                </button>
              </div>
              <button 
                onClick={onDelete}
                className="bg-white border border-[#F47920] text-[#F47920] hover:bg-[#F47920] hover:text-white px-4 py-2 rounded-md transition-colors"
              >
                Delete Phase
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
