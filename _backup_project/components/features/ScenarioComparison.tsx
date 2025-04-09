import React from 'react';
import { Scenario } from '@\/lib';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
  // Add prop to receive selected scenario IDs from parent if needed for highlighting
  // selectedScenarioIds?: string[]; 
}

export default function ScenarioComparison({
  scenarios,
  // selectedScenarioIds = [] // Default to empty array if passed
}: ScenarioComparisonProps) {
  // Remove internal state: const [selectedScenarios, setSelectedScenarios] = React.useState<string[]>([]);
  
  // Remove toggleScenarioSelection - Parent should handle selection
  
  // Data is now just the scenarios prop - Parent should pass already filtered/selected scenarios if needed
  // Or, implement comparison logic based on all scenarios passed.
  // For now, assume we compare all provided scenarios.
  const scenariosToCompare = scenarios; 

  // Calculate max values for scaling based on scenariosToCompare
  const getMaxValues = () => {
    let maxLeadership = 0;
    let maxSpecialist = 0;
    let maxAssociate = 0;
    let maxTotal = 0;
    
    scenariosToCompare.forEach(scenario => {
      const leadership = scenario.staffing?.leadership || 0;
      const specialist = scenario.staffing?.specialist || 0;
      const associate = scenario.staffing?.associate || 0;
      const total = leadership + specialist + associate;
      
      maxLeadership = Math.max(maxLeadership, leadership);
      maxSpecialist = Math.max(maxSpecialist, specialist);
      maxAssociate = Math.max(maxAssociate, associate);
      maxTotal = Math.max(maxTotal, total);
    });
    
    return { maxLeadership, maxSpecialist, maxAssociate, maxTotal };
  };
  
  const maxValues = getMaxValues();
  
  // Get color for scenario
  const getScenarioColor = (index: number): string => {
    const colors = ['#004B87', '#81C341', '#F47920', '#a855f7', '#ec4899']; // Added more colors
    return colors[index % colors.length];
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#004B87] mb-4">Staffing Comparison</h3>
        
        {/* Remove the scenario selection UI */}
        {/* <div className="space-y-4"> ... </div> */}
      </div>
      
      {scenariosToCompare.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {/* Render comparison based on scenariosToCompare */}
          <div className="space-y-6">
            {/* Leadership comparison */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Leadership Roles</h4>
              <div className="space-y-3">
                {scenariosToCompare.map((scenario, index) => (
                  <div key={scenario.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: getScenarioColor(index) }}>
                        {scenario.name || `Scenario ${scenario.id.slice(0, 4)}`}
                      </span>
                      <span className="text-xs font-medium">
                        {scenario.staffing?.leadership || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${maxValues.maxLeadership > 0 
                            ? ((scenario.staffing?.leadership || 0) / maxValues.maxLeadership) * 100 
                            : 0}%`,
                          backgroundColor: getScenarioColor(index)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Specialist comparison */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Specialist Roles</h4>
              
              <div className="space-y-3">
                {scenariosToCompare.map((scenario, index) => (
                  <div key={scenario.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: getScenarioColor(index) }}>
                        {scenario.name || `Scenario ${scenario.id.slice(0, 4)}`}
                      </span>
                      <span className="text-xs font-medium">
                        {scenario.staffing?.specialist || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${maxValues.maxSpecialist > 0 
                            ? ((scenario.staffing?.specialist || 0) / maxValues.maxSpecialist) * 100 
                            : 0}%`,
                          backgroundColor: getScenarioColor(index)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Associate comparison */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Associate Roles</h4>
              
              <div className="space-y-3">
                {scenariosToCompare.map((scenario, index) => (
                  <div key={scenario.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: getScenarioColor(index) }}>
                        {scenario.name || `Scenario ${scenario.id.slice(0, 4)}`}
                      </span>
                      <span className="text-xs font-medium">
                        {scenario.staffing?.associate || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${maxValues.maxAssociate > 0 
                            ? ((scenario.staffing?.associate || 0) / maxValues.maxAssociate) * 100 
                            : 0}%`,
                          backgroundColor: getScenarioColor(index)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Total comparison */}
            <div className="pt-2 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Total Staffing</h4>
              
              <div className="space-y-3">
                {scenariosToCompare.map((scenario, index) => {
                  const total = (scenario.staffing?.leadership || 0) + 
                               (scenario.staffing?.specialist || 0) + 
                               (scenario.staffing?.associate || 0);
                  
                  return (
                    <div key={scenario.id}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs" style={{ color: getScenarioColor(index) }}>
                          {scenario.name || `Scenario ${scenario.id.slice(0, 4)}`}
                        </span>
                        <span className="text-xs font-medium">
                          {total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${maxValues.maxTotal > 0 
                              ? (total / maxValues.maxTotal) * 100 
                              : 0}%`,
                            backgroundColor: getScenarioColor(index)
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
         <p className="text-center text-gray-500">No scenarios to compare.</p>
      )}
    </div>
  );
}
