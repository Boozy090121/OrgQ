import React from 'react';
import { Scenario } from '@/types';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
}

export default function ScenarioComparison({
  scenarios
}: ScenarioComparisonProps) {
  const [selectedScenarios, setSelectedScenarios] = React.useState<string[]>([]);
  
  // Toggle scenario selection
  const toggleScenarioSelection = (scenarioId: string) => {
    if (selectedScenarios.includes(scenarioId)) {
      setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId));
    } else {
      // Limit to 3 selections
      if (selectedScenarios.length < 3) {
        setSelectedScenarios([...selectedScenarios, scenarioId]);
      }
    }
  };
  
  // Get selected scenario data
  const getSelectedScenarioData = () => {
    return scenarios.filter(scenario => selectedScenarios.includes(scenario.id));
  };
  
  const selectedScenarioData = getSelectedScenarioData();
  
  // Calculate max values for scaling
  const getMaxValues = () => {
    let maxLeadership = 0;
    let maxSpecialist = 0;
    let maxAssociate = 0;
    let maxTotal = 0;
    
    selectedScenarioData.forEach(scenario => {
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
    const colors = ['#004B87', '#81C341', '#F47920'];
    return colors[index % colors.length];
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#004B87] mb-4">Scenario Comparison</h3>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Select up to 3 scenarios to compare:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scenarios.map(scenario => (
              <div 
                key={scenario.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedScenarios.includes(scenario.id)
                    ? 'border-[#004B87] bg-[#E6EEF4]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleScenarioSelection(scenario.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-[#004B87]">
                      {scenario.name || `Scenario ${scenario.id.slice(0, 4)}`}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Work Orders: {scenario.workOrderVolume}
                    </p>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-[#004B87] flex items-center justify-center">
                    {selectedScenarios.includes(scenario.id) && (
                      <div className="w-2 h-2 rounded-full bg-[#004B87]"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedScenarioData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#004B87] mb-4">Comparison Results</h3>
          
          <div className="space-y-6">
            {/* Leadership comparison */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Leadership Roles</h4>
              
              <div className="space-y-3">
                {selectedScenarioData.map((scenario, index) => (
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
                {selectedScenarioData.map((scenario, index) => (
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
                {selectedScenarioData.map((scenario, index) => (
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
                {selectedScenarioData.map((scenario, index) => {
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
      )}
    </div>
  );
}
