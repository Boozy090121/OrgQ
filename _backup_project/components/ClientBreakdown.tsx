import React, { useState } from 'react';
import { Client } from '@/lib';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface ClientBreakdownProps {
  clients: Client[];
  factoryId: string;
  className?: string;
}

export default function ClientBreakdown({
  clients,
  factoryId,
  className = ''
}: ClientBreakdownProps) {
  const [selectedMetric, setSelectedMetric] = useState<'workOrders' | 'complaints'>('workOrders');
  
  // Filter clients for this factory
  const factoryClients = clients.filter(client => 
    client.id.startsWith(factoryId) || client.id.includes(`factory-${factoryId}`)
  );
  
  // Calculate factory totals
  const factoryTotals = {
    workOrderVolume: factoryClients.reduce((sum, client) => sum + client.workOrderVolume, 0),
    complaintVolume: factoryClients.reduce((sum, client) => sum + client.complaintVolume, 0)
  };
  
  // Sort clients by selected metric
  const sortedClients = [...factoryClients].sort((a, b) => 
    selectedMetric === 'workOrders' 
      ? b.workOrderVolume - a.workOrderVolume 
      : b.complaintVolume - a.complaintVolume
  );
  
  // Calculate percentages for chart
  const calculatePercentage = (client: Client) => {
    if (selectedMetric === 'workOrders') {
      return factoryTotals.workOrderVolume > 0 
        ? (client.workOrderVolume / factoryTotals.workOrderVolume) * 100 
        : 0;
    } else {
      return factoryTotals.complaintVolume > 0 
        ? (client.complaintVolume / factoryTotals.complaintVolume) * 100 
        : 0;
    }
  };
  
  // Generate random color based on client name
  const getClientColor = (clientName: string) => {
    let hash = 0;
    for (let i = 0; i < clientName.length; i++) {
      hash = clientName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[#004B87]">Client Breakdown</h3>
          <p className="text-sm text-gray-600">
            Analyze client distribution for Factory {factoryId}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
              selectedMetric === 'workOrders'
                ? 'bg-[#004B87] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedMetric('workOrders')}
          >
            Work Orders
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
              selectedMetric === 'complaints'
                ? 'bg-[#004B87] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedMetric('complaints')}
          >
            Complaints
          </button>
        </div>
      </div>
      
      {/* Factory summary */}
      <Card className="p-5">
        <h4 className="text-md font-medium text-[#004B87] mb-3">
          {selectedMetric === 'workOrders' ? 'Work Order' : 'Complaint'} Distribution
        </h4>
        
        {factoryClients.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No clients for this factory</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pie chart visualization */}
            <div className="relative h-64 w-64 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {sortedClients.length > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#e5e7eb"
                    strokeWidth="20"
                  />
                )}
                
                {sortedClients.map((client, index) => {
                  const percentage = calculatePercentage(client);
                  const color = getClientColor(client.name);
                  
                  // Calculate stroke dash values
                  const circumference = 2 * Math.PI * 40;
                  const strokeDasharray = circumference;
                  const strokeDashoffset = circumference - (percentage / 100) * circumference;
                  
                  // Calculate rotation for this segment
                  let rotation = 0;
                  for (let i = 0; i < index; i++) {
                    rotation += calculatePercentage(sortedClients[i]);
                  }
                  
                  return (
                    <circle
                      key={client.id}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={color}
                      strokeWidth="20"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      transform={`rotate(${(rotation * 3.6) - 90} 50 50)`}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                  );
                })}
                
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold"
                  fill="#004B87"
                >
                  {selectedMetric === 'workOrders' 
                    ? factoryTotals.workOrderVolume 
                    : factoryTotals.complaintVolume}
                </text>
                <text
                  x="50"
                  y="62"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs"
                  fill="#6b7280"
                >
                  {selectedMetric === 'workOrders' ? 'Work Orders' : 'Complaints'}
                </text>
              </svg>
            </div>
            
            {/* Client breakdown table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {selectedMetric === 'workOrders' ? 'Work Orders' : 'Complaints'}
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Distribution
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedClients.map(client => {
                    const percentage = calculatePercentage(client);
                    const color = getClientColor(client.name);
                    
                    return (
                      <tr key={client.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          {selectedMetric === 'workOrders' ? client.workOrderVolume : client.complaintVolume}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          {percentage.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: color
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
      
      {/* Manager to Client Ratio Analysis */}
      <Card className="p-5">
        <h4 className="text-md font-medium text-[#004B87] mb-3">
          Manager to Client Ratio Analysis
        </h4>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This analysis helps determine the optimal number of managers needed based on client count and complexity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Client Count</div>
              <div className="text-xl font-bold text-[#004B87]">{factoryClients.length}</div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Avg. Complexity</div>
              <div className="text-xl font-bold text-[#004B87]">
                {factoryClients.length > 0 
                  ? (factoryClients.reduce((sum, client) => sum + client.complexity, 0) / factoryClients.length).toFixed(1)
                  : '0.0'
                }
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 mb-1">Recommended Managers</div>
              <div className="text-xl font-bold text-[#004B87]">
                {factoryClients.length > 0 
                  ? Math.ceil(factoryClients.length / 3)
                  : '0'
                }
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Manager Ratio Scenarios</h5>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ratio
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Managers Needed
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recommendation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map(ratio => {
                    const managersNeeded = Math.ceil(factoryClients.length / ratio);
                    const avgComplexity = factoryClients.length > 0 
                      ? factoryClients.reduce((sum, client) => sum + client.complexity, 0) / factoryClients.length
                      : 0;
                    
                    let recommendation = '';
                    if (avgComplexity >= 4 && ratio <= 2) {
                      recommendation = 'Recommended for high complexity clients';
                    } else if (avgComplexity >= 3 && avgComplexity < 4 && ratio === 3) {
                      recommendation = 'Recommended for medium complexity clients';
                    } else if (avgComplexity < 3 && ratio >= 4) {
                      recommendation = 'Recommended for low complexity clients';
                    } else {
                      recommendation = '-';
                    }
                    
                    return (
                      <tr key={ratio}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          1:{ratio}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          {managersNeeded}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {recommendation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
