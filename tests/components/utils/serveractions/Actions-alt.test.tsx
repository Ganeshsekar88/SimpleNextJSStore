import {
  fetchFeaturedProducts,
  fetchAllProducts,
  fetchSingleProduct,
  createProductAction,
  fetchAdminProducts,
  deleteProductAction,
  fetchAdminProductDetails,
  updateProductAction,
  updateProductImageAction,
  fetchFavoriteId,
  toggleFavoriteAction,
  fetchUserFavorites,
  createReviewAction,
  fetchProductReviews,
  fetchProductReviewsByUser,
  deleteReviewAction,
  findExistingReview,
  fetchProductRating,
  fetchCartItems,
  fetchOrCreateCart,
  updateCart,
  addToCartAction,
  removeCartItemAction,
  updateCartItemAction,
  createOrderAction,
  fetchUserOrders,
  fetchAdminOrders,
} from '@/utils/actions';

import db from '@/utils/db';

import {
  auth,
  currentUser,
} from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from '@/utils/schema';

import {
  deleteImage,
  uploadImage,
} from '@/utils/supabase';

/* ==========================================================================
   MOCKS
   ========================================================================== */

jest.mock('@/utils/db', () => ({
  __esModule: true,

  default: {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },

    favorite: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },

    review: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      delete: jest.fn(),
      groupBy: jest.fn(),
    },

    cart: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },

    cartItem: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },

    order: {
      deleteMany: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('@/utils/schema', () => ({
  imageSchema: {},
  productSchema: {},
  reviewSchema: {},

  validateWithZodSchema: jest.fn(
    (_schema: unknown, data: unknown) => data
  ),
}));

jest.mock('@/utils/supabase', () => ({
  deleteImage: jest.fn(),
  uploadImage: jest.fn(),
}));

/* ==========================================================================
   MOCK TYPES
   ========================================================================== */

/*
 * `db as any` is intentional.
 *
 * Prisma's generated client methods return Prisma promise/client types,
 * which otherwise cause:
 *
 * Property 'mockResolvedValue' does not exist...
 *
 * Casting the mocked Prisma object to `any` gives Jest access to the
 * mockResolvedValue/mockRejectedValue APIs.
 */

const mockedDb = db as any;

const mockedAuth =
  auth as jest.MockedFunction<typeof auth>;

const mockedCurrentUser =
  currentUser as jest.MockedFunction<typeof currentUser>;

const mockedRedirect =
  redirect as jest.MockedFunction<typeof redirect>;

const mockedRevalidatePath =
  revalidatePath as jest.MockedFunction<
    typeof revalidatePath
  >;

const mockedValidate =
  validateWithZodSchema as jest.MockedFunction<
    typeof validateWithZodSchema
  >;

const mockedUploadImage =
  uploadImage as jest.Mock;

const mockedDeleteImage =
  deleteImage as jest.Mock;

/* ==========================================================================
   FIXTURES
   ========================================================================== */

const mockUser = {
  id: 'user-123',

  emailAddresses: [
    {
      emailAddress: 'test@example.com',
    },
  ],
} as any;

const mockAdminUser = {
  id: 'admin-123',

  emailAddresses: [
    {
      emailAddress: 'admin@example.com',
    },
  ],
} as any;

/* ==========================================================================
   HELPERS
   ========================================================================== */

const createFormData = (
  values: Record<string, string | File | Blob>
) => {
  const formData = new FormData();

  Object.entries(values).forEach(
    ([key, value]) => {
      formData.append(key, value);
    }
  );

  return formData;
};

const createProductFormData = () => {
  return createFormData({
    name: 'Test Product',
    company: 'Test Company',
    price: '100',
    description: 'Test description',
    featured: 'true',

    image: new File(
      ['image'],
      'product.jpg',
      {
        type: 'image/jpeg',
      }
    ),
  });
};

const createImageFormData = () => {
  return createFormData({
    id: 'product-1',
    url: 'old-image.jpg',

    image: new File(
      ['image'],
      'new.jpg',
      {
        type: 'image/jpeg',
      }
    ),
  });
};

const createReviewFormData = () => {
  return createFormData({
    productId: 'product-1',
    rating: '5',
    comment: 'Excellent product',
  });
};

const createCartFormData = (
  productId = 'product-1',
  amount = '2'
) => {
  return createFormData({
    productId,
    amount,
  });
};

/* ==========================================================================
   SETUP
   ========================================================================== */

beforeEach(() => {
  jest.clearAllMocks();

  process.env.ADMIN_USER_ID =
    'admin-123';

  mockedCurrentUser.mockResolvedValue(
    mockUser
  );

  mockedAuth.mockReturnValue({
    userId: mockUser.id,
  } as any);

  mockedValidate.mockImplementation(
    (_schema: any, data: any) => data
  );

  mockedUploadImage.mockResolvedValue(
    'https://storage.example.com/product.jpg'
  );

  mockedDeleteImage.mockResolvedValue(
    undefined
  );
});

/* ==========================================================================
   PRODUCT QUERIES
   ========================================================================== */

describe('Product queries', () => {
  it('fetches featured products', async () => {
    const products = [
      {
        id: '1',
        name: 'Product 1',
        featured: true,
      },
      {
        id: '2',
        name: 'Product 2',
        featured: true,
      },
    ];

    mockedDb.product.findMany
      .mockResolvedValue(products);

    const result =
      await fetchFeaturedProducts();

    expect(result).toEqual(products);

    expect(
      mockedDb.product.findMany
    ).toHaveBeenCalledWith({
      where: {
        featured: true,
      },
    });
  });

  it('fetches products using search text', async () => {
    const products = [
      {
        id: '1',
        name: 'Nike Shoes',
      },
    ];

    mockedDb.product.findMany
      .mockResolvedValue(products);

    const result =
      await fetchAllProducts({
        search: 'nike',
      });

    expect(result).toEqual(products);

    expect(
      mockedDb.product.findMany
    ).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            name: {
              contains: 'nike',
              mode: 'insensitive',
            },
          },
          {
            company: {
              contains: 'nike',
              mode: 'insensitive',
            },
          },
        ],
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('uses an empty string when search is omitted', async () => {
    mockedDb.product.findMany
      .mockResolvedValue([]);

    await fetchAllProducts({} as any);

    expect(
      mockedDb.product.findMany
    ).toHaveBeenCalledWith({
      where: {
        OR: [
          {
            name: {
              contains: '',
              mode: 'insensitive',
            },
          },
          {
            company: {
              contains: '',
              mode: 'insensitive',
            },
          },
        ],
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('returns a single product', async () => {
    const product = {
      id: 'product-1',
      name: 'Test Product',
    };

    mockedDb.product.findUnique
      .mockResolvedValue(product);

    const result =
      await fetchSingleProduct(
        'product-1'
      );

    expect(result).toEqual(product);

    expect(
      mockedDb.product.findUnique
    ).toHaveBeenCalledWith({
      where: {
        id: 'product-1',
      },
    });
  });

  it('redirects when product does not exist', async () => {
    mockedDb.product.findUnique
      .mockResolvedValue(null);

    await expect(
      fetchSingleProduct('missing')
    ).rejects.toThrow(
      'NEXT_REDIRECT:/products'
    );

    expect(
      mockedRedirect
    ).toHaveBeenCalledWith(
      '/products'
    );
  });
});

/* ==========================================================================
   CREATE PRODUCT
   ========================================================================== */

describe('createProductAction', () => {
  it('creates a product successfully', async () => {
    const formData =
      createProductFormData();

    mockedDb.product.create
      .mockResolvedValue({
        id: 'product-1',
      });

    const result =
      await createProductAction(
        {},
        formData
      );

    expect(result).toEqual({
      message: 'product created',
    });

    expect(
      mockedValidate
    ).toHaveBeenCalledWith(
      productSchema,
      expect.any(Object)
    );

    expect(
      mockedValidate
    ).toHaveBeenCalledWith(
      imageSchema,
      {
        image: expect.any(File),
      }
    );

    expect(
      mockedUploadImage
    ).toHaveBeenCalled();

    expect(
      mockedDb.product.create
    ).toHaveBeenCalledWith({
      data: expect.objectContaining({
        image:
          'https://storage.example.com/product.jpg',
        clerkId: mockUser.id,
      }),
    });
  });

  it.each([
    [
      'validation',
      () => {
        mockedValidate.mockImplementation(
          () => {
            throw new Error(
              'Product validation failed'
            );
          }
        );
      },
      'Product validation failed',
    ],

    [
      'upload',
      () => {
        mockedUploadImage.mockRejectedValue(
          new Error('Upload failed')
        );
      },
      'Upload failed',
    ],

    [
      'database',
      () => {
        mockedDb.product.create
          .mockRejectedValue(
            new Error(
              'Product creation failed'
            )
          );
      },
      'Product creation failed',
    ],

    [
      'non-Error failure',
      () => {
        mockedUploadImage.mockRejectedValue(
          'something went wrong'
        );
      },
      'An error occurred',
    ],
  ])(
    'handles %s errors',
    async (
      _name,
      setup,
      expectedMessage
    ) => {
      setup();

      const result =
        await createProductAction(
          {},
          createProductFormData()
        );

      expect(result).toEqual({
        message: expectedMessage,
      });
    }
  );

  it('rejects unauthenticated users', async () => {
    mockedCurrentUser
      .mockResolvedValue(null);

    await expect(
      createProductAction(
        {},
        createProductFormData()
      )
    ).rejects.toThrow(
      'You must be logged in to access this route'
    );
  });
});

/* ==========================================================================
   ADMIN PRODUCT ACTIONS
   ========================================================================== */

describe('Admin product actions', () => {
  describe('fetchAdminProducts', () => {
    it('returns products for an admin', async () => {
      mockedCurrentUser
        .mockResolvedValue(
          mockAdminUser
        );

      const products = [
        {
          id: 'product-1',
        },
      ];

      mockedDb.product.findMany
        .mockResolvedValue(products);

      const result =
        await fetchAdminProducts();

      expect(result).toEqual(products);

      expect(
        mockedDb.product.findMany
      ).toHaveBeenCalledWith({
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('redirects non-admin users', async () => {
      mockedCurrentUser
        .mockResolvedValue(mockUser);

      await expect(
        fetchAdminProducts()
      ).rejects.toThrow(
        'NEXT_REDIRECT:/'
      );

      expect(
        mockedRedirect
      ).toHaveBeenCalledWith('/');
    });

    it('rejects unauthenticated users', async () => {
      mockedCurrentUser
        .mockResolvedValue(null);

      await expect(
        fetchAdminProducts()
      ).rejects.toThrow(
        'You must be logged in to access this route'
      );
    });
  });

  describe('deleteProductAction', () => {
    beforeEach(() => {
      mockedCurrentUser
        .mockResolvedValue(
          mockAdminUser
        );
    });

    it('deletes product and image', async () => {
      mockedDb.product.delete
        .mockResolvedValue({
          id: 'product-1',
          image: 'old-image.jpg',
        });

      const result =
        await deleteProductAction({
          productId: 'product-1',
        });

      expect(result).toEqual({
        message: 'product removed',
      });

      expect(
        mockedDb.product.delete
      ).toHaveBeenCalledWith({
        where: {
          id: 'product-1',
        },
      });

      expect(
        mockedDeleteImage
      ).toHaveBeenCalledWith(
        'old-image.jpg'
      );

      expect(
        mockedRevalidatePath
      ).toHaveBeenCalledWith(
        '/admin/products'
      );
    });

    it.each([
      [
        'database',
        () => {
          mockedDb.product.delete
            .mockRejectedValue(
              new Error(
                'Product deletion failed'
              )
            );
        },
        'Product deletion failed',
      ],

      [
        'image deletion',
        () => {
          mockedDb.product.delete
            .mockResolvedValue({
              id: 'product-1',
              image: 'old-image.jpg',
            });

          mockedDeleteImage
            .mockRejectedValue(
              new Error(
                'Image deletion failed'
              )
            );
        },
        'Image deletion failed',
      ],

      [
        'non-Error',
        () => {
          mockedDb.product.delete
            .mockRejectedValue(
              'something went wrong'
            );
        },
        'An error occurred',
      ],
    ])(
      'handles %s errors',
      async (
        _name,
        setup,
        expectedMessage
      ) => {
        setup();

        const result =
          await deleteProductAction({
            productId: 'product-1',
          });

        expect(result).toEqual({
          message: expectedMessage,
        });
      }
    );
  });

  describe('fetchAdminProductDetails', () => {
    beforeEach(() => {
      mockedCurrentUser
        .mockResolvedValue(
          mockAdminUser
        );
    });

    it('returns the requested product', async () => {
      const product = {
        id: 'product-1',
        name: 'Test Product',
      };

      mockedDb.product.findUnique
        .mockResolvedValue(product);

      const result =
        await fetchAdminProductDetails(
          'product-1'
        );

      expect(result).toEqual(product);
    });

    it('redirects when product does not exist', async () => {
      mockedDb.product.findUnique
        .mockResolvedValue(null);

      await expect(
        fetchAdminProductDetails(
          'missing'
        )
      ).rejects.toThrow(
        'NEXT_REDIRECT:/admin/products'
      );

      expect(
        mockedRedirect
      ).toHaveBeenCalledWith(
        '/admin/products'
      );
    });
  });

  describe('updateProductAction', () => {
    beforeEach(() => {
      mockedCurrentUser
        .mockResolvedValue(
          mockAdminUser
        );
    });

    it('updates a product', async () => {
      const formData =
        createFormData({
          id: 'product-1',
          name: 'Updated Product',
          company: 'Updated Company',
          price: '200',
          description: 'Updated description',
          featured: 'false',
        });

      mockedDb.product.update
        .mockResolvedValue({
          id: 'product-1',
        });

      const result =
        await updateProductAction(
          {},
          formData
        );

      expect(result).toEqual({
        message:
          'Product updated successfully',
      });

      expect(
        mockedDb.product.update
      ).toHaveBeenCalledWith({
        where: {
          id: 'product-1',
        },

        data: expect.any(Object),
      });

      expect(
        mockedRevalidatePath
      ).toHaveBeenCalledWith(
        '/admin/products/product-1/edit'
      );
    });

    it.each([
      [
        'validation',
        () => {
          mockedValidate.mockImplementation(
            () => {
              throw new Error(
                'Product validation failed'
              );
            }
          );
        },
        'Product validation failed',
      ],

      [
        'database',
        () => {
          mockedDb.product.update
            .mockRejectedValue(
              new Error(
                'Product update failed'
              )
            );
        },
        'Product update failed',
      ],
    ])(
      'handles %s errors',
      async (
        _name,
        setup,
        expectedMessage
      ) => {
        setup();

        const result =
          await updateProductAction(
            {},
            createFormData({
              id: 'product-1',
              name: 'Updated',
            })
          );

        expect(result).toEqual({
          message: expectedMessage,
        });
      }
    );
  });

  describe('updateProductImageAction', () => {
    it('updates the product image', async () => {
      const formData =
        createImageFormData();

      mockedUploadImage
        .mockResolvedValue(
          'new-image.jpg'
        );

      mockedDb.product.update
        .mockResolvedValue({
          id: 'product-1',
        });

      const result =
        await updateProductImageAction(
          {},
          formData
        );

      expect(result).toEqual({
        message:
          'Product Image updated successfully',
      });

      expect(
        mockedUploadImage
      ).toHaveBeenCalled();

      expect(
        mockedDeleteImage
      ).toHaveBeenCalledWith(
        'old-image.jpg'
      );

      expect(
        mockedDb.product.update
      ).toHaveBeenCalledWith({
        where: {
          id: 'product-1',
        },

        data: {
          image: 'new-image.jpg',
        },
      });

      expect(
        mockedRevalidatePath
      ).toHaveBeenCalledWith(
        '/admin/products/product-1/edit'
      );
    });

    it.each([
      [
        'validation',
        () => {
          mockedValidate.mockImplementation(
            () => {
              throw new Error(
                'Invalid image'
              );
            }
          );
        },
        'Invalid image',
      ],

      [
        'upload',
        () => {
          mockedUploadImage
            .mockRejectedValue(
              new Error(
                'Upload failed'
              )
            );
        },
        'Upload failed',
      ],

      [
        'delete',
        () => {
          mockedDeleteImage
            .mockRejectedValue(
              new Error(
                'Old image deletion failed'
              )
            );
        },
        'Old image deletion failed',
      ],

      [
        'database',
        () => {
          mockedDb.product.update
            .mockRejectedValue(
              new Error(
                'Image product update failed'
              )
            );
        },
        'Image product update failed',
      ],
    ])(
      'handles %s errors',
      async (
        _name,
        setup,
        expectedMessage
      ) => {
        setup();

        const result =
          await updateProductImageAction(
            {},
            createImageFormData()
          );

        expect(result).toEqual({
          message: expectedMessage,
        });
      }
    );
  });
});

/* ==========================================================================
   FAVORITES
   ========================================================================== */

describe('Favorites', () => {
  it('returns favorite id', async () => {
    mockedDb.favorite.findFirst
      .mockResolvedValue({
        id: 'favorite-1',
      });

    const result =
      await fetchFavoriteId({
        productId: 'product-1',
      });

    expect(result).toBe(
      'favorite-1'
    );

    expect(
      mockedDb.favorite.findFirst
    ).toHaveBeenCalledWith({
      where: {
        productId: 'product-1',
        clerkId: mockUser.id,
      },

      select: {
        id: true,
      },
    });
  });

  it('returns null when favorite does not exist', async () => {
    mockedDb.favorite.findFirst
      .mockResolvedValue(null);

    const result =
      await fetchFavoriteId({
        productId: 'product-1',
      });

    expect(result).toBeNull();
  });

  it('removes an existing favorite', async () => {
    const result =
      await toggleFavoriteAction({
        productId: 'product-1',
        favoriteId: 'favorite-1',
        pathname: '/products',
      });

    expect(result).toEqual({
      message: 'Removed from Faves',
    });

    expect(
      mockedDb.favorite.delete
    ).toHaveBeenCalledWith({
      where: {
        id: 'favorite-1',
      },
    });

    expect(
      mockedRevalidatePath
    ).toHaveBeenCalledWith(
      '/products'
    );
  });

  it('creates a favorite when none exists', async () => {
    const result =
      await toggleFavoriteAction({
        productId: 'product-1',
        favoriteId: null,
        pathname: '/products',
      });

    expect(result).toEqual({
      message: 'Added to Faves',
    });

    expect(
      mockedDb.favorite.create
    ).toHaveBeenCalledWith({
      data: {
        productId: 'product-1',
        clerkId: mockUser.id,
      },
    });
  });

  it.each([
    [
      'delete',
      () => {
        mockedDb.favorite.delete
          .mockRejectedValue(
            new Error(
              'Favorite deletion failed'
            )
          );
      },
      {
        productId: 'product-1',
        favoriteId: 'favorite-1',
        pathname: '/products',
      },
      'Favorite deletion failed',
    ],

    [
      'create',
      () => {
        mockedDb.favorite.create
          .mockRejectedValue(
            new Error(
              'Favorite creation failed'
            )
          );
      },
      {
        productId: 'product-1',
        favoriteId: null,
        pathname: '/products',
      },
      'Favorite creation failed',
    ],
  ])(
    'handles favorite %s errors',
    async (
      _name,
      setup,
      input,
      expectedMessage
    ) => {
      setup();

      const result =
        await toggleFavoriteAction(
          input as any
        );

      expect(result).toEqual({
        message: expectedMessage,
      });
    }
  );

  it('fetches user favorites', async () => {
    const favorites = [
      {
        id: 'favorite-1',
        product: {
          id: 'product-1',
        },
      },
    ];

    mockedDb.favorite.findMany
      .mockResolvedValue(favorites);

    const result =
      await fetchUserFavorites();

    expect(result).toEqual(
      favorites
    );

    expect(
      mockedDb.favorite.findMany
    ).toHaveBeenCalledWith({
      where: {
        clerkId: mockUser.id,
      },

      include: {
        product: true,
      },
    });
  });

  it('rejects unauthenticated favorite access', async () => {
    mockedCurrentUser
      .mockResolvedValue(null);

    await expect(
      fetchUserFavorites()
    ).rejects.toThrow(
      'You must be logged in to access this route'
    );
  });
});

/* ==========================================================================
   REVIEWS
   ========================================================================== */

describe('Reviews', () => {
  it('creates a review', async () => {
    mockedDb.review.create
      .mockResolvedValue({
        id: 'review-1',
      });

    const result =
      await createReviewAction(
        {},
        createReviewFormData()
      );

    expect(result).toEqual({
      message:
        'Review submitted successfully',
    });

    expect(
      mockedDb.review.create
    ).toHaveBeenCalledWith({
      data: expect.objectContaining({
        clerkId: mockUser.id,
      }),
    });

    expect(
      mockedRevalidatePath
    ).toHaveBeenCalledWith(
      '/products/product-1'
    );
  });

  it('handles validation errors', async () => {
    mockedValidate.mockImplementation(
      () => {
        throw new Error(
          'Invalid review'
        );
      }
    );

    const result =
      await createReviewAction(
        {},
        createReviewFormData()
      );

    expect(result).toEqual({
      message: 'Invalid review',
    });

    expect(
      mockedDb.review.create
    ).not.toHaveBeenCalled();
  });

  it.each([
    [
      'database',
      new Error(
        'Review creation failed'
      ),
      'Review creation failed',
    ],

    [
      'non-Error',
      'review failed',
      'An error occurred',
    ],
  ])(
    'handles %s review creation failures',
    async (
      _name,
      failure,
      expectedMessage
    ) => {
      mockedDb.review.create
        .mockRejectedValue(
          failure
        );

      const result =
        await createReviewAction(
          {},
          createReviewFormData()
        );

      expect(result).toEqual({
        message: expectedMessage,
      });
    }
  );

  it('fetches product reviews', async () => {
    const reviews = [
      {
        id: 'review-1',
        productId: 'product-1',
      },
    ];

    mockedDb.review.findMany
      .mockResolvedValue(reviews);

    const result =
      await fetchProductReviews(
        'product-1'
      );

    expect(result).toEqual(
      reviews
    );

    expect(
      mockedDb.review.findMany
    ).toHaveBeenCalledWith({
      where: {
        productId: 'product-1',
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('fetches current user reviews', async () => {
    const reviews = [
      {
        id: 'review-1',
        rating: 5,
        comment: 'Great',
        product: {
          image: 'image.jpg',
          name: 'Product',
        },
      },
    ];

    mockedDb.review.findMany
      .mockResolvedValue(reviews);

    const result =
      await fetchProductReviewsByUser();

    expect(result).toEqual(
      reviews
    );

    expect(
      mockedDb.review.findMany
    ).toHaveBeenCalledWith({
      where: {
        clerkId: mockUser.id,
      },

      select: {
        id: true,
        rating: true,
        comment: true,

        product: {
          select: {
            image: true,
            name: true,
          },
        },
      },
    });
  });

  it('deletes a review', async () => {
    const result =
      await deleteReviewAction({
        reviewId: 'review-1',
      });

    expect(result).toEqual({
      message:
        'Review deleted successfully',
    });

    expect(
      mockedDb.review.delete
    ).toHaveBeenCalledWith({
      where: {
        id: 'review-1',
        clerkId: mockUser.id,
      },
    });

    expect(
      mockedRevalidatePath
    ).toHaveBeenCalledWith(
      '/reviews'
    );
  });

  it('handles review deletion errors', async () => {
    mockedDb.review.delete
      .mockRejectedValue(
        new Error(
          'Review deletion failed'
        )
      );

    const result =
      await deleteReviewAction({
        reviewId: 'review-1',
      });

    expect(result).toEqual({
      message:
        'Review deletion failed',
    });
  });

  it('finds an existing review', async () => {
    const review = {
      id: 'review-1',
    };

    mockedDb.review.findFirst
      .mockResolvedValue(review);

    const result =
      await findExistingReview(
        'user-123',
        'product-1'
      );

    expect(result).toEqual(
      review
    );

    expect(
      mockedDb.review.findFirst
    ).toHaveBeenCalledWith({
      where: {
        clerkId: 'user-123',
        productId: 'product-1',
      },
    });
  });

  it('calculates product rating', async () => {
    mockedDb.review.groupBy
      .mockResolvedValue([
        {
          productId: 'product-1',

          _avg: {
            rating: 4.5,
          },

          _count: {
            rating: 10,
          },
        },
      ]);

    const result =
      await fetchProductRating(
        'product-1'
      );

    expect(result).toEqual({
      rating: '4.5',
      count: 10,
    });
  });

  it('returns zero rating when there are no reviews', async () => {
    mockedDb.review.groupBy
      .mockResolvedValue([]);

    const result =
      await fetchProductRating(
        'product-1'
      );

    expect(result).toEqual({
      rating: 0,
      count: 0,
    });
  });
});

/* ==========================================================================
   CART
   ========================================================================== */

describe('Cart', () => {
  describe('fetchCartItems', () => {
    it('returns cart item count', async () => {
      mockedAuth.mockReturnValue({
        userId: 'user-123',
      } as any);

      mockedDb.cart.findFirst
        .mockResolvedValue({
          numItemsInCart: 4,
        });

      const result =
        await fetchCartItems();

      expect(result).toBe(4);

      expect(
        mockedDb.cart.findFirst
      ).toHaveBeenCalledWith({
        where: {
          clerkId: 'user-123',
        },

        select: {
          numItemsInCart: true,
        },
      });
    });

    it('returns zero when cart does not exist', async () => {
      mockedDb.cart.findFirst
        .mockResolvedValue(null);

      const result =
        await fetchCartItems();

      expect(result).toBe(0);
    });

    it('uses empty clerk id when auth has no user id', async () => {
      mockedAuth.mockReturnValue({
        userId: null,
      } as any);

      mockedDb.cart.findFirst
        .mockResolvedValue(null);

      const result =
        await fetchCartItems();

      expect(result).toBe(0);

      expect(
        mockedDb.cart.findFirst
      ).toHaveBeenCalledWith({
        where: {
          clerkId: '',
        },

        select: {
          numItemsInCart: true,
        },
      });
    });
  });

  describe('fetchOrCreateCart', () => {
    it('returns an existing cart', async () => {
      const cart = {
        id: 'cart-1',
        clerkId: 'user-123',
      };

      mockedDb.cart.findFirst
        .mockResolvedValue(cart);

      const result =
        await fetchOrCreateCart({
          userId: 'user-123',
        });

      expect(result).toEqual(cart);

      expect(
        mockedDb.cart.create
      ).not.toHaveBeenCalled();
    });

    it('creates a cart when one does not exist', async () => {
      const newCart = {
        id: 'cart-1',
        clerkId: 'user-123',
      };

      mockedDb.cart.findFirst
        .mockResolvedValue(null);

      mockedDb.cart.create
        .mockResolvedValue(newCart);

      const result =
        await fetchOrCreateCart({
          userId: 'user-123',
        });

      expect(result).toEqual(
        newCart
      );

      expect(
        mockedDb.cart.create
      ).toHaveBeenCalledWith({
        data: {
          clerkId: 'user-123',
        },

        include:
          expect.any(Object),
      });
    });

    it('throws Cart not found when errorOnFailure is true', async () => {
      mockedDb.cart.findFirst
        .mockResolvedValue(null);

      await expect(
        fetchOrCreateCart({
          userId: 'user-123',
          errorOnFailure: true,
        })
      ).rejects.toThrow(
        'Cart not found'
      );

      expect(
        mockedDb.cart.create
      ).not.toHaveBeenCalled();
    });

    it('propagates cart creation errors', async () => {
      mockedDb.cart.findFirst
        .mockResolvedValue(null);

      mockedDb.cart.create
        .mockRejectedValue(
          new Error(
            'Cart creation failed'
          )
        );

      await expect(
        fetchOrCreateCart({
          userId: 'user-123',
        })
      ).rejects.toThrow(
        'Cart creation failed'
      );
    });
  });

  describe('updateCart', () => {
    it('calculates totals for populated cart', async () => {
      const cart = {
        id: 'cart-1',
        taxRate: 0.1,
        shipping: 20,
      };

      mockedDb.cartItem.findMany
        .mockResolvedValue([
          {
            amount: 2,
            product: {
              price: 100,
            },
          },

          {
            amount: 1,
            product: {
              price: 50,
            },
          },
        ]);

      const updatedCart = {
        id: 'cart-1',
        numItemsInCart: 3,
        cartTotal: 250,
        tax: 25,
        orderTotal: 295,
      };

      mockedDb.cart.update
        .mockResolvedValue(
          updatedCart
        );

      const result =
        await updateCart(
          cart as any
        );

      expect(
        result.currentCart
      ).toEqual(
        updatedCart
      );

      expect(
        result.cartItems
      ).toHaveLength(2);

      expect(
        mockedDb.cart.update
      ).toHaveBeenCalledWith({
        where: {
          id: 'cart-1',
        },

        data: {
          numItemsInCart: 3,
          cartTotal: 250,
          tax: 25,
          orderTotal: 295,
        },

        include:
          expect.any(Object),
      });
    });

    it('does not add shipping to an empty cart', async () => {
      const cart = {
        id: 'cart-1',
        taxRate: 0.1,
        shipping: 20,
      };

      mockedDb.cartItem.findMany
        .mockResolvedValue([]);

      mockedDb.cart.update
        .mockResolvedValue({
          id: 'cart-1',
        });

      await updateCart(
        cart as any
      );

      expect(
        mockedDb.cart.update
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            numItemsInCart: 0,
            cartTotal: 0,
            tax: 0,
            orderTotal: 0,
          },
        })
      );
    });

    it('propagates cart update errors', async () => {
      mockedDb.cartItem.findMany
        .mockResolvedValue([]);

      mockedDb.cart.update
        .mockRejectedValue(
          new Error(
            'Cart update failed'
          )
        );

      await expect(
        updateCart({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        } as any)
      ).rejects.toThrow(
        'Cart update failed'
      );
    });
  });

  describe('addToCartAction', () => {
    const setupCart = () => {
      mockedDb.product.findUnique
        .mockResolvedValue({
          id: 'product-1',
          price: 100,
        });

      mockedDb.cart.findFirst
        .mockResolvedValue({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        });

      mockedDb.cartItem.findMany
        .mockResolvedValue([]);

      mockedDb.cart.update
        .mockResolvedValue({
          id: 'cart-1',
        });
    };

    it('creates a new cart item and redirects', async () => {
      setupCart();

      mockedDb.cartItem.findFirst
        .mockResolvedValue(null);

      mockedDb.cartItem.create
        .mockResolvedValue({
          id: 'item-1',
        });

      await expect(
        addToCartAction(
          {},
          createCartFormData()
        )
      ).rejects.toThrow(
        'NEXT_REDIRECT:/cart'
      );

      expect(
        mockedDb.cartItem.create
      ).toHaveBeenCalledWith({
        data: {
          amount: 2,
          productId: 'product-1',
          cartId: 'cart-1',
        },
      });

      expect(
        mockedRedirect
      ).toHaveBeenCalledWith(
        '/cart'
      );
    });

    it('updates an existing cart item', async () => {
      setupCart();

      mockedDb.cartItem.findFirst
        .mockResolvedValue({
          id: 'item-1',
          amount: 3,
        });

      mockedDb.cartItem.update
        .mockResolvedValue({
          id: 'item-1',
          amount: 5,
        });

      await expect(
        addToCartAction(
          {},
          createCartFormData()
        )
      ).rejects.toThrow(
        'NEXT_REDIRECT:/cart'
      );

      expect(
        mockedDb.cartItem.update
      ).toHaveBeenCalledWith({
        where: {
          id: 'item-1',
        },

        data: {
          amount: 5,
        },
      });

      expect(
        mockedDb.cartItem.create
      ).not.toHaveBeenCalled();
    });

    it.each([
      [
        'product lookup',
        () => {
          mockedDb.product.findUnique
            .mockRejectedValue(
              new Error(
                'Product lookup failed'
              )
            );
        },
        'Product lookup failed',
      ],

      [
        'cart creation',
        () => {
          mockedDb.product.findUnique
            .mockResolvedValue({
              id: 'product-1',
            });

          mockedDb.cart.findFirst
            .mockResolvedValue(null);

          mockedDb.cart.create
            .mockRejectedValue(
              new Error(
                'Cart creation failed'
              )
            );
        },
        'Cart creation failed',
      ],

      [
        'cart item lookup',
        () => {
          mockedDb.product.findUnique
            .mockResolvedValue({
              id: 'product-1',
            });

          mockedDb.cart.findFirst
            .mockResolvedValue({
              id: 'cart-1',
            });

          mockedDb.cartItem.findFirst
            .mockRejectedValue(
              new Error(
                'Cart item lookup failed'
              )
            );
        },
        'Cart item lookup failed',
      ],

      [
        'cart item creation',
        () => {
          setupCart();

          mockedDb.cartItem.findFirst
            .mockResolvedValue(null);

          mockedDb.cartItem.create
            .mockRejectedValue(
              new Error(
                'Cart item creation failed'
              )
            );
        },
        'Cart item creation failed',
      ],

      [
        'cart item update',
        () => {
          setupCart();

          mockedDb.cartItem.findFirst
            .mockResolvedValue({
              id: 'item-1',
              amount: 2,
            });

          mockedDb.cartItem.update
            .mockRejectedValue(
              new Error(
                'Cart item update failed'
              )
            );
        },
        'Cart item update failed',
      ],

      [
        'cart recalculation',
        () => {
          setupCart();

          mockedDb.cartItem.findFirst
            .mockResolvedValue(null);

          mockedDb.cartItem.create
            .mockResolvedValue({
              id: 'item-1',
            });

          mockedDb.cart.update
            .mockRejectedValue(
              new Error(
                'Cart total update failed'
              )
            );
        },
        'Cart total update failed',
      ],
    ])(
      'handles %s errors',
      async (
        _name,
        setup,
        expectedMessage
      ) => {
        setup();

        const result =
          await addToCartAction(
            {},
            createCartFormData()
          );

        expect(result).toEqual({
          message: expectedMessage,
        });

        expect(
          mockedRedirect
        ).not.toHaveBeenCalled();
      }
    );

    it('handles missing product', async () => {
      mockedDb.product.findUnique
        .mockResolvedValue(null);

      const result =
        await addToCartAction(
          {},
          createCartFormData(
            'missing',
            '1'
          )
        );

      expect(result).toEqual({
        message: 'Product not found',
      });
    });
  });

  describe('removeCartItemAction', () => {
    it('removes item and recalculates cart', async () => {
      const cart = {
        id: 'cart-1',
        taxRate: 0.1,
        shipping: 10,
      };

      mockedDb.cart.findFirst
        .mockResolvedValue(cart);

      mockedDb.cartItem.delete
        .mockResolvedValue({
          id: 'item-1',
        });

      mockedDb.cartItem.findMany
        .mockResolvedValue([]);

      mockedDb.cart.update
        .mockResolvedValue(cart);

      const result =
        await removeCartItemAction(
          {},
          createFormData({
            id: 'item-1',
          })
        );

      expect(result).toEqual({
        message:
          'Item removed from cart',
      });

      expect(
        mockedDb.cartItem.delete
      ).toHaveBeenCalledWith({
        where: {
          id: 'item-1',
          cartId: 'cart-1',
        },
      });

      expect(
        mockedRevalidatePath
      ).toHaveBeenCalledWith(
        '/cart'
      );
    });

    it.each([
      [
        'missing cart',
        () => {
          mockedDb.cart.findFirst
            .mockResolvedValue(null);
        },
        'Cart not found',
      ],

      [
        'delete',
        () => {
          mockedDb.cart.findFirst
            .mockResolvedValue({
              id: 'cart-1',
            });

          mockedDb.cartItem.delete
            .mockRejectedValue(
              new Error(
                'Cart item deletion failed'
              )
            );
        },
        'Cart item deletion failed',
      ],

      [
        'recalculation',
        () => {
          mockedDb.cart.findFirst
            .mockResolvedValue({
              id: 'cart-1',
            });

          mockedDb.cartItem.delete
            .mockResolvedValue({
              id: 'item-1',
            });

          mockedDb.cartItem.findMany
            .mockRejectedValue(
              new Error(
                'Cart recalculation failed'
              )
            );
        },
        'Cart recalculation failed',
      ],
    ])(
      'handles %s errors',
      async (
        _name,
        setup,
        expectedMessage
      ) => {
        setup();

        const result =
          await removeCartItemAction(
            {},
            createFormData({
              id: 'item-1',
            })
          );

        expect(result).toEqual({
          message: expectedMessage,
        });
      }
    );
  });

  describe('updateCartItemAction', () => {
    it('updates cart item quantity', async () => {
      mockedDb.cart.findFirst
        .mockResolvedValue({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        });

      mockedDb.cartItem.update
        .mockResolvedValue({
          id: 'item-1',
          amount: 4,
        });

      mockedDb.cartItem.findMany
        .mockResolvedValue([]);

      mockedDb.cart.update
        .mockResolvedValue({
          id: 'cart-1',
        });

      const result =
        await updateCartItemAction({
          amount: 4,
          cartItemId: 'item-1',
        });

      expect(result).toEqual({
        message: 'cart updated',
      });

      expect(
        mockedDb.cartItem.update
      ).toHaveBeenCalledWith({
        where: {
          id: 'item-1',
          cartId: 'cart-1',
        },

        data: {
          amount: 4,
        },
      });

      expect(
        mockedRevalidatePath
      ).toHaveBeenCalledWith(
        '/cart'
      );
    });

    it.each([
      [
        'missing cart',
        () => {
          mockedDb.cart.findFirst
            .mockResolvedValue(null);
        },
        'Cart not found',
      ],

      [
        'item update',
        () => {
          mockedDb.cart.findFirst
            .mockResolvedValue({
              id: 'cart-1',
            });

          mockedDb.cartItem.update
            .mockRejectedValue(
              new Error(
                'Cart item update failed'
              )
            );
        },
        'Cart item update failed',
      ],

      [
        'recalculation',
        () => {
          mockedDb.cart.findFirst
            .mockResolvedValue({
              id: 'cart-1',
            });

          mockedDb.cartItem.update
            .mockResolvedValue({
              id: 'item-1',
              amount: 3,
            });

          mockedDb.cartItem.findMany
            .mockRejectedValue(
              new Error(
                'Cart recalculation failed'
              )
            );
        },
        'Cart recalculation failed',
      ],
    ])(
      'handles %s errors',
      async (
        _name,
        setup,
        expectedMessage
      ) => {
        setup();

        const result =
          await updateCartItemAction({
            amount: 3,
            cartItemId: 'item-1',
          });

        expect(result).toEqual({
          message: expectedMessage,
        });
      }
    );
  });
});

/* ==========================================================================
   ORDERS
   ========================================================================== */

describe('Orders', () => {
  describe('createOrderAction', () => {
    it('creates an order and redirects to checkout', async () => {
      mockedDb.cart.findFirst
        .mockResolvedValue({
          id: 'cart-1',
          numItemsInCart: 3,
          orderTotal: 330,
          tax: 30,
          shipping: 10,
        });

      mockedDb.order.deleteMany
        .mockResolvedValue({
          count: 0,
        });

      mockedDb.order.create
        .mockResolvedValue({
          id: 'order-1',
        });

      await expect(
        createOrderAction(
          {},
          new FormData()
        )
      ).rejects.toThrow(
        'NEXT_REDIRECT:/checkout?orderId=order-1&cartId=cart-1'
      );

      expect(
        mockedDb.order.deleteMany
      ).toHaveBeenCalledWith({
        where: {
          clerkId: mockUser.id,
          isPaid: false,
        },
      });

      expect(
        mockedDb.order.create
      ).toHaveBeenCalledWith({
        data: {
          clerkId: mockUser.id,
          products: 3,
          orderTotal: 330,
          tax: 30,
          shipping: 10,
          email:
            'test@example.com',
        },
      });
    });

    it.each([
      [
        'cart lookup',
        () => {
          mockedDb.cart.findFirst
            .mockRejectedValue(
              new Error(
                'Cart lookup failed'
              )
            );
        },
        'Cart lookup failed',
      ],

      [
        'order cleanup',
        () => {
          mockedDb.cart.findFirst
            .mockResolvedValue({
              id: 'cart-1',
              numItemsInCart: 2,
              orderTotal: 220,
              tax: 20,
              shipping: 10,
            });

          mockedDb.order.deleteMany
            .mockRejectedValue(
              new Error(
                'Order cleanup failed'
              )
            );
        },
        'Order cleanup failed',
      ],

      [
        'order creation',
        () => {
          mockedDb.cart.findFirst
            .mockResolvedValue({
              id: 'cart-1',
              numItemsInCart: 2,
              orderTotal: 220,
              tax: 20,
              shipping: 10,
            });

          mockedDb.order.deleteMany
            .mockResolvedValue({
              count: 0,
            });

          mockedDb.order.create
            .mockRejectedValue(
              new Error(
                'Order creation failed'
              )
            );
        },
        'Order creation failed',
      ],
    ])(
      'handles %s errors',
      async (
        _name,
        setup,
        expectedMessage
      ) => {
        setup();

        const result =
          await createOrderAction(
            {},
            new FormData()
          );

        expect(result).toEqual({
          message: expectedMessage,
        });

        expect(
          mockedRedirect
        ).not.toHaveBeenCalled();
      }
    );
  });

  describe('fetchUserOrders', () => {
    it('returns paid orders belonging to current user', async () => {
      const orders = [
        {
          id: 'order-1',
          clerkId: mockUser.id,
          isPaid: true,
        },
      ];

      mockedDb.order.findMany
        .mockResolvedValue(orders);

      const result =
        await fetchUserOrders();

      expect(result).toEqual(
        orders
      );

      expect(
        mockedDb.order.findMany
      ).toHaveBeenCalledWith({
        where: {
          clerkId: mockUser.id,
          isPaid: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('fetchAdminOrders', () => {
    it('returns paid orders for admin', async () => {
      mockedCurrentUser
        .mockResolvedValue(
          mockAdminUser
        );

      const orders = [
        {
          id: 'order-1',
          isPaid: true,
        },
      ];

      mockedDb.order.findMany
        .mockResolvedValue(orders);

      const result =
        await fetchAdminOrders();

      expect(result).toEqual(
        orders
      );

      expect(
        mockedDb.order.findMany
      ).toHaveBeenCalledWith({
        where: {
          isPaid: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('redirects non-admin users', async () => {
      mockedCurrentUser
        .mockResolvedValue(
          mockUser
        );

      await expect(
        fetchAdminOrders()
      ).rejects.toThrow(
        'NEXT_REDIRECT:/'
      );

      expect(
        mockedRedirect
      ).toHaveBeenCalledWith('/');
    });

    it('rejects unauthenticated users', async () => {
      mockedCurrentUser
        .mockResolvedValue(null);

      await expect(
        fetchAdminOrders()
      ).rejects.toThrow(
        'You must be logged in to access this route'
      );
    });
  });
});