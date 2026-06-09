import { formatDate, formatDateTime, formatDateTimeRaw } from '@/utils/format-date';

describe('format-date utility', () => {
  const testDate = '2024-05-20T15:30:00Z';

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      // Note: testing with a specific date to avoid timezone issues in CI
      const date = new Date(2024, 4, 20, 15, 30); // May 20, 2024, 15:30
      expect(formatDateTime(date)).toBe('20/05/2024, 15:30');
    });

    it('should return N/A for empty values', () => {
      expect(formatDateTime('')).toBe('N/A');
    });

    it('should return Data inválida for invalid dates', () => {
      expect(formatDateTime('invalid-date')).toBe('Data inválida');
    });
  });

  describe('formatDate', () => {
    it('should format date only correctly', () => {
      const date = new Date(2024, 4, 20);
      expect(formatDate(date)).toBe('20/05/2024');
    });
  });

  describe('formatDateTimeRaw', () => {
    it('should format raw ISO string without conversion', () => {
      expect(formatDateTimeRaw('2024-05-20T15:30:00Z')).toBe('20/05/2024, 15:30');
    });
  });
});
