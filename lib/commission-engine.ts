/**
 * Calculates the split between the Salon and the Worker.
 * Handles both PERCENTAGE and FIXED commission types.
 */
export function calculateCommission(
  servicePrice: number,
  commissionType: 'PERCENTAGE' | 'FIXED',
  commissionRate: number
): { workerCut: number; salonCut: number } {
  let workerCut = 0;

  if (commissionType === 'PERCENTAGE') {
    // commissionRate is a percentage (e.g., 40 means 40%)
    const decimalRate = commissionRate / 100;
    workerCut = Math.round(servicePrice * decimalRate);
  } else if (commissionType === 'FIXED') {
    // commissionRate is a flat amount in the local currency unit
    workerCut = commissionRate;
  }

  // Prevent negative salon cuts if the fixed commission is higher than the service price (unlikely but safe)
  if (workerCut > servicePrice) {
    workerCut = servicePrice;
  }

  const salonCut = servicePrice - workerCut;

  return { workerCut, salonCut };
}
