import React from 'react';
import { Phase } from '@/types';

interface TimelineVisualizationProps {
  timeline: Phase[];
  isAdmin: boolean;
  onEditPhase?: (phase: Phase) => void;
  onEditActivity?: (phaseId: string, activityId: string) => void;
}

export default function TimelineVisualization({
  timeline,
  isAdmin,
  onEditPhase,
  onEditActivity
}: TimelineVisualizationProps) {
  // Sort phases by order
  const sortedPhases = [...timeline].sort((a, b) => a.order - b.order);
  
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#004B87] md:left-1/2 md:-ml-0.5"></div>
      
      <div className="space-y-8">
        {sortedPhases.map((phase, idx) => (
          <div key={phase.id} className="relative">
            {/* Phase marker */}
            <div className="flex items-center mb-4">
              <div className="absolute left-4 -ml-2 h-4 w-4 rounded-full bg-[#004B87] md:left-1/2 md:-ml-2"></div>
              
              {/* Phase content - alternating sides on larger screens */}
              <div className={`ml-10 md:w-1/2 md:ml-0 ${
                idx % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:ml-auto'
              }`}>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-[#004B87]">{phase.title}</h3>
                      <p className="text-sm text-gray-500">
                        {phase.startDate} - {phase.endDate}
                      </p>
                    </div>
                    
                    {isAdmin && onEditPhase && (
                      <button
                        onClick={() => onEditPhase(phase)}
                        className="p-1 text-gray-400 hover:text-[#004B87] rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-4">{phase.description}</p>
                  
                  {/* Activities */}
                  {phase.activities && phase.activities.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Activities</h4>
                      
                      {phase.activities.map(activity => (
                        <div 
                          key={activity.id} 
                          className="p-3 bg-gray-50 rounded-md border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <h5 className="text-sm font-medium text-[#004B87]">{activity.title}</h5>
                            
                            {isAdmin && onEditActivity && (
                              <button
                                onClick={() => onEditActivity(phase.id, activity.id)}
                                className="p-1 text-gray-400 hover:text-[#004B87] rounded-full hover:bg-gray-100"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
