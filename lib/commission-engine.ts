/**
 * Calculates the split between the Salon and the Worker.
 * Handles both PERCENTAGE and FIXED commission types.
 *
 * ADMIN/Owner rule: If the performing user is the business owner (ADMIN),
 * no commission split applies. The full service price flows into salonShare.
 * This ensures owner-performed services are never treated as a worker payout liability.
 */
export function calculateCommission(
  servicePrice: number,
  commissionType: 'PERCENTAGE' | 'FIXED' | string,
  commissionRate: number,
  role: 'ADMIN' | 'WORKER' | string = 'WORKER'
): { workerCut: number; salonCut: number } {
  // Owner short-circuit: zero commission, full revenue to salon
  if (role === 'ADMIN') {
    return { workerCut: 0, salonCut: servicePrice };
  }

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
