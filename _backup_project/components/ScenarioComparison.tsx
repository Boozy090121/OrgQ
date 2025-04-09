import React, { useState } from 'react';
import { Scenario } from '@/lib';
import { Button } from '@/lib/components/ui/button';
import Modal from '@/lib/components/ui/modal';

interface ScenarioComparisonProps {
  scenarios: Scenario[];
  onDeleteScenario?: (scenarioId: string) => void;
  onExportScenario?: (scenario: Scenario) => void;
  isAdmin?: boolean;
}

export default function ScenarioComparison({
  scenarios,
  onDeleteScenario,
  onExportScenario,
  isAdmin = false
}: ScenarioComparisonProps) {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');
  const [scenarioToExport, setScenarioToExport] = useState<Scenario | null>(null);
  
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
    let maxWorkOrders = 0;
    
    selectedScenarioData.forEach(scenario => {
      const leadership = scenario.staffing?.leadership || 0;
      const specialist = scenario.staffing?.specialist || 0;
      const associate = scenario.staffing?.associate || 0;
      const total = leadership + specialist + associate;
      const workOrders = scenario.workOrderVolume || 0;
      
      maxLeadership = Math.max(maxLeadership, leadership);
      maxSpecialist = Math.max(maxSpecialist, specialist);
      maxAssociate = Math.max(maxAssociate, associate);
      maxTotal = Math.max(maxTotal, total);
      maxWorkOrders = Math.max(maxWorkOrders, workOrders);
    });
    
    return { maxLeadership, maxSpecialist, maxAssociate, maxTotal, maxWorkOrders };
  };
  
  const maxValues = getMaxValues();
  
  // Get color for scenario
  const getScenarioColor = (index: number): string => {
    const colors = ['#004B87', '#81C341', '#F47920'];
    return colors[index % colors.length];
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle export
  const handleExport = () => {
    if (scenarioToExport && onExportScenario) {
      onExportScenario(scenarioToExport);
      setIsExportModalOpen(false);
      setScenarioToExport(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#004B87]">Scenario Comparison</h3>
          
          {selectedScenarioData.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedScenarios([])}
            >
              Clear Selection
            </Button>
          )}
        </div>
        
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
                    <p className="text-xs text-gray-500">
                      Factory: {scenario.factoryId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created: {formatDate(scenario.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="w-4 h-4 rounded-full border border-[#004B87] flex items-center justify-center mb-2">
                      {selectedScenarios.includes(scenario.id) && (
                        <div className="w-2 h-2 rounded-full bg-[#004B87]"></div>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-1 mt-2">
                        <button
                          className="text-xs text-gray-500 hover:text-[#004B87]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setScenarioToExport(scenario);
                            setIsExportModalOpen(true);
                          }}
                        >
                          Export
                        </button>
                        {onDeleteScenario && (
                          <button
                            className="text-xs text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to delete this scenario?')) {
                                onDeleteScenario(scenario.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
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
            {/* Work Order Volume comparison */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Work Order Volume</h4>
              
              <div className="space-y-3">
                {selectedScenarioData.map((scenario, index) => (
                  <div key={`wo-${scenario.id}`}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: getScenarioColor(index) }}>
                        {scenario.name || `Scenario ${scenario.id.slice(0, 4)}`}
                      </span>
                      <span className="text-xs font-medium">
                        {scenario.workOrderVolume}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${maxValues.maxWorkOrders > 0 
                            ? ((scenario.workOrderVolume || 0) / maxValues.maxWorkOrders) * 100 
                            : 0}%`,
                          backgroundColor: getScenarioColor(index)
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Leadership comparison */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Leadership Roles</h4>
              
              <div className="space-y-3">
                {selectedScenarioData.map((scenario, index) => (
                  <div key={`lead-${scenario.id}`}>
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
                  <div key={`spec-${scenario.id}`}>
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
                  <div key={`assoc-${scenario.id}`}>
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
                    <div key={`total-${scenario.id}`}>
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
            
            {/* Efficiency comparison */}
            <div className="pt-2 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Efficiency (Work Orders per Staff)</h4>
              
              <div className="space-y-3">
                {selectedScenarioData.map((scenario, index) => {
                  const totalStaff = (scenario.staffing?.leadership || 0) + 
                                    (scenario.staffing?.specialist || 0) + 
                                    (scenario.staffing?.associate || 0);
                  
                  const efficiency = totalStaff > 0 
                    ? Math.round((scenario.workOrderVolume || 0) / totalStaff * 10) / 10
                    : 0;
                  
                  // Find max efficiency for scaling
                  const maxEfficiency = Math.max(
                    ...selectedScenarioData.map(s => {
                      const staff = (s.staffing?.leadership || 0) + 
                                   (s.staffing?.specialist || 0) + 
                                   (s.staffing?.associate || 0);
                      return staff > 0 ? (s.workOrderVolume || 0) / staff : 0;
                    })
                  );
                  
                  return (
                    <div key={`eff-${scenario.id}`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs" style={{ color: getScenarioColor(index) }}>
                          {scenario.name || `Scenario ${scenario.id.slice(0, 4)}`}
                        </span>
                        <span className="text-xs font-medium">
                          {efficiency}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${maxValues.maxWorkOrders > 0 
                              ? ((efficiency / maxEfficiency) * 100) 
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