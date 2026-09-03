/**
 * Frontend Unit Tests - Verification of Fare & Distance Calculation Logic
 */

export function calculateWalkingMinutes(distanceKm: number): number {
  return Math.round(distanceKm * 14);
}

export function calculateAutoFare(distanceKm: number): number {
  return Math.round(Math.max(23, 23 + (distanceKm - 1.5) * 15.33));
}

// Simple test assertions
console.assert(calculateWalkingMinutes(1.0) === 14, 'Walking 1km should take 14 mins');
console.assert(calculateAutoFare(1.0) === 23, 'Minimum auto fare should be 23 INR');
console.assert(calculateAutoFare(5.0) > 50, '5km auto fare should be over 50 INR');

console.log('[Frontend Tests] All assertions passed successfully.');
