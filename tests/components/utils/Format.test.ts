import { formatCurrency, formatDate } from '@/utils/format';

describe('format helpers', () => {
  it('formats integer amounts as US dollars', () => expect(formatCurrency(99)).toBe('$99.00'));
  it('uses zero when currency input is null', () => expect(formatCurrency(null)).toBe('$0.00'));
  it('formats a date in the storefront locale', () => expect(formatDate(new Date('2024-01-05T12:00:00.000Z'))).toBe('January 5, 2024'));
});
