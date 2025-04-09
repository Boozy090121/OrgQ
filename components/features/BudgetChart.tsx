import React from 'react';
import { Factory, Budget } from '@/types';

interface BudgetChartProps {
  factories: Factory[];
  budget: Budget | null;
  selectedFactory?: string;
}

export default function BudgetChart({ 
  factories, 
  budget, 
  selectedFactory 
}: BudgetChartProps) {
  // Calculate budget data for visualization
  const getBudgetData = () => {
    if (!budget) return [];
    
    const factoryData = factories.map(factory => {
      // Get factory-specific budget allocation
      const factoryBudget = budget.allocations?.find(
        allocation => allocation.factoryId === factory.id
      );
      
      // Calculate total budget for this factory
      const totalAmount = factoryBudget?.amount || 0;
      
      // Calculate percentage of total budget
      const totalBudget = budget.allocations?.reduce(
        (sum, allocation) => sum + allocation.amount, 0
      ) || 1; // Avoid division by zero
      
      const percentage = (totalAmount / totalBudget) * 100;
      
      return {
        id: factory.id,
        name: factory.name,
        amount: totalAmount,
        percentage,
        color: factory.id === selectedFactory ? '#004B87' : '#81C341',
        isSelected: factory.id === selectedFactory
      };
    });
    
    // Sort by amount (descending)
    return factoryData.sort((a, b) => b.amount - a.amount);
  };
  
  const budgetData = getBudgetData();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#004B87]">Budget Allocation</h3>
      
      {budgetData.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No budget data available
        </div>
      ) : (
        <div className="space-y-3">
          {budgetData.map(item => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className={`text-sm ${item.isSelected ? 'font-medium' : ''}`}>
                    {item.name}
                  </span>
                </div>
                <div className="text-sm font-medium">
                  ${item.amount.toLocaleString()}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }}
                ></div>
              </div>
              
              <div className="text-xs text-right text-gray-500">
                {item.percentage.toFixed(1)}% of total budget
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between text-sm font-medium">
              <span>Total Budget:</span>
              <span className="text-[#004B87]">
                ${budget?.totalAmount?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
