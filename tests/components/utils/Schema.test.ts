import {
  productSchema,
  reviewSchema,
  imageSchema,
  validateWithZodSchema,
} from '@/utils/schema';

const validProduct = {
  name: 'Desk Lamp',
  company: 'Acme',
  featured: 'true',
  price: '42',
  description:
    'One two three four five six seven eight nine ten',
};

describe('validateWithZodSchema', () => {
  it('returns parsed data when validation succeeds', () => {
    const result = validateWithZodSchema(productSchema, validProduct);

    expect(result).toEqual({
      ...validProduct,
      featured: true,
      price: 42,
    });
  });

  it('throws an error containing validation messages when validation fails', () => {
    expect(() =>
      validateWithZodSchema(productSchema, {
        ...validProduct,
        name: 'x',
      })
    ).toThrow('name must be at least 2 characters.');
  });

  it('joins multiple validation errors into one error message', () => {
    expect(() =>
      validateWithZodSchema(productSchema, {
        name: 'x',
        company: 'Acme',
        featured: 'true',
        price: '-1',
        description: 'too short',
      })
    ).toThrow(
      'name must be at least 2 characters., price must be a positive number., description must be between 10 and 1000 words.'
    );
  });
});

describe('productSchema', () => {
  it('accepts valid product data and coerces form values', () => {
    const result = validateWithZodSchema(productSchema, validProduct);

    expect(result).toEqual({
      ...validProduct,
      featured: true,
      price: 42,
    });
  });

  it('accepts a name with exactly 2 characters', () => {
    expect(
      validateWithZodSchema(productSchema, {
        ...validProduct,
        name: 'AB',
      }).name
    ).toBe('AB');
  });

  it('accepts a name with exactly 100 characters', () => {
    const name = 'A'.repeat(100);

    expect(
      validateWithZodSchema(productSchema, {
        ...validProduct,
        name,
      }).name
    ).toBe(name);
  });

  it('rejects a name that is too short', () => {
    expect(() =>
      validateWithZodSchema(productSchema, {
        ...validProduct,
        name: 'x',
      })
    ).toThrow('name must be at least 2 characters.');
  });

  it('rejects a name that is too long', () => {
    expect(() =>
      validateWithZodSchema(productSchema, {
        ...validProduct,
        name: 'A'.repeat(101),
      })
    ).toThrow('name must be less than 100 characters.');
  });

  it('accepts a description with exactly 10 words', () => {
    const description =
      'one two three four five six seven eight nine ten';

    expect(
      validateWithZodSchema(productSchema, {
        ...validProduct,
        description,
      }).description
    ).toBe(description);
  });

  it('accepts a description with exactly 1000 words', () => {
    const description = Array(1000).fill('word').join(' ');

    expect(
      validateWithZodSchema(productSchema, {
        ...validProduct,
        description,
      }).description
    ).toBe(description);
  });

  it('rejects a description with fewer than 10 words', () => {
    expect(() =>
      validateWithZodSchema(productSchema, {
        ...validProduct,
        description: 'one two three four five six seven eight nine',
      })
    ).toThrow(
      'description must be between 10 and 1000 words.'
    );
  });

  it('rejects a description with more than 1000 words', () => {
    const description = Array(1001).fill('word').join(' ');

    expect(() =>
      validateWithZodSchema(productSchema, {
        ...validProduct,
        description,
      })
    ).toThrow(
      'description must be between 10 and 1000 words.'
    );
  });

  it('coerces featured to a boolean', () => {
    expect(
      validateWithZodSchema(productSchema, {
        ...validProduct,
        featured: 'false',
      }).featured
    ).toBe(true);
  });

  it('coerces price to a number', () => {
    expect(
      validateWithZodSchema(productSchema, {
        ...validProduct,
        price: '99',
      }).price
    ).toBe(99);
  });

  it('rejects float as price input', () => {
    expect(() =>
      validateWithZodSchema(productSchema, {
        ...validProduct,
        price: '0.1',
      })
    ).toThrow('Expected integer, received float');
  });

  it('rejects a negative price', () => {
    expect(() =>
      validateWithZodSchema(productSchema, {
        ...validProduct,
        price: '-1',
      })
    ).toThrow('price must be a positive number.');
  });

  it('rejects a zero price', () => {
    expect(() =>
      validateWithZodSchema(productSchema, {
        ...validProduct,
        price: '0',
      })
    ).toThrow('price must be a positive number');
  });
});

