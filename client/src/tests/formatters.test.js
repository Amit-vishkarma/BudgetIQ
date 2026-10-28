import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCompactCurrency, getUtilizationStatus } from '../utils/formatters';

describe('Financial Formatters Utility', () => {
  it('formats positive numbers as INR currency', () => {
    const formatted = formatCurrency(450000);
    expect(formatted).toContain('₹');
    expect(formatted).toContain('4,50,000');
  });

  it('handles null, undefined, or invalid currency inputs gracefully', () => {
    expect(formatCurrency(null)).toBe('₹0');
    expect(formatCurrency(undefined)).toBe('₹0');
    expect(formatCurrency(NaN)).toBe('₹0');
  });

  it('compacts large amounts in Indian Lakhs and Crores', () => {
    expect(formatCompactCurrency(15000000)).toBe('₹1.50 Cr');
    expect(formatCompactCurrency(450000)).toBe('₹4.50 L');
    expect(formatCompactCurrency(25000)).toBe('₹25.0 K');
  });

  it('calculates correct utilization threshold status and colors', () => {
    expect(getUtilizationStatus(50).level).toBe('healthy');
    expect(getUtilizationStatus(82).level).toBe('warning');
    expect(getUtilizationStatus(93).level).toBe('critical');
    expect(getUtilizationStatus(105).level).toBe('exceeded');
  });
});
