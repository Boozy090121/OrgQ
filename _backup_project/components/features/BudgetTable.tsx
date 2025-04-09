import React from 'react';
import { Role, Personnel, Factory } from '@\/lib';

interface BudgetTableProps {
  roles: Role[];
  personnel: Personnel[];
  factories: Factory[];
  selectedFactory?: string;
}

export default function BudgetTable({
  roles,
  personnel,
  factories,
  selectedFactory
}: BudgetTableProps) {
  // Filter roles by factory if selected
  const filteredRoles = selectedFactory
    ? roles.filter(role => role.factorySpecific && role.department === selectedFactory)
    : roles;
  
  // Group roles by level
  const rolesByLevel = {
    leadership: filteredRoles.filter(role => role.level === 'leadership'),
    specialist: filteredRoles.filter(role => role.level === 'specialist'),
    associate: filteredRoles.filter(role => role.level === 'associate')
  };
  
  // Calculate budget data
  const calculateBudgetData = () => {
    const result = {
      leadership: {
        roles: rolesByLevel.leadership.length,
        filled: 0,
        minCost: 0,
        maxCost: 0,
        avgCost: 0
      },
      specialist: {
        roles: rolesByLevel.specialist.length,
        filled: 0,
        minCost: 0,
        maxCost: 0,
        avgCost: 0
      },
      associate: {
        roles: rolesByLevel.associate.length,
        filled: 0,
        minCost: 0,
        maxCost: 0,
        avgCost: 0
      },
      total: {
        roles: filteredRoles.length,
        filled: 0,
        minCost: 0,
        maxCost: 0,
        avgCost: 0
      }
    };
    
    // Calculate filled roles and costs
    Object.keys(rolesByLevel).forEach(level => {
      const levelRoles = rolesByLevel[level as keyof typeof rolesByLevel];
      
      levelRoles.forEach(role => {
        // Count filled roles
        const filledCount = personnel.filter(person => 
          person.assignedRole === role.id
        ).length;
        
        result[level as keyof typeof result].filled += filledCount;
        result.total.filled += filledCount;
        
        // Calculate costs
        if (role.salary) {
          result[level as keyof typeof result].minCost += role.salary.min * filledCount;
          result[level as keyof typeof result].maxCost += role.salary.max * filledCount;
          result.total.minCost += role.salary.min * filledCount;
          result.total.maxCost += role.salary.max * filledCount;
        }
      });
      
      // Calculate average costs
      if (result[level as keyof typeof result].filled > 0) {
        result[level as keyof typeof result].avgCost = 
          (result[level as keyof typeof result].minCost + result[level as keyof typeof result].maxCost) / 2;
      }
    });
    
    // Calculate total average cost
    if (result.total.filled > 0) {
      result.total.avgCost = (result.total.minCost + result.total.maxCost) / 2;
    }
    
    return result;
  };
  
  const budgetData = calculateBudgetData();
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role Level
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Roles
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Filled Roles
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Min Cost
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Max Cost
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg Cost
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#004B87] flex items-center justify-center text-white">
                  L
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-[#004B87]">Leadership</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {budgetData.leadership.roles}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{budgetData.leadership.filled}</div>
              <div className="text-xs text-gray-500">
                {budgetData.leadership.roles > 0 
                  ? `${Math.round((budgetData.leadership.filled / budgetData.leadership.roles) * 100)}%` 
                  : '0%'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${budgetData.leadership.minCost.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${budgetData.leadership.maxCost.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
              ${budgetData.leadership.avgCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </td>
          </tr>
          
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#81C341] flex items-center justify-center text-white">
                  S
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-[#81C341]">Specialist</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {budgetData.specialist.roles}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{budgetData.specialist.filled}</div>
              <div className="text-xs text-gray-500">
                {budgetData.specialist.roles > 0 
                  ? `${Math.round((budgetData.specialist.filled / budgetData.specialist.roles) * 100)}%` 
                  : '0%'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${budgetData.specialist.minCost.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${budgetData.specialist.maxCost.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
              ${budgetData.specialist.avgCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </td>
          </tr>
          
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#F47920] flex items-center justify-center text-white">
                  A
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-[#F47920]">Associate</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {budgetData.associate.roles}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{budgetData.associate.filled}</div>
              <div className="text-xs text-gray-500">
                {budgetData.associate.roles > 0 
                  ? `${Math.round((budgetData.associate.filled / budgetData.associate.roles) * 100)}%` 
                  : '0%'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${budgetData.associate.minCost.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              ${budgetData.associate.maxCost.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
              ${budgetData.associate.avgCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </td>
          </tr>
          
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap font-medium">
              Total
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {budgetData.total.roles}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium">{budgetData.total.filled}</div>
              <div className="text-xs text-gray-500">
                {budgetData.total.roles > 0 
                  ? `${Math.round((budgetData.total.filled / budgetData.total.roles) * 100)}%` 
                  : '0%'}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              ${budgetData.total.minCost.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              ${budgetData.total.maxCost.toLocaleString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#004B87]">
              ${budgetData.total.avgCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
