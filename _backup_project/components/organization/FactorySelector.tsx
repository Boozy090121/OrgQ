import React from 'react';
import { Personnel, Factory } from '@\/lib';

interface FactorySelectorProps {
  factories: Factory[];
  activeFactory: string;
  setActiveFactory: (factoryId: string) => void;
}

export default function FactorySelector({
  factories,
  activeFactory,
  setActiveFactory
}: FactorySelectorProps) {
  return (
    <div className="mt-4 flex space-x-2">
      {factories.map(factory => (
        <button
          key={factory.id}
          className={`px-3 py-1.5 text-sm rounded-md ${
            activeFactory === factory.id
              ? 'bg-[#004B87] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveFactory(factory.id)}
        >
          {factory.name}
        </button>
      ))}
    </div>
  );
}
