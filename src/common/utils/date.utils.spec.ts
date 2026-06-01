import { parseDateString } from './date.utils';

describe('parseDateString', () => {
  it('should parse a valid YYYY-MM-DD date', () => {
    const result = parseDateString('2026-06-01');
    expect(result.getUTCFullYear()).toBe(2026);
    expect(result.getUTCMonth()).toBe(5); // June = 5 (0-indexed)
    expect(result.getUTCDate()).toBe(1);
    expect(result.getUTCHours()).toBe(0);
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
  });

  it('should parse December 31st correctly', () => {
    const result = parseDateString('2026-12-31');
    expect(result.getUTCFullYear()).toBe(2026);
    expect(result.getUTCMonth()).toBe(11);
    expect(result.getUTCDate()).toBe(31);
  });

  it('should parse January 1st correctly', () => {
    const result = parseDateString('2026-01-01');
    expect(result.getUTCFullYear()).toBe(2026);
    expect(result.getUTCMonth()).toBe(0);
    expect(result.getUTCDate()).toBe(1);
  });
});