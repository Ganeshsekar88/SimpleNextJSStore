import { productSchema, reviewSchema, validateWithZodSchema } from '@/utils/schema';

const validProduct = {
  name: 'Desk Lamp', company: 'Acme', featured: 'true', price: '42',
  description: 'One two three four five six seven eight nine ten',
};

describe('productSchema', () => {
  it('coerces valid form fields into product data', () => {
    expect(validateWithZodSchema(productSchema, validProduct)).toEqual({ ...validProduct, featured: true, price: 42 });
  });

  it('rejects a name that is too short', () => {
    expect(() => validateWithZodSchema(productSchema, { ...validProduct, name: 'x' })).toThrow('name must be at least 2 characters.');
  });

  it('rejects a description outside the required word range', () => {
    expect(() => validateWithZodSchema(productSchema, { ...validProduct, description: 'too short' })).toThrow('description must be between 10 and 1000 words.');
  });
});

describe('reviewSchema', () => {
  const validReview = {
    productId: 'product-1', authorName: 'Ava', authorImageUrl: 'https://example.com/ava.png',
    rating: '5', comment: 'This is a thoughtful and useful product review.',
  };

  it('accepts a review at the rating boundary', () => {
    expect(validateWithZodSchema(reviewSchema, { ...validReview, rating: '1' }).rating).toBe(1);
  });

  it.each(['0', '6'])('rejects an out-of-range rating of %s', (rating) => {
    expect(() => validateWithZodSchema(reviewSchema, { ...validReview, rating })).toThrow(/Rating must be at least 1|Rating must be at most 5/);
  });

  it('rejects a missing product id and a short comment', () => {
    expect(() => validateWithZodSchema(reviewSchema, { ...validReview, productId: '', comment: 'short' })).toThrow('Product ID cannot be empty');
  });
});
