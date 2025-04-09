import React from 'react';
import { Scenario } from '@/types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ScenarioExportProps {
  scenario: Scenario;
  format: 'pdf' | 'csv';
}

export default function ScenarioExport({
  scenario,
  format
}: ScenarioExportProps) {
  // Export to PDF
  const exportToPdf = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Scenario: ${scenario.name}`, 14, 22);
    
    // Add description if available
    if (scenario.description) {
      doc.setFontSize(12);
      doc.text(`Description: ${scenario.description}`, 14, 32);
    }
    
    // Add metadata
    doc.setFontSize(12);
    doc.text(`Factory: ${scenario.factoryId}`, 14, 42);
    doc.text(`Work Order Volume: ${scenario.workOrderVolume}`, 14, 48);
    doc.text(`Complexity: ${scenario.complexity || 'N/A'}`, 14, 54);
    doc.text(`Created: ${new Date(scenario.createdAt).toLocaleDateString()}`, 14, 60);
    
    // Add staffing table
    doc.autoTable({
      startY: 70,
      head: [['Role Level', 'Headcount', 'Recommended', 'Gap']],
      body: [
        ['Leadership', scenario.staffing.leadership, scenario.recommended?.leadership || 'N/A', scenario.gap?.leadership || 'N/A'],
        ['Specialist', scenario.staffing.specialist, scenario.recommended?.specialist || 'N/A', scenario.gap?.specialist || 'N/A'],
        ['Associate', scenario.staffing.associate, scenario.recommended?.associate || 'N/A', scenario.gap?.associate || 'N/A'],
        ['Total', 
          scenario.staffing.leadership + scenario.staffing.specialist + scenario.staffing.associate,
          scenario.recommended?.total || 'N/A',
          scenario.gap?.total || 'N/A'
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 75, 135] }
    });
    
    // Add efficiency metrics
    const totalStaff = scenario.staffing.leadership + scenario.staffing.specialist + scenario.staffing.associate;
    const efficiency = totalStaff > 0 ? (scenario.workOrderVolume / totalStaff).toFixed(1) : 'N/A';
    
    doc.text('Efficiency Metrics:', 14, doc.autoTable.previous.finalY + 15);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['Metric', 'Value']],
      body: [
        ['Work Orders per Staff', efficiency],
        ['Leadership Ratio', `${(scenario.staffing.leadership / totalStaff * 100).toFixed(1)}%`],
        ['Specialist Ratio', `${(scenario.staffing.specialist / totalStaff * 100).toFixed(1)}%`],
        ['Associate Ratio', `${(scenario.staffing.associate / totalStaff * 100).toFixed(1)}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 75, 135] }
    });
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text('PCI Quality Organization Dashboard - Scenario Report', 14, doc.internal.pageSize.height - 10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
    
    // Save the PDF
    doc.save(`scenario-${scenario.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };
  
  // Export to CSV
  const exportToCsv = () => {
    // Prepare CSV content
    const totalStaff = scenario.staffing.leadership + scenario.staffing.specialist + scenario.staffing.associate;
    const efficiency = totalStaff > 0 ? (scenario.workOrderVolume / totalStaff).toFixed(1) : 'N/A';
    
    const csvContent = [
      ['Scenario Name', scenario.name],
      ['Description', scenario.description || ''],
      ['Factory', scenario.factoryId],
      ['Work Order Volume', scenario.workOrderVolume],
      ['Complexity', scenario.complexity || ''],
      ['Created Date', new Date(scenario.createdAt).toLocaleDateString()],
      ['Updated Date', new Date(scenario.updatedAt).toLocaleDateString()],
      [''],
      ['Staffing Levels', 'Current', 'Recommended', 'Gap'],
      ['Leadership', scenario.staffing.leadership, scenario.recommended?.leadership || '', scenario.gap?.leadership || ''],
      ['Specialist', scenario.staffing.specialist, scenario.recommended?.specialist || '', scenario.gap?.specialist || ''],
      ['Associate', scenario.staffing.associate, scenario.recommended?.associate || '', scenario.gap?.associate || ''],
      ['Total', totalStaff, scenario.recommended?.total || '', scenario.gap?.total || ''],
      [''],
      ['Efficiency Metrics', 'Value'],
      ['Work Orders per Staff', efficiency],
      ['Leadership Ratio', `${(scenario.staffing.leadership / totalStaff * 100).toFixed(1)}%`],
      ['Specialist Ratio', `${(scenario.staffing.specialist / totalStaff * 100).toFixed(1)}%`],
      ['Associate Ratio', `${(scenario.staffing.associate / totalStaff * 100).toFixed(1)}%`]
    ].map(row => row.join(',')).join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `scenario-${scenario.name.replace(/\s+/g, '-').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Trigger export based on format
  React.useEffect(() => {
    if (format === 'pdf') {
      exportToPdf();
    } else if (format === 'csv') {
      exportToCsv();
    }
  }, [scenario, format]);
  
  return null; // This is a utility component, no UI needed
}
