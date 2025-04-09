import React, { useState } from 'react';
import { Scenario, ResourceCalculator as ResourceCalculatorType, Client } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface ResourceCalculatorProps {
  initialData?: ResourceCalculatorType;
  onSave?: (data: ResourceCalculatorType) => void;
  onSaveScenario?: (scenario: Scenario) => void;
  factories?: { id: string; name: string }[];
  clients?: Client[];
  activeFactory?: string;
  setActiveFactory?: (factoryId: string) => void;
  readOnly?: boolean;
  isAdmin?: boolean;
}

export default function ResourceCalculator({
  initialData,
  onSave,
  onSaveScenario,
  factories = [],
  clients = [],
  activeFactory = '1',
  setActiveFactory,
  readOnly = false,
  isAdmin = false
}: ResourceCalculatorProps) {
  const [workOrderVolume, setWorkOrderVolume] = useState(initialData?.workOrderVolume || 0);
  const [complaintVolume, setComplaintVolume] = useState(initialData?.complaintVolume || 0);
  const [complexity, setComplexity] = useState(1);
  const [managerToClientRatio, setManagerToClientRatio] = useState(initialData?.managerToClientRatio || 3);
  const [leadershipCount, setLeadershipCount] = useState(initialData?.staffing?.leadership || 0);
  const [specialistCount, setSpecialistCount] = useState(initialData?.staffing?.specialist || 0);
  const [associateCount, setAssociateCount] = useState(initialData?.staffing?.associate || 0);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  
  // Get factory clients
  const factoryClients = clients.filter(client => 
    client.id.startsWith(activeFactory) || client.id.includes(`factory-${activeFactory}`)
  );
  
  // Calculate recommended staffing based on work order volume, complaint volume, and complexity
  const calculateRecommendedStaffing = () => {
    // These are simplified calculations for demonstration
    // In a real application, these would be more complex formulas
    const complexityFactor = complexity * 0.2 + 0.8; // 1.0 to 1.8 based on complexity 1-5
    
    // Calculate leadership based on client ratio and work order volume
    const clientCount = factoryClients.length || 1;
    const leadershipFromClients = Math.ceil(clientCount / managerToClientRatio);
    const leadershipFromWorkOrders = Math.floor((workOrderVolume / 1000) * complexityFactor);
    const leadership = Math.max(1, Math.max(leadershipFromClients, leadershipFromWorkOrders));
    
    // Calculate specialists based on work orders and complaints
    const specialistsFromWorkOrders = Math.floor((workOrderVolume / 500) * complexityFactor);
    const specialistsFromComplaints = Math.floor((complaintVolume / 100) * complexityFactor);
    const specialist = Math.max(2, specialistsFromWorkOrders + specialistsFromComplaints);
    
    // Calculate associates based on work orders
    const associate = Math.max(3, Math.floor((workOrderVolume / 200) * complexityFactor));
    
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
        factoryId: activeFactory,
        workOrderVolume,
        complaintVolume,
        managerToClientRatio,
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
  
  // Handle save scenario
  const handleSaveScenario = () => {
    if (!scenarioName || !onSaveScenario) return;
    
    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: scenarioName,
      description: scenarioDescription,
      factoryId: activeFactory,
      workOrderVolume,
      complaintVolume,
      complexity,
      managerToClientRatio,
      staffing: {
        leadership: leadershipCount,
        specialist: specialistCount,
        associate: associateCount
      },
      recommended: recommendedStaffing,
      gap: staffingGap,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    onSaveScenario(newScenario);
    setScenarioName('');
    setScenarioDescription('');
    setIsSaveModalOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-[#004B87] mb-4">Resource Calculator</h3>
          
          <div className="space-y-4">
            {/* Factory selector */}
            {factories.length > 0 && setActiveFactory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Factory
                </label>
                <div className="flex flex-wrap gap-2">
                  {factories.map(factory => (
                    <button
                      key={factory.id}
                      onClick={() => setActiveFactory(factory.id)}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        activeFactory === factory.id
                          ? 'bg-[#004B87] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {factory.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Factory clients */}
            {factoryClients.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Factory Clients ({factoryClients.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {factoryClients.map(client => (
                    <div
                      key={client.id}
                      className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700"
                    >
                      {client.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label htmlFor="complaintVolume" className="block text-sm font-medium text-gray-700 mb-1">
                  Complaint Volume
                </label>
                <input
                  type="number"
                  id="complaintVolume"
                  value={complaintVolume}
                  onChange={(e) => setComplaintVolume(parseInt(e.target.value) || 0)}
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87] focus:border-transparent"
                  disabled={readOnly}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-1">
                  Complexity Factor (1-5)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="complexity"
                    min="1"
                    max="5"
                    step="1"
                    value={complexity}
                    onChange={(e) => setComplexity(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={readOnly}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">{complexity}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Simple</span>
                  <span>Average</span>
                  <span>Complex</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="managerToClientRatio" className="block text-sm font-medium text-gray-700 mb-1">
                  Manager to Client Ratio
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="managerToClientRatio"
                    min="1"
                    max="10"
                    step="1"
                    value={managerToClientRatio}
                    onChange={(e) => setManagerToClientRatio(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={readOnly}
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">1:{managerToClientRatio}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>More Managers</span>
                  <span>Balanced</span>
                  <span>Fewer Managers</span>
                </div>
              </div>
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
            
            {!readOnly && isAdmin && (
              <div className="pt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#004B87] rounded-md hover:bg-[#002D56] focus:outline-none focus:ring-2 focus:ring-[#004B87]"
                >
                  Update Calculator
                </button>
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(true)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-[#004B87] bg-white border border-[#004B87] rounded-md hover:bg-[#E6EEF4] focus:outline-none focus:ring-2 focus:ring-[#004B87]"
                >
                  Save as Scenario
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
                  <div className="w-full bg-gray-200 rounded-full 
(Content truncated due to size limit. Use line ranges to read in chunks)