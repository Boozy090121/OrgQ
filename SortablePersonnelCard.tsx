import React from 'react';
import { Personnel } from '@/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortablePersonnelCardProps {
  personnel: Personnel;
}

export default function SortablePersonnelCard({
  personnel
}: SortablePersonnelCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: JSON.stringify({ type: 'personnel', id: personnel.id })
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 bg-white rounded-md border border-gray-200 hover:border-gray-300 cursor-grab transition-all"
    >
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700">
          {personnel.name.charAt(0)}
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">{personnel.name}</div>
          <div className="text-xs text-gray-500">Unassigned</div>
        </div>
      </div>
    </div>
  );
}
