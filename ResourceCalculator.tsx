import React from 'react';
import { ResourceCalculator as ResourceCalculatorType } from '@/types';

interface ResourceCalculatorProps {
  initialData?: ResourceCalculatorType;
  onSave?: (data: ResourceCalculatorType) => void;
  readOnly?: boolean;
}

export default function ResourceCalculator({
  initialData,
  onSave,
  readOnly = false
}: ResourceCalculatorProps) {
  const [workOrderVolume, setWorkOrderVolume] = React.useState(initialData?.workOrderVolume || 0);
  const [factoryId] = React.useState(initialData?.factoryId || '');
  const [leadershipCount, setLeadershipCount] = React.useState(initialData?.staffing?.leadership || 0);
  const [specialistCount, setSpecialistCount] = React.useState(initialData?.staffing?.specialist || 0);
  const [associateCount, setAssociateCount] = React.useState(initialData?.staffing?.associate || 0);
  
  // Calculate recommended staffing based on work order volume
  const calculateRecommendedStaffing = () => {
    // These are simplified calculations for demonstration
    // In a real application, these would be more complex formulas
    const leadership = Math.max(1, Math.floor(workOrderVolume / 1000));
    const specialist = Math.max(2, Math.floor(workOrderVolume / 500));
    const associate = Math.max(3, Math.floor(workOrderVolume / 200));
    
    return {
      leadership,
      specialist,
      associate,
      total: leadership + specialist + associate
    };
  };
  
  const recommendedStaffing = calculateRecommendedStaffing();
  
  // Calculate current staffing
  const currentStaffing = {
    leadership: leadershipCount,
    specialist: specialistCount,
    associate: associateCount,
    total: leadershipCount + specialistCount + associateCount
  };
  
  // Calculate gaps
  const staffingGap = {
    leadership: recommendedStaffing.leadership - currentStaffing.leadership,
    specialist: recommendedStaffing.specialist - currentStaffing.specialist,
    associate: recommendedStaffing.associate - currentStaffing.associate,
    total: recommendedStaffing.total - currentStaffing.total
  };
  
  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave({
        id: initialData?.id || '',
        factoryId,
        workOrderVolume,
        staffing: {
          leadership: leadershipCount,
          specialist: specialistCount,
          associate: associateCount
        },
        recommended: recommendedStaffing,
        gap: staffingGap
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#004B87] mb-4">Resource Calculator</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="workOrderVolume" className="block text-sm font-medium text-gray-700 mb-1">
                Work Order Volume
              </label>
              <input
                type="number"
                id="workOrderVolume"
                value={workOrderVolume}
                onChange={(e) => setWorkOrderVolume(parseInt(e.target.value) || 0)}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                disabled={readOnly}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Staffing
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="leadershipCount" className="block text-xs text-gray-500 mb-1">
                    Leadership
                  </label>
                  <input
                    type="number"
                    id="leadershipCount"
                    value={leadershipCount}
                    onChange={(e) => setLeadershipCount(parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                    disabled={readOnly}
                  />
                </div>
                
                <div>
                  <label htmlFor="specialistCount" className="block text-xs text-gray-500 mb-1">
                    Specialist
                  </label>
                  <input
                    type="number"
                    id="specialistCount"
                    value={specialistCount}
                    onChange={(e) => setSpecialistCount(parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                    disabled={readOnly}
                  />
                </div>
                
                <div>
                  <label htmlFor="associateCount" className="block text-xs text-gray-500 mb-1">
                    Associate
                  </label>
                  <input
                    type="number"
                    id="associateCount"
                    value={associateCount}
                    onChange={(e) => setAssociateCount(parseInt(e.target.value) || 0)}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
            
            {!readOnly && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-[#004B87] rounded-md hover:bg-[#002D56] focus:outline-none focus:ring-2 focus:ring-[#004B87]"
                >
                  Save Scenario
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Results section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#004B87] mb-4">Recommended Staffing</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#E6EEF4] rounded-md">
                <div className="text-xs text-gray-500 mb-1">Leadership</div>
                <div className="text-xl font-bold text-[#004B87]">{recommendedStaffing.leadership}</div>
              </div>
              
              <div className="p-3 bg-[#81C341] bg-opacity-10 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Specialist</div>
                <div className="text-xl font-bold text-[#81C341]">{recommendedStaffing.specialist}</div>
              </div>
              
              <div className="p-3 bg-[#F47920] bg-opacity-10 rounded-md">
                <div className="text-xs text-gray-500 mb-1">Associate</div>
                <div className="text-xl font-bold text-[#F47920]">{recommendedStaffing.associate}</div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="text-sm font-medium text-gray-700 mb-2">Staffing Gap Analysis</div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Leadership</span>
                    <span className={`text-xs font-medium ${staffingGap.leadership > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {staffingGap.leadership > 0 ? `${staffingGap.leadership} needed` : 'Sufficient'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        staffingGap.leadership > 0 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min(
                          (currentStaffing.leadership / recommendedStaffing.leadership) * 100, 
                          100
                        )}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Specialist</span>
                    <span className={`text-xs font-medium ${staffingGap.specialist > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {staffingGap.specialist > 0 ? `${staffingGap.specialist} needed` : 'Sufficient'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        staffingGap.specialist > 0 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min(
                          (currentStaffing.specialist / recommendedStaffing.specialist) * 100, 
                          100
                        )}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Associate</span>
                    <span className={`text-xs font-medium ${staffingGap.associate > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {staffingGap.associate > 0 ? `${staffingGap.associate} needed` : 'Sufficient'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        staffingGap.associate > 0 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min(
                          (currentStaffing.associate / recommendedStaffing.associate) * 100, 
                          100
                        )}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Gap</span>
                    <span className={`text-sm font-medium ${staffingGap.total > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {staffingGap.total > 0 ? `${staffingGap.total} needed` : 'Sufficient'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#004B87] mb-4">Calculation Factors</h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            The recommended staffing levels are calculated based on the following factors:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-md">
              <h4 className="text-sm font-semibold text-[#004B87] mb-2">Leadership</h4>
              <p className="text-xs text-gray-600">
                1 leadership role per 1,000 work orders, with a minimum of 1 leadership role.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-md">
              <h4 className="text-sm font-semibold text-[#81C341] mb-2">Specialist</h4>
              <p className="text-xs text-gray-600">
                1 specialist role per 500 work orders, with a minimum of 2 specialist roles.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-md">
              <h4 className="text-sm font-semibold text-[#F47920] mb-2">Associate</h4>
              <p className="text-xs text-gray-600">
                1 associate role per 200 work orders, with a minimum of 3 associate roles.
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 italic">
            Note: These calculations are simplified for demonstration purposes. In a production environment, 
            more complex formulas would be used based on specific factory requirements, product complexity, 
            and other factors.
          </p>
        </div>
      </div>
    </div>
  );
}
