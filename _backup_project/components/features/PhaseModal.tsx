import React, { useState, useEffect } from 'react';
import { Phase, Activity } from '@/lib';
import { Button } from '@/lib/components/ui/button';
import Modal from '@/lib/components/ui/modal';

interface PhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phase: Omit<Phase, 'id'>) => void;
  phase?: Phase;
  isEdit?: boolean;
  maxOrder: number;
}

export default function PhaseModal({
  isOpen,
  onClose,
  onSave,
  phase,
  isEdit = false,
  maxOrder
}: PhaseModalProps) {
  const [title, setTitle] = useState(phase?.title || '');
  const [timeframe, setTimeframe] = useState(phase?.timeframe || '');
  
  const handleSave = () => {
    if (!title || !timeframe) return;
    
    const newPhase: Omit<Phase, 'id'> = {
      title,
      timeframe,
      activities: phase?.activities || [],
      order: phase?.order || maxOrder + 1
    };
    
    onSave(newPhase);
    resetForm();
  };
  
  const resetForm = () => {
    if (!isEdit) {
      setTitle('');
      setTimeframe('');
    }
  };
  
  const handleClose = () => {
    if (!isEdit) {
      resetForm();
    }
    onClose();
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? 'Edit Implementation Phase' : 'Add New Implementation Phase'}
      footer={
        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={!title || !timeframe}
          >
            {isEdit ? 'Save Changes' : 'Add Phase'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#707070] mb-1">
            Phase Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
            placeholder="e.g., Planning, Implementation, Evaluation"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#707070] mb-1">
            Timeframe
          </label>
          <input
            type="text"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004B87]"
            placeholder="e.g., Q1 2026, 4-6 weeks"
          />
        </div>
      </div>
    </Modal>
  );
}
