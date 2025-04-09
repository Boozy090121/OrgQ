import { useState } from 'react';
import { Role, Factory } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface GapAnalysisProps {
  calculatedStaffing: {[key: string]: number};
  currentStaffing: {[key: string]: number};
  roles: Role[];
  factory: Factory | undefined;
  workOrderVolume: number;
}

export default function GapAnalysis({ 
  calculatedStaffing, 
  currentStaffing, 
  roles,
  factory,
  workOrderVolume
}: GapAnalysisProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate total gap
  const calculateTotalGap = () => {
    let totalCalculated = 0;
    let totalCurrent = 0;
    
    Object.keys(calculatedStaffing).forEach(roleId => {
      totalCalculated += calculatedStaffing[roleId] || 0;
      totalCurrent += currentStaffing[roleId] || 0;
    });
    
    return totalCalculated - totalCurrent;
  };
  
  // Calculate gap by role level
  const calculateGapByLevel = (level: 'leadership' | 'specialist' | 'associate') => {
    let levelCalculated = 0;
    let levelCurrent = 0;
    
    Object.keys(calculatedStaffing).forEach(roleId => {
      const role = roles.find(r => r.id === roleId);
      if (role && role.level === level) {
        levelCalculated += calculatedStaffing[roleId] || 0;
        levelCurrent += currentStaffing[roleId] || 0;
      }
    });
    
    return levelCalculated - levelCurrent;
  };
  
  // Calculate estimated cost impact
  const calculateCostImpact = () => {
    let costImpact = 0;
    
    Object.keys(calculatedStaffing).forEach(roleId => {
      const role = roles.find(r => r.id === roleId);
      if (role) {
        const gap = (calculatedStaffing[roleId] || 0) - (currentStaffing[roleId] || 0);
        const avgSalary = (role.salary.min + role.salary.max) / 2;
        costImpact += gap * avgSalary;
      }
    });
    
    return costImpact;
  };
  
  const totalGap = calculateTotalGap();
  const leadershipGap = calculateGapByLevel('leadership');
  const specialistGap = calculateGapByLevel('specialist');
  const associateGap = calculateGapByLevel('associate');
  const costImpact = calculateCostImpact();
  
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
            Analysis for {factory?.name || 'Selected Factory'} with {workOrderVolume} monthly work orders
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-[#E6EEF4] rounded-md text-center">
              <p className="font-medium text-[#004B87]">Total Gap</p>
              <p className={`text-2xl font-bold ${totalGap > 0 ? 'text-red-600' : totalGap < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                {totalGap > 0 ? `+${totalGap}` : totalGap}
              </p>
            </div>
            
            <div className="p-3 bg-[#E6EEF4] rounded-md text-center">
              <p className="font-medium text-[#004B87]">Leadership</p>
              <p className={`text-2xl font-bold ${leadershipGap > 0 ? 'text-red-600' : leadershipGap < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                {leadershipGap > 0 ? `+${leadershipGap}` : leadershipGap}
              </p>
            </div>
            
            <div className="p-3 bg-[#E6EEF4] rounded-md text-center">
              <p className="font-medium text-[#004B87]">Specialist</p>
              <p className={`text-2xl font-bold ${specialistGap > 0 ? 'text-red-600' : specialistGap < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                {specialistGap > 0 ? `+${specialistGap}` : specialistGap}
              </p>
            </div>
            
            <div className="p-3 bg-[#E6EEF4] rounded-md text-center">
              <p className="font-medium text-[#004B87]">Associate</p>
              <p className={`text-2xl font-bold ${associateGap > 0 ? 'text-red-600' : associateGap < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                {associateGap > 0 ? `+${associateGap}` : associateGap}
              </p>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-[#004B87]">Estimated Cost Impact</h4>
              <span className={`text-lg font-bold ${costImpact > 0 ? 'text-red-600' : costImpact < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                {costImpact > 0 ? '+' : ''} ${costImpact.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-[#707070]">
              {costImpact > 0 
                ? 'Additional budget needed to meet staffing requirements' 
                : costImpact < 0 
                  ? 'Potential savings from current staffing levels' 
                  : 'Current staffing matches calculated needs'}
            </p>
          </div>
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
                  {Object.keys(calculatedStaffing).map((roleId) => {
                    const role = roles.find(r => r.id === roleId);
                    if (!role) return null;
                    
                    const calculated = calculatedStaffing[roleId] || 0;
                    const current = currentStaffing[roleId] || 0;
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
