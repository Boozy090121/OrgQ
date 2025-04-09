import { useMemo } from 'react';

interface StaffingInput {
  leadership: number;
  specialist: number;
  associate: number;
}

interface StaffingOutput extends StaffingInput {
  total: number;
}

/**
 * Calculates recommended staffing and the gap compared to current staffing.
 * 
 * @param workOrderVolume The current or projected work order volume.
 * @param currentStaffing An object with current leadership, specialist, and associate counts.
 * @returns An object containing recommendedStaffing and staffingGap.
 */
export const useStaffingCalculator = (workOrderVolume: number, currentStaffing: StaffingInput) => {

  const recommendedStaffing = useMemo<StaffingOutput>(() => {
    // Simplified calculations (same as originally in ResourceCalculator)
    const leadership = Math.max(1, Math.floor(workOrderVolume / 1000));
    const specialist = Math.max(2, Math.floor(workOrderVolume / 500));
    const associate = Math.max(3, Math.floor(workOrderVolume / 200));
    
    return {
      leadership,
      specialist,
      associate,
      total: leadership + specialist + associate
    };
  }, [workOrderVolume]);

  const staffingGap = useMemo<StaffingOutput>(() => {
    const leadership = recommendedStaffing.leadership - (currentStaffing?.leadership || 0);
    const specialist = recommendedStaffing.specialist - (currentStaffing?.specialist || 0);
    const associate = recommendedStaffing.associate - (currentStaffing?.associate || 0);
    
    return {
        leadership,
        specialist,
        associate,
        total: recommendedStaffing.total - ((currentStaffing?.leadership || 0) + (currentStaffing?.specialist || 0) + (currentStaffing?.associate || 0))
    };
  }, [recommendedStaffing, currentStaffing]);

  return {
    recommendedStaffing,
    staffingGap
  };
}; 