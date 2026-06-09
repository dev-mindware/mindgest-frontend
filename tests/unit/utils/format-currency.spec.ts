import { formatCurrency, parseCurrency } from '@/utils/format-currency';

describe('formatCurrency utility', () => {
  describe('formatCurrency', () => {
    it('should format number correctly with default suffix', () => {
      expect(formatCurrency(1000)).toBe('1.000,00 Kz');
      expect(formatCurrency(1234.56)).toBe('1.234,56 Kz');
    });

    it('should format number correctly with custom currency code', () => {
      expect(formatCurrency(1000, 'USD')).toBe('1.000,00 USD');
    });

    it('should handle string input', () => {
      expect(formatCurrency('1000')).toBe('1.000,00 Kz');
    });

    it('should return empty string for null, undefined or empty string', () => {
      expect(formatCurrency('')).toBe('');
      expect(formatCurrency(null as any)).toBe('');
      expect(formatCurrency(undefined as any)).toBe('');
    });
  });

  describe('parseCurrency', () => {
    it('should parse formatted string back to number', () => {
      expect(parseCurrency('1.000,00')).toBe(1000);
      expect(parseCurrency('12,34')).toBe(12.34);
    });

    it('should handle empty or invalid strings', () => {
      expect(parseCurrency('')).toBe(0);
      expect(parseCurrency('abc')).toBe(0);
    });
  });
});
