import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface UnassignedDropZoneProps {
  children?: React.ReactNode;
}

export default function UnassignedDropZone({
  children
}: UnassignedDropZoneProps) {
  // Setup droppable
  const { setNodeRef, isOver } = useDroppable({
    id: 'unassigned',
    data: {
      type: 'unassigned'
    }
  });
  
  return (
    <div
      ref={setNodeRef}
      className={`p-4 ${
        isOver ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'
      } border border-dashed rounded-lg min-h-[100px]`}
    >
      {children || (
        <p className="text-center text-gray-400 text-sm py-2">
          Drop here to unassign personnel
        </p>
      )}
    </div>
  );
}
