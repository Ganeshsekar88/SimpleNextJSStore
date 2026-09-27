import { links, adminLinks } from '@/utils/link';

describe('links', () => {
  it('should contain all expected navigation links', () => {
    expect(links).toEqual([
      { href: '/', label: 'home' },
      { href: '/about', label: 'about' },
      { href: '/products', label: 'products' },
      { href: '/favorites', label: 'favorites' },
      { href: '/cart', label: 'cart' },
      { href: '/orders', label: 'orders' },
      { href: '/admin/sales', label: 'dashboard' },
      { href: '/reviews', label: 'reviews' },
    ]);
  });

  it('should contain unique href values', () => {
    const hrefs = links.map((link) => link.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('should contain a label and href for every link', () => {
    links.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('label');

      expect(typeof link.href).toBe('string');
      expect(typeof link.label).toBe('string');
    });
  });
});

describe('adminLinks', () => {
  it('should contain all expected admin navigation links', () => {
    expect(adminLinks).toEqual([
      { href: '/admin/sales', label: 'sales' },
      { href: '/admin/products', label: 'my products' },
      { href: '/admin/products/create', label: 'create product' },
    ]);
  });

  it('should contain unique href values', () => {
    const hrefs = adminLinks.map((link) => link.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('should contain a label and href for every admin link', () => {
    adminLinks.forEach((link) => {
      expect(link).toHaveProperty('href');
      expect(link).toHaveProperty('label');

      expect(typeof link.href).toBe('string');
      expect(typeof link.label).toBe('string');
    });
  });
});