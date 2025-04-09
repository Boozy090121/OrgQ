import { Role } from '@/lib';

interface RoleCardProps {
  role: Role;
  isExpanded?: boolean;
  isAdmin?: boolean;
  onToggleExpand?: () => void;
  onEdit?: () => void;
}

export default function RoleCard({ 
  role, 
  isExpanded = false, 
  isAdmin = false,
  onToggleExpand,
  onEdit
}: RoleCardProps) {
  // Determine background color based on role level
  const getBgColor = () => {
    switch(role.level) {
      case 'leadership':
        return 'border-l-4 border-[#004B87]';
      case 'specialist':
        return 'border-l-4 border-[#81C341]';
      case 'associate':
        return 'border-l-4 border-[#F47920]';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${getBgColor()}`}>
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={onToggleExpand}
      >
        <div>
          <h3 className="text-lg font-semibold text-[#004B87]">{role.title}</h3>
          <p className="text-[#707070]">{role.department}</p>
        </div>
        <div className="flex items-center">
          {role.factorySpecific && (
            <span className="bg-[#E6EEF4] text-[#004B87] text-xs px-2 py-1 rounded-full mr-2">
              Factory Specific
            </span>
          )}
          <span className="text-[#707070]">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4">
            <h4 className="font-medium text-[#004B87] mb-2">Core Responsibilities</h4>
            <ul className="list-disc pl-5 text-[#707070]">
              {role.responsibilities.map((resp, index) => (
                <li key={index}>{resp}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-[#004B87] mb-2">Detailed Responsibilities</h4>
            {Object.entries(role.detailedResponsibilities).map(([category, items]) => (
              <div key={category} className="mb-3">
                <h5 className="text-sm font-medium text-[#707070]">{category}</h5>
                <ul className="list-disc pl-5 text-[#707070]">
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium text-[#004B87] mb-2">Salary Range</h4>
            <p className="text-[#707070]">
              ${role.salary.min.toLocaleString()} - ${role.salary.max.toLocaleString()} per year
            </p>
          </div>
          
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={onEdit}
                className="bg-[#004B87] hover:bg-[#002D56] text-white px-4 py-2 rounded-md transition-colors"
              >
                Edit Role
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
