import React from 'react';
import { Scenario } from '@/lib';
import { useStaffingCalculator } from '@/lib/hooks/useStaffingCalculator';
import { Card, CardHeader, CardContent, CardTitle } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';

interface GapAnalysisProps {
  selectedScenario: Scenario | null;
}

export default function GapAnalysis({
  selectedScenario
}: GapAnalysisProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  
  // Prepare inputs for the hook, using defaults if no scenario selected
  const workOrderVolume = selectedScenario?.workOrderVolume || 0;
  const currentStaffingInput = {
    leadership: selectedScenario?.staffing?.leadership || 0,
    specialist: selectedScenario?.staffing?.specialist || 0,
    associate: selectedScenario?.staffing?.associate || 0
  };

  // Use the hook to get calculations
  const { recommendedStaffing, staffingGap } = useStaffingCalculator(workOrderVolume, currentStaffingInput);

  // Helper to format gap numbers
  const formatGap = (gap: number) => {
    if (gap > 0) return <span className="text-red-600">+{gap} Needed</span>;
    if (gap < 0) return <span className="text-green-600">{gap} Surplus</span>;
    return <span className="text-gray-500">0 Balanced</span>;
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#004B87]">Gap Analysis</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
        
        <div className="mb-4">
          <p className="text-[#707070] mb-2">
            Analysis for {selectedScenario?.name || 'Selected Scenario'} with {workOrderVolume} monthly work orders
          </p>
          
          {!selectedScenario ? (
            <p className="text-sm text-gray-500">Select a scenario to view gap analysis.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-medium text-gray-800 mb-2">Staffing Gap vs Recommended</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Leadership:</span>
                    {formatGap(staffingGap.leadership)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Specialist:</span>
                    {formatGap(staffingGap.specialist)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Associate:</span>
                    {formatGap(staffingGap.associate)}
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-700">Total:</span>
                    <span className="font-semibold">{formatGap(staffingGap.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-[#004B87] mb-3">Detailed Gap Analysis</h4>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Calculated
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gap
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.keys(recommendedStaffing).map((roleId) => {
                    const role = selectedScenario?.roles.find(r => r.id === roleId);
                    if (!role) return null;
                    
                    const calculated = recommendedStaffing[roleId] || 0;
                    const current = currentStaffingInput[role.level.toLowerCase() as 'leadership' | 'specialist' | 'associate'] || 0;
                    const gap = calculated - current;
                    const avgSalary = (role.salary.min + role.salary.max) / 2;
                    const roleCostImpact = gap * avgSalary;
                    
                    return (
                      <tr key={roleId}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-[#004B87]">
                          {role.title}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {role.level.charAt(0).toUpperCase() + role.level.slice(1)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {calculated}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                          {current}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${
                            gap > 0 ? 'bg-red-100 text-red-800' : 
                            gap < 0 ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {gap > 0 ? `+${gap}` : gap}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`${roleCostImpact > 0 ? 'text-red-600' : roleCostImpact < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                            {roleCostImpact > 0 ? '+' : ''} ${roleCostImpact.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
