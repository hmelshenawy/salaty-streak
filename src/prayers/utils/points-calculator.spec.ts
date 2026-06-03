import { PrayerName, PrayerStatus } from '@prisma/client';
import { calculatePrayerPoints } from './points-calculator';

describe('calculatePrayerPoints', () => {
  it('should return 5 points for ON_TIME', () => {
    expect(calculatePrayerPoints('ON_TIME', false, 'DHUHR')).toBe(5);
  });

  it('should return 1 point for LATE', () => {
    expect(calculatePrayerPoints('LATE', false, 'DHUHR')).toBe(1);
  });

  it('should return -10 points for MISSED', () => {
    expect(calculatePrayerPoints('MISSED', false, 'DHUHR')).toBe(-10);
  });

  it('should add +21 for mosque bonus when not missed', () => {
    expect(calculatePrayerPoints('ON_TIME', true, 'DHUHR')).toBe(26); // 5 + 21
    expect(calculatePrayerPoints('LATE', true, 'DHUHR')).toBe(22); // 1 + 21
  });

  it('should NOT add mosque bonus for MISSED', () => {
    expect(calculatePrayerPoints('MISSED', true, 'DHUHR')).toBe(-10);
  });

  it('should add +15 for FAJR ON_TIME bonus', () => {
    expect(calculatePrayerPoints('ON_TIME', false, 'FAJR')).toBe(20); // 5 + 15
  });

  it('should combine FAJR ON_TIME bonus with mosque bonus', () => {
    expect(calculatePrayerPoints('ON_TIME', true, 'FAJR')).toBe(41); // 5 + 15 + 21
  });

  it('should NOT add FAJR bonus for LATE or MISSED', () => {
    expect(calculatePrayerPoints('LATE', false, 'FAJR')).toBe(1);
    expect(calculatePrayerPoints('MISSED', false, 'FAJR')).toBe(-10);
  });

  it('should work for all prayer names other than FAJR without bonus', () => {
    const otherPrayers: PrayerName[] = ['DHUHR', 'ASR', 'MAGHRIB', 'ISHA'];
    for (const prayer of otherPrayers) {
      expect(calculatePrayerPoints('ON_TIME', false, prayer)).toBe(5);
      expect(calculatePrayerPoints('ON_TIME', true, prayer)).toBe(26);
    }
  });

  it('should calculate LATE + mosque correctly', () => {
    expect(calculatePrayerPoints('LATE', true, 'FAJR')).toBe(22); // 1 + 21
  });
});