describe('imageSchema', () => {
  it('accepts a valid image file under 1 MB', () => {
    const file = new File(['image data'], 'photo.png', {
      type: 'image/png',
    });

    expect(() =>
      validateWithZodSchema(imageSchema, { image: file })
    ).not.toThrow();
  });

  it('accepts an image file exactly at the 1 MB limit', () => {
    const file = new File(
      [new Uint8Array(1024 * 1024)],
      'photo.png',
      {
        type: 'image/png',
      }
    );

    expect(() =>
      validateWithZodSchema(imageSchema, { image: file })
    ).not.toThrow();
  });

  it('rejects a file larger than 1 MB', () => {
    const file = new File(
      [new Uint8Array(1024 * 1024 + 1)],
      'photo.png',
      {
        type: 'image/png',
      }
    );

    expect(() =>
      validateWithZodSchema(imageSchema, { image: file })
    ).toThrow('File size must be less than 1 MB');
  });

  it('rejects a non-image file', () => {
    const file = new File(['text'], 'document.txt', {
      type: 'text/plain',
    });

    expect(() =>
      validateWithZodSchema(imageSchema, { image: file })
    ).toThrow('File must be an image');
  });

  it('accepts different image MIME types', () => {
    const file = new File(['image'], 'photo.webp', {
      type: 'image/webp',
    });

    expect(() =>
      validateWithZodSchema(imageSchema, { image: file })
    ).not.toThrow();
  });

  it('rejects a value that is not a File', () => {
    expect(() =>
      validateWithZodSchema(imageSchema, {
        image: 'not-a-file',
      })
    ).toThrow('Input not instance of File');
  });
});

describe('reviewSchema', () => {
  const validReview = {
    productId: 'product-1',
    authorName: 'Ava',
    authorImageUrl: 'https://example.com/ava.png',
    rating: '5',
    comment: 'This is a thoughtful and useful product review.',
  };

  it('accepts valid review data', () => {
    const result = validateWithZodSchema(reviewSchema, validReview);

    expect(result).toEqual({
      ...validReview,
      rating: 5,
    });
  });

  it('accepts a rating of 1', () => {
    expect(
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        rating: '1',
      }).rating
    ).toBe(1);
  });

  it('accepts a rating of 5', () => {
    expect(
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        rating: '5',
      }).rating
    ).toBe(5);
  });

  it.each(['0', '-1'])(
    'rejects a rating below 1: %s',
    (rating) => {
      expect(() =>
        validateWithZodSchema(reviewSchema, {
          ...validReview,
          rating,
        })
      ).toThrow('Rating must be at least 1');
    }
  );

  it.each(['6', '10'])(
    'rejects a rating above 5: %s',
    (rating) => {
      expect(() =>
        validateWithZodSchema(reviewSchema, {
          ...validReview,
          rating,
        })
      ).toThrow('Rating must be at most 5');
    }
  );

  it('rejects a non-integer rating', () => {
    expect(() =>
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        rating: '4.5',
      })
    ).toThrow('Expected integer, received float');
  });

  it('rejects an empty product id', () => {
    expect(() =>
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        productId: '',
      })
    ).toThrow('Product ID cannot be empty');
  });

  it('rejects an empty author name', () => {
    expect(() =>
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        authorName: '',
      })
    ).toThrow('Author name cannot be empty');
  });

  it('rejects an empty author image URL', () => {
    expect(() =>
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        authorImageUrl: '',
      })
    ).toThrow('Author image URL cannot be empty');
  });

  it('accepts a comment with exactly 10 characters', () => {
    expect(
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        comment: '1234567890',
      }).comment
    ).toBe('1234567890');
  });

  it('accepts a comment with exactly 1000 characters', () => {
    const comment = 'a'.repeat(1000);

    expect(
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        comment,
      }).comment
    ).toBe(comment);
  });

  it('rejects a comment shorter than 10 characters', () => {
    expect(() =>
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        comment: '123456789',
      })
    ).toThrow('Comment must be at least 10 characters long');
  });

  it('rejects a comment longer than 1000 characters', () => {
    expect(() =>
      validateWithZodSchema(reviewSchema, {
        ...validReview,
        comment: 'a'.repeat(1001),
      })
    ).toThrow('Comment must be at most 1000 characters long');
  });
});