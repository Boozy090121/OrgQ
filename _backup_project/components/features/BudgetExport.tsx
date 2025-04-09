import React from 'react';
import { useState } from 'react';
import { Role, Personnel, Factory } from '@/lib';
import { Card, CardHeader, CardContent, CardFooter } from '@/lib/components/ui/card';
import { Button } from '@/lib/components/ui/button';
import { Download } from 'lucide-react';

interface BudgetExportProps {
  roles: Role[];
  personnel: Personnel[];
  factories: Factory[];
  selectedFactory: string;
  totalBudget: number;
  budgetByLevel: {
    leadership: number;
    specialist: number;
    associate: number;
  };
}

export default function BudgetExport({ 
  roles, 
  personnel, 
  factories, 
  selectedFactory,
  totalBudget,
  budgetByLevel
}: BudgetExportProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  
  // Get personnel count by role level
  const getPersonnelCountByLevel = (level: 'leadership' | 'specialist' | 'associate') => {
    return personnel.filter(p => {
      if (!p.assignedRole) return false;
      if (selectedFactory !== 'all' && p.assignedFactory !== selectedFactory) return false;
      
      const role = roles.find(r => r.id === p.assignedRole);
      return role && role.level === level;
    }).length;
  };
  
  // Calculate budget for a specific factory
  const calculateFactoryBudget = (factoryId: string) => {
    let total = 0;
    
    personnel.forEach(person => {
      if (person.assignedRole && (factoryId === 'all' || person.assignedFactory === factoryId)) {
        const role = roles.find(r => r.id === person.assignedRole);
        if (role) {
          const midpointSalary = (role.salary.min + role.salary.max) / 2;
          total += midpointSalary;
        }
      }
    });
    
    return total;
  };
  
  // Get personnel count by factory
  const getPersonnelCountByFactory = (factoryId: string) => {
    return personnel.filter(p => 
      factoryId === 'all' || p.assignedFactory === factoryId
    ).length;
  };
  
  // Generate CSV data
  const generateCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add header row
    csvContent += "Category,Description,Personnel Count,Budget Amount\n";
    
    // Add total budget
    csvContent += `Total,${selectedFactory === 'all' ? 'All Factories' : selectedFactory === 'foundation' ? 'Foundation Resources' : factories.find(f => f.id === selectedFactory)?.name},${getPersonnelCountByFactory(selectedFactory)},${totalBudget}\n`;
    
    // Add budget by level
    csvContent += `Level,Leadership,${getPersonnelCountByLevel('leadership')},${budgetByLevel.leadership}\n`;
    csvContent += `Level,Specialist,${getPersonnelCountByLevel('specialist')},${budgetByLevel.specialist}\n`;
    csvContent += `Level,Associate,${getPersonnelCountByLevel('associate')},${budgetByLevel.associate}\n`;
    
    // Add factory breakdown if viewing all factories
    if (selectedFactory === 'all') {
      csvContent += `Factory,Foundation,${getPersonnelCountByFactory('foundation')},${calculateFactoryBudget('foundation')}\n`;
      
      factories.forEach(factory => {
        csvContent += `Factory,${factory.name},${getPersonnelCountByFactory(factory.id)},${calculateFactoryBudget(factory.id)}\n`;
      });
    }
    
    // Add role breakdown
    csvContent += "\nRole Breakdown\n";
    csvContent += "Role,Level,Department,Personnel Count,Total Cost\n";
    
    const filteredRoles = roles.filter(role => {
      if (selectedFactory === 'all') return true;
      if (selectedFactory === 'foundation' && !role.factorySpecific) return true;
      return role.factorySpecific && role.department === selectedFactory;
    });
    
    filteredRoles.forEach(role => {
      const personnelCount = personnel.filter(p => p.assignedRole === role.id).length;
      const totalCost = personnelCount * ((role.salary.min + role.salary.max) / 2);
      
      csvContent += `${role.title},${role.level},${role.factorySpecific ? factories.find(f => f.id === role.department)?.name || role.department : 'Foundation'},${personnelCount},${totalCost}\n`;
    });
    
    return encodeURI(csvContent);
  };
  
  // Handle export
  const handleExport = () => {
    if (exportFormat === 'csv') {
      const csvData = generateCSV();
      const link = document.createElement('a');
      link.setAttribute('href', csvData);
      link.setAttribute('download', `pci_budget_report_${selectedFactory}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // In a real implementation, this would generate a PDF
      alert('PDF export would be implemented here with a library like jsPDF');
    }
  };
  
  return (
    <Card className="mt-6">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#004B87] mb-4">Export Budget Report</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1">
            <p className="text-[#707070] mb-2">
              Export the current budget data for {selectedFactory === 'all' ? 'all factories' : selectedFactory === 'foundation' ? 'foundation resources' : factories.find(f => f.id === selectedFactory)?.name}.
            </p>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-[#004B87]"
                  name="exportFormat"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                />
                <span className="ml-2 text-[#707070]">CSV</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-[#004B87]"
                  name="exportFormat"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={() => setExportFormat('pdf')}
                />
                <span className="ml-2 text-[#707070]">PDF</span>
              </label>
            </div>
          </div>
          
          <Button 
            variant="primary"
            onClick={handleExport}
          >
            <Download size={18} className="mr-2" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </div>
      </div>
    </Card>
  );
}
