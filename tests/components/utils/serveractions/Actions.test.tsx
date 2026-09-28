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

import { auth, currentUser } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import {
  imageSchema,
  productSchema,
  reviewSchema,
  validateWithZodSchema,
} from '@/utils/schema';

import { deleteImage, uploadImage } from '@/utils/supabase';
import { undefined } from 'zod';

/* -------------------------------------------------------------------------- */
/*                                  MOCKS                                     */
/* -------------------------------------------------------------------------- */

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

  validateWithZodSchema: jest.fn((schema, data) => data),
}));

jest.mock('@/utils/supabase', () => ({
  deleteImage: jest.fn(),
  uploadImage: jest.fn(),
}));

/* -------------------------------------------------------------------------- */
/*                                  TYPINGS                                   */
/* -------------------------------------------------------------------------- */

const mockedDb = db as any;

const mockedAuth = auth as jest.MockedFunction<typeof auth>;

const mockedCurrentUser =
  currentUser as jest.MockedFunction<typeof currentUser>;

const mockedRedirect = redirect as jest.MockedFunction<typeof redirect>;

const mockedRevalidatePath =
  revalidatePath as jest.MockedFunction<typeof revalidatePath>;

const mockedValidate =
  validateWithZodSchema as jest.MockedFunction<
    typeof validateWithZodSchema
  >;

const mockedUploadImage =
  uploadImage as jest.Mock;

const mockedDeleteImage =
  deleteImage as jest.Mock;

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

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

const createFormData = (
  values: Record<string, string | File | Blob>
) => {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
};

/* -------------------------------------------------------------------------- */
/*                                  SETUP                                     */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  jest.clearAllMocks();

  process.env.ADMIN_USER_ID = 'admin-123';

  mockedCurrentUser.mockResolvedValue(mockUser);

  mockedAuth.mockReturnValue({
    userId: mockUser.id,
  } as any);

  mockedValidate.mockImplementation(
    (_schema: any, data: any) => data
  );

  mockedUploadImage.mockResolvedValue(
    'https://storage.example.com/product.jpg'
  );

  mockedDeleteImage.mockResolvedValue(undefined);
});

/* ========================================================================== */
/*                              PRODUCT TESTS                                 */
/* ========================================================================== */

describe('fetchFeaturedProducts', () => {
  it('fetches only featured products', async () => {
    const products = [
      { id: '1', name: 'Product 1', featured: true },
      { id: '2', name: 'Product 2', featured: true },
    ];

    mockedDb.product.findMany.mockResolvedValue(products as any);

    const result = await fetchFeaturedProducts();

    expect(result).toEqual(products);

    expect(mockedDb.product.findMany).toHaveBeenCalledWith({
      where: {
        featured: true,
      },
    });
  });
});

describe('fetchAllProducts', () => {
  it('searches products by name and company', async () => {
    const products = [{ id: '1', name: 'Nike Shoes' }];

    mockedDb.product.findMany.mockResolvedValue(products as any);

    const result = await fetchAllProducts({
      search: 'nike',
    });

    expect(result).toEqual(products);

    expect(mockedDb.product.findMany).toHaveBeenCalledWith({
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
});

describe('fetchSingleProduct', () => {
  it('returns a product when found', async () => {
    const product = {
      id: 'product-1',
      name: 'Test Product',
    };

    mockedDb.product.findUnique.mockResolvedValue(product as any);

    const result = await fetchSingleProduct('product-1');

    expect(result).toEqual(product);

    expect(mockedDb.product.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'product-1',
      },
    });
  });

  it('redirects when the product does not exist', async () => {
    mockedDb.product.findUnique.mockResolvedValue(null);

    await expect(
      fetchSingleProduct('missing-product')
    ).rejects.toThrow('NEXT_REDIRECT:/products');

    expect(mockedRedirect).toHaveBeenCalledWith('/products');
  });
});

/* ========================================================================== */
/*                         CREATE PRODUCT ACTION                              */
/* ========================================================================== */

describe('createProductAction', () => {
  it('creates a product successfully', async () => {
    const file = new File(['image'], 'product.jpg', {
      type: 'image/jpeg',
    });

    const formData = createFormData({
      name: 'Test Product',
      company: 'Test Company',
      price: '100',
      description: 'Test description',
      featured: 'true',
      image: file,
    });

    mockedCurrentUser.mockResolvedValue(mockUser);

    mockedUploadImage.mockResolvedValue(
      'https://storage.example.com/product.jpg'
    );

    mockedDb.product.create.mockResolvedValue({
      id: 'product-1',
    } as any);

    const result = await createProductAction({}, formData);

    expect(result).toEqual({
      message: 'product created',
    });

    expect(mockedValidate).toHaveBeenCalledWith(
      productSchema,
      expect.any(Object)
    );

    expect(mockedValidate).toHaveBeenCalledWith(
      imageSchema,
      {
        image: file,
      }
    );

    expect(mockedUploadImage).toHaveBeenCalledWith(file);

    expect(mockedDb.product.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        image: 'https://storage.example.com/product.jpg',
        clerkId: mockUser.id,
      }),
    });
  });

  it('returns an error when product creation fails', async () => {
    const file = new File(['image'], 'product.jpg', {
      type: 'image/jpeg',
    });

    const formData = createFormData({
      name: 'Test Product',
      company: 'Test Company',
      price: '100',
      description: 'Test description',
      featured: 'true',
      image: file,
    });

    mockedUploadImage.mockRejectedValue(
      new Error('Upload failed')
    );

    const result = await createProductAction({}, formData);

    expect(result).toEqual({
      message: 'Upload failed',
    });

    expect(mockedDb.product.create).not.toHaveBeenCalled();
  });



  it('it returns a generic error message when a non-Error value is thrown', async () => {
    const file = new File(['image'],
      'product.jpg', {
      type: 'image/jpeg',
    });

    const formData = createFormData({
      name: 'Test Product',
      company: 'Test Company',
      price: '100',
      description: 'Test description',
      featured: 'true',
      image: file,
    })

    mockedUploadImage.mockRejectedValue('something went wrong');
    const result = await createProductAction({}, formData);
    expect(result).toEqual({ message: 'An error occurred' });
  })


  it('throws when the user is not authenticated', async () => {
    mockedCurrentUser.mockResolvedValue(null);

    const formData = createFormData({
      name: 'Test Product',
    });

    await expect(
      createProductAction({}, formData)
    ).rejects.toThrow(
      'You must be logged in to access this route'
    );
  });
});

/* ========================================================================== */
/*                              ADMIN PRODUCTS                                */
/* ========================================================================== */

describe('fetchAdminProducts', () => {
  it('returns products for an admin', async () => {
    mockedCurrentUser.mockResolvedValue(mockAdminUser);

    const products = [{ id: '1' }];

    mockedDb.product.findMany.mockResolvedValue(products as any);

    const result = await fetchAdminProducts();

    expect(result).toEqual(products);

    expect(mockedDb.product.findMany).toHaveBeenCalledWith({
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('redirects non-admin users', async () => {
    mockedCurrentUser.mockResolvedValue(mockUser);

    await expect(fetchAdminProducts()).rejects.toThrow(
      'NEXT_REDIRECT:/'
    );

    expect(mockedRedirect).toHaveBeenCalledWith('/');
  });
});

describe('deleteProductAction', () => {
  it('deletes the product and its image', async () => {
    mockedCurrentUser.mockResolvedValue(mockAdminUser);

    mockedDb.product.delete.mockResolvedValue({
      id: 'product-1',
      image: 'old-image.jpg',
    } as any);

    const result = await deleteProductAction({
      productId: 'product-1',
    });

    expect(result).toEqual({
      message: 'product removed',
    });

    expect(mockedDb.product.delete).toHaveBeenCalledWith({
      where: {
        id: 'product-1',
      },
    });

    expect(mockedDeleteImage).toHaveBeenCalledWith(
      'old-image.jpg'
    );

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      '/admin/products'
    );
  });

  it('returns database errors', async () => {
    mockedCurrentUser.mockResolvedValue(mockAdminUser);

    mockedDb.product.delete.mockRejectedValue(
      new Error('Delete failed')
    );

    const result = await deleteProductAction({
      productId: 'product-1',
    });

    expect(result).toEqual({
      message: 'Delete failed',
    });
  });
});

describe('fetchAdminProductDetails', () => {
  it('returns an admin product', async () => {
    mockedCurrentUser.mockResolvedValue(mockAdminUser);

    const product = {
      id: 'product-1',
      name: 'Test Product',
    };

    mockedDb.product.findUnique.mockResolvedValue(product as any);

    const result =
      await fetchAdminProductDetails('product-1');

    expect(result).toEqual(product);
  });

  it('redirects when the product does not exist', async () => {
    mockedCurrentUser.mockResolvedValue(mockAdminUser);

    mockedDb.product.findUnique.mockResolvedValue(null);

    await expect(
      fetchAdminProductDetails('missing')
    ).rejects.toThrow('NEXT_REDIRECT:/admin/products');
  });
});

describe('updateProductAction', () => {
  it('updates a product', async () => {
    mockedCurrentUser.mockResolvedValue(mockAdminUser);

    const formData = createFormData({
      id: 'product-1',
      name: 'Updated Product',
      company: 'Updated Company',
      price: '200',
      description: 'Updated description',
      featured: 'false',
    });

    mockedDb.product.update.mockResolvedValue({
      id: 'product-1',
    } as any);

    const result = await updateProductAction(
      {},
      formData
    );

    expect(result).toEqual({
      message: 'Product updated successfully',
    });

    expect(mockedDb.product.update).toHaveBeenCalledWith({
      where: {
        id: 'product-1',
      },
      data: expect.any(Object),
    });

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      '/admin/products/product-1/edit'
    );
  });

  it('returns errors from the update operation', async () => {
    mockedCurrentUser.mockResolvedValue(mockAdminUser);

    mockedDb.product.update.mockRejectedValue(
      new Error('Update failed')
    );

    const formData = createFormData({
      id: 'product-1',
    });

    const result = await updateProductAction(
      {},
      formData
    );

    expect(result).toEqual({
      message: 'Update failed',
    });
  });
});

describe('updateProductImageAction', () => {
  it('uploads the new image, deletes the old image and updates the product', async () => {
    const file = new File(['image'], 'new.jpg', {
      type: 'image/jpeg',
    });

    const formData = createFormData({
      image: file,
      id: 'product-1',
      url: 'old-image.jpg',
    });

    mockedUploadImage.mockResolvedValue(
      'new-image.jpg'
    );

    mockedDb.product.update.mockResolvedValue({
      id: 'product-1',
    } as any);

    const result = await updateProductImageAction(
      {},
      formData
    );

    expect(result).toEqual({
      message: 'Product Image updated successfully',
    });

    expect(mockedUploadImage).toHaveBeenCalledWith(file);

    expect(mockedDeleteImage).toHaveBeenCalledWith(
      'old-image.jpg'
    );

    expect(mockedDb.product.update).toHaveBeenCalledWith({
      where: {
        id: 'product-1',
      },
      data: {
        image: 'new-image.jpg',
      },
    });

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      '/admin/products/product-1/edit'
    );
  });
});

/* ========================================================================== */
/*                              FAVORITES                                     */
/* ========================================================================== */

describe('fetchFavoriteId', () => {
  it('returns the favorite id', async () => {
    mockedDb.favorite.findFirst.mockResolvedValue({
      id: 'favorite-1',
    } as any);

    const result = await fetchFavoriteId({
      productId: 'product-1',
    });

    expect(result).toBe('favorite-1');

    expect(mockedDb.favorite.findFirst).toHaveBeenCalledWith({
      where: {
        productId: 'product-1',
        clerkId: mockUser.id,
      },
      select: {
        id: true,
      },
    });
  });

  it('returns null when no favorite exists', async () => {
    mockedDb.favorite.findFirst.mockResolvedValue(null);

    const result = await fetchFavoriteId({
      productId: 'product-1',
    });

    expect(result).toBeNull();
  });
});

describe('toggleFavoriteAction', () => {
  it('removes an existing favorite', async () => {
    const result = await toggleFavoriteAction({
      productId: 'product-1',
      favoriteId: 'favorite-1',
      pathname: '/products',
    });

    expect(result).toEqual({
      message: 'Removed from Faves',
    });

    expect(mockedDb.favorite.delete).toHaveBeenCalledWith({
      where: {
        id: 'favorite-1',
      },
    });

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      '/products'
    );
  });

  it('creates a favorite when no favorite exists', async () => {
    const result = await toggleFavoriteAction({
      productId: 'product-1',
      favoriteId: null,
      pathname: '/products',
    });

    expect(result).toEqual({
      message: 'Added to Faves',
    });

    expect(mockedDb.favorite.create).toHaveBeenCalledWith({
      data: {
        productId: 'product-1',
        clerkId: mockUser.id,
      },
    });
  });

  it('returns database errors', async () => {
    mockedDb.favorite.create.mockRejectedValue(
      new Error('Favorite failed')
    );

    const result = await toggleFavoriteAction({
      productId: 'product-1',
      favoriteId: null,
      pathname: '/products',
    });

    expect(result).toEqual({
      message: 'Favorite failed',
    });
  });
});

describe('fetchUserFavorites', () => {
  it('returns the current user favorites', async () => {
    const favorites = [
      {
        id: 'favorite-1',
        product: {
          id: 'product-1',
        },
      },
    ];

    mockedDb.favorite.findMany.mockResolvedValue(
      favorites as any
    );

    const result = await fetchUserFavorites();

    expect(result).toEqual(favorites);

    expect(mockedDb.favorite.findMany).toHaveBeenCalledWith({
      where: {
        clerkId: mockUser.id,
      },
      include: {
        product: true,
      },
    });
  });
});

/* ========================================================================== */
/*                                REVIEWS                                     */
/* ========================================================================== */

describe('createReviewAction', () => {
  it('creates a review successfully', async () => {
    const formData = createFormData({
      productId: 'product-1',
      rating: '5',
      comment: 'Excellent product',
    });

    mockedDb.review.create.mockResolvedValue({
      id: 'review-1',
    } as any);

    const result = await createReviewAction(
      {},
      formData
    );

    expect(result).toEqual({
      message: 'Review submitted successfully',
    });

    expect(mockedDb.review.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        clerkId: mockUser.id,
      }),
    });

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      '/products/product-1'
    );
  });

  it('returns validation/database errors', async () => {
    mockedValidate.mockImplementation(() => {
      throw new Error('Invalid review');
    });

    const formData = createFormData({
      productId: 'product-1',
      rating: '0',
      comment: '',
    });

    const result = await createReviewAction(
      {},
      formData
    );

    expect(result).toEqual({
      message: 'Invalid review',
    });

    expect(mockedDb.review.create).not.toHaveBeenCalled();
  });
});

describe('fetchProductReviews', () => {
  it('returns reviews for a product ordered by newest first', async () => {
    const reviews = [
      {
        id: 'review-1',
        productId: 'product-1',
      },
    ];

    mockedDb.review.findMany.mockResolvedValue(
      reviews as any
    );

    const result =
      await fetchProductReviews('product-1');

    expect(result).toEqual(reviews);

    expect(mockedDb.review.findMany).toHaveBeenCalledWith({
      where: {
        productId: 'product-1',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });
});

describe('fetchProductReviewsByUser', () => {
  it('returns reviews belonging to the current user', async () => {
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

    mockedDb.review.findMany.mockResolvedValue(
      reviews as any
    );

    const result =
      await fetchProductReviewsByUser();

    expect(result).toEqual(reviews);

    expect(mockedDb.review.findMany).toHaveBeenCalledWith({
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
});

describe('deleteReviewAction', () => {
  it('deletes the current user review', async () => {
    const result = await deleteReviewAction({
      reviewId: 'review-1',
    });

    expect(result).toEqual({
      message: 'Review deleted successfully',
    });

    expect(mockedDb.review.delete).toHaveBeenCalledWith({
      where: {
        id: 'review-1',
        clerkId: mockUser.id,
      },
    });

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      '/reviews'
    );
  });

  it('returns delete errors', async () => {
    mockedDb.review.delete.mockRejectedValue(
      new Error('Delete review failed')
    );

    const result = await deleteReviewAction({
      reviewId: 'review-1',
    });

    expect(result).toEqual({
      message: 'Delete review failed',
    });
  });
});

describe('findExistingReview', () => {
  it('searches for a review by user and product', async () => {
    const review = {
      id: 'review-1',
    };

    mockedDb.review.findFirst.mockResolvedValue(
      review as any
    );

    const result = await findExistingReview(
      'user-123',
      'product-1'
    );

    expect(result).toEqual(review);

    expect(mockedDb.review.findFirst).toHaveBeenCalledWith({
      where: {
        clerkId: 'user-123',
        productId: 'product-1',
      },
    });
  });
});

describe('fetchProductRating', () => {
  it('calculates average rating and count', async () => {
    mockedDb.review.groupBy.mockResolvedValue([
      {
        productId: 'product-1',
        _avg: {
          rating: 4.5,
        },
        _count: {
          rating: 10,
        },
      },
    ] as any);

    const result =
      await fetchProductRating('product-1');

    expect(result).toEqual({
      rating: '4.5',
      count: 10,
    });
  });

  it('returns zero values when there are no reviews', async () => {
    mockedDb.review.groupBy.mockResolvedValue([]);

    const result =
      await fetchProductRating('product-1');

    expect(result).toEqual({
      rating: 0,
      count: 0,
    });
  });
});

/* ========================================================================== */
/*                                  CART                                      */
/* ========================================================================== */

describe('fetchCartItems', () => {
  it('returns the number of items in the cart', async () => {
    mockedAuth.mockReturnValue({
      userId: 'user-123',
    } as any);

    mockedDb.cart.findFirst.mockResolvedValue({
      numItemsInCart: 4,
    } as any);

    const result = await fetchCartItems();

    expect(result).toBe(4);

    expect(mockedDb.cart.findFirst).toHaveBeenCalledWith({
      where: {
        clerkId: 'user-123',
      },
      select: {
        numItemsInCart: true,
      },
    });
  });

  it('returns zero when no cart exists', async () => {
    mockedDb.cart.findFirst.mockResolvedValue(null);

    const result = await fetchCartItems();

    expect(result).toBe(0);
  });
});

describe('fetchOrCreateCart', () => {
  it('returns an existing cart', async () => {
    const cart = {
      id: 'cart-1',
      clerkId: 'user-123',
    };

    mockedDb.cart.findFirst.mockResolvedValue(cart as any);

    const result = await fetchOrCreateCart({
      userId: 'user-123',
    });

    expect(result).toEqual(cart);

    expect(mockedDb.cart.create).not.toHaveBeenCalled();
  });

  it('creates a cart when one does not exist', async () => {
    mockedDb.cart.findFirst.mockResolvedValue(null);

    const newCart = {
      id: 'cart-1',
      clerkId: 'user-123',
    };

    mockedDb.cart.create.mockResolvedValue(
      newCart as any
    );

    const result = await fetchOrCreateCart({
      userId: 'user-123',
    });

    expect(result).toEqual(newCart);

    expect(mockedDb.cart.create).toHaveBeenCalledWith({
      data: {
        clerkId: 'user-123',
      },
      include: expect.any(Object),
    });
  });

  it('throws when cart does not exist and errorOnFailure is true', async () => {
    mockedDb.cart.findFirst.mockResolvedValue(null);

    await expect(
      fetchOrCreateCart({
        userId: 'user-123',
        errorOnFailure: true,
      })
    ).rejects.toThrow('Cart not found');

    expect(mockedDb.cart.create).not.toHaveBeenCalled();
  });
});

describe('updateCart', () => {
  it('calculates cart totals and updates the cart', async () => {
    const cart = {
      id: 'cart-1',
      taxRate: 0.1,
      shipping: 20,
    };

    mockedDb.cartItem.findMany.mockResolvedValue([
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
    ] as any);

    const updatedCart = {
      id: 'cart-1',
      numItemsInCart: 3,
      cartTotal: 250,
      tax: 25,
      orderTotal: 295,
    };

    mockedDb.cart.update.mockResolvedValue(
      updatedCart as any
    );

    const result = await updateCart(cart as any);

    expect(result.currentCart).toEqual(updatedCart);

    expect(result.cartItems).toHaveLength(2);

    expect(mockedDb.cart.update).toHaveBeenCalledWith({
      where: {
        id: 'cart-1',
      },
      data: {
        numItemsInCart: 3,
        cartTotal: 250,
        tax: 25,
        orderTotal: 295,
      },
      include: expect.any(Object),
    });
  });

  it('does not add shipping when cart total is zero', async () => {
    const cart = {
      id: 'cart-1',
      taxRate: 0.1,
      shipping: 20,
    };

    mockedDb.cartItem.findMany.mockResolvedValue([]);

    mockedDb.cart.update.mockResolvedValue({
      id: 'cart-1',
    } as any);

    await updateCart(cart as any);

    expect(mockedDb.cart.update).toHaveBeenCalledWith(
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
});

describe('addToCartAction', () => {
  it('adds a new cart item and redirects to cart', async () => {
    const formData = createFormData({
      productId: 'product-1',
      amount: '2',
    });

    mockedDb.product.findUnique.mockResolvedValue({
      id: 'product-1',
      price: 100,
    } as any);

    mockedDb.cart.findFirst
      .mockResolvedValueOnce({
        id: 'cart-1',
        taxRate: 0.1,
        shipping: 10,
      } as any);

    mockedDb.cartItem.findFirst.mockResolvedValue(null);

    mockedDb.cartItem.create.mockResolvedValue({
      id: 'cart-item-1',
    } as any);

    mockedDb.cartItem.findMany.mockResolvedValue([]);

    mockedDb.cart.update.mockResolvedValue({
      id: 'cart-1',
    } as any);

    await expect(
      addToCartAction({}, formData)
    ).rejects.toThrow('NEXT_REDIRECT:/cart');

    expect(mockedDb.cartItem.create).toHaveBeenCalledWith({
      data: {
        amount: 2,
        productId: 'product-1',
        cartId: 'cart-1',
      },
    });

    expect(mockedRedirect).toHaveBeenCalledWith('/cart');
  });

  it('updates an existing cart item instead of creating one', async () => {
    const formData = createFormData({
      productId: 'product-1',
      amount: '2',
    });

    mockedDb.product.findUnique.mockResolvedValue({
      id: 'product-1',
    } as any);

    mockedDb.cart.findFirst.mockResolvedValue({
      id: 'cart-1',
      taxRate: 0.1,
      shipping: 10,
    } as any);

    mockedDb.cartItem.findFirst.mockResolvedValue({
      id: 'item-1',
      amount: 3,
    } as any);

    mockedDb.cartItem.update.mockResolvedValue({
      id: 'item-1',
      amount: 5,
    } as any);

    mockedDb.cartItem.findMany.mockResolvedValue([]);

    mockedDb.cart.update.mockResolvedValue({
      id: 'cart-1',
    } as any);

    await expect(
      addToCartAction({}, formData)
    ).rejects.toThrow('NEXT_REDIRECT:/cart');

    expect(mockedDb.cartItem.update).toHaveBeenCalledWith({
      where: {
        id: 'item-1',
      },
      data: {
        amount: 5,
      },
    });

    expect(mockedDb.cartItem.create).not.toHaveBeenCalled();
  });

  it('returns an error when the product does not exist', async () => {
    const formData = createFormData({
      productId: 'missing',
      amount: '1',
    });

    mockedDb.product.findUnique.mockResolvedValue(null);

    const result = await addToCartAction(
      {},
      formData
    );

    expect(result).toEqual({
      message: 'Product not found',
    });

    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});

describe('removeCartItemAction', () => {
  it('removes an item and recalculates the cart', async () => {
    const formData = createFormData({
      id: 'cart-item-1',
    });

    const cart = {
      id: 'cart-1',
      taxRate: 0.1,
      shipping: 10,
    };

    mockedDb.cart.findFirst.mockResolvedValue(
      cart as any
    );

    mockedDb.cartItem.delete.mockResolvedValue({
      id: 'cart-item-1',
    } as any);

    mockedDb.cartItem.findMany.mockResolvedValue([]);

    mockedDb.cart.update.mockResolvedValue(
      cart as any
    );

    const result = await removeCartItemAction(
      {},
      formData
    );

    expect(result).toEqual({
      message: 'Item removed from cart',
    });

    expect(mockedDb.cartItem.delete).toHaveBeenCalledWith({
      where: {
        id: 'cart-item-1',
        cartId: 'cart-1',
      },
    });

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      '/cart'
    );
  });

  it('returns an error when the cart does not exist', async () => {
    mockedDb.cart.findFirst.mockResolvedValue(null);

    const formData = createFormData({
      id: 'cart-item-1',
    });

    const result = await removeCartItemAction(
      {},
      formData
    );

    expect(result).toEqual({
      message: 'Cart not found',
    });
  });
});

describe('updateCartItemAction', () => {
  it('updates the quantity of a cart item', async () => {
    const cart = {
      id: 'cart-1',
      taxRate: 0.1,
      shipping: 10,
    };

    mockedDb.cart.findFirst.mockResolvedValue(
      cart as any
    );

    mockedDb.cartItem.update.mockResolvedValue({
      id: 'item-1',
      amount: 4,
    } as any);

    mockedDb.cartItem.findMany.mockResolvedValue([]);

    mockedDb.cart.update.mockResolvedValue(
      cart as any
    );

    const result = await updateCartItemAction({
      amount: 4,
      cartItemId: 'item-1',
    });

    expect(result).toEqual({
      message: 'cart updated',
    });

    expect(mockedDb.cartItem.update).toHaveBeenCalledWith({
      where: {
        id: 'item-1',
        cartId: 'cart-1',
      },
      data: {
        amount: 4,
      },
    });

    expect(mockedRevalidatePath).toHaveBeenCalledWith(
      '/cart'
    );
  });

  it('returns an error when the cart cannot be found', async () => {
    mockedDb.cart.findFirst.mockResolvedValue(null);

    const result = await updateCartItemAction({
      amount: 4,
      cartItemId: 'item-1',
    });

    expect(result).toEqual({
      message: 'Cart not found',
    });
  });
});

/* ========================================================================== */
/*                                  ORDERS                                    */
/* ========================================================================== */

describe('createOrderAction', () => {
  it('creates an order and redirects to checkout', async () => {
    const cart = {
      id: 'cart-1',
      numItemsInCart: 3,
      orderTotal: 330,
      tax: 30,
      shipping: 10,
    };

    mockedDb.cart.findFirst.mockResolvedValue(
      cart as any
    );

    mockedDb.order.deleteMany.mockResolvedValue({
      count: 0,
    } as any);

    mockedDb.order.create.mockResolvedValue({
      id: 'order-1',
    } as any);

    await expect(
      createOrderAction({}, new FormData())
    ).rejects.toThrow(
      'NEXT_REDIRECT:/checkout?orderId=order-1&cartId=cart-1'
    );

    expect(mockedDb.order.deleteMany).toHaveBeenCalledWith({
      where: {
        clerkId: mockUser.id,
        isPaid: false,
      },
    });

    expect(mockedDb.order.create).toHaveBeenCalledWith({
      data: {
        clerkId: mockUser.id,
        products: 3,
        orderTotal: 330,
        tax: 30,
        shipping: 10,
        email: 'test@example.com',
      },
    });
  });

  it('returns an error when order creation fails', async () => {
    mockedDb.cart.findFirst.mockResolvedValue({
      id: 'cart-1',
      numItemsInCart: 2,
      orderTotal: 200,
      tax: 20,
      shipping: 10,
    } as any);

    mockedDb.order.deleteMany.mockRejectedValue(
      new Error('Order cleanup failed')
    );

    const result = await createOrderAction(
      {},
      new FormData()
    );

    expect(result).toEqual({
      message: 'Order cleanup failed',
    });

    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});

describe('fetchUserOrders', () => {
  it('returns paid orders belonging to the current user', async () => {
    const orders = [
      {
        id: 'order-1',
        clerkId: mockUser.id,
        isPaid: true,
      },
    ];

    mockedDb.order.findMany.mockResolvedValue(
      orders as any
    );

    const result = await fetchUserOrders();

    expect(result).toEqual(orders);

    expect(mockedDb.order.findMany).toHaveBeenCalledWith({
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
  it('returns paid orders for an admin', async () => {
    mockedCurrentUser.mockResolvedValue(mockAdminUser);

    const orders = [
      {
        id: 'order-1',
        isPaid: true,
      },
    ];

    mockedDb.order.findMany.mockResolvedValue(
      orders as any
    );

    const result = await fetchAdminOrders();

    expect(result).toEqual(orders);

    expect(mockedDb.order.findMany).toHaveBeenCalledWith({
      where: {
        isPaid: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('redirects non-admin users', async () => {
    mockedCurrentUser.mockResolvedValue(mockUser);

    await expect(
      fetchAdminOrders()
    ).rejects.toThrow('NEXT_REDIRECT:/');

    expect(mockedRedirect).toHaveBeenCalledWith('/');
  });
});

/* ========================================================================== */
/*                            AUTHENTICATION                                  */
/* ========================================================================== */

describe('authentication behavior', () => {
  it('rejects authenticated-only actions when there is no current user', async () => {
    mockedCurrentUser.mockResolvedValue(null);

    await expect(
      fetchUserFavorites()
    ).rejects.toThrow(
      'You must be logged in to access this route'
    );
  });

  it('rejects admin actions when there is no current user', async () => {
    mockedCurrentUser.mockResolvedValue(null);

    await expect(
      fetchAdminProducts()
    ).rejects.toThrow(
      'You must be logged in to access this route'
    );
  });

  describe('generic error handling / catch branches', () => {
    describe('createProductAction', () => {
      it('returns the error when validation fails', async () => {
        mockedValidate.mockImplementation(() => {
          throw new Error('Product validation failed');
        });

        const formData = createFormData({
          name: 'Test Product',
          company: 'Test Company',
          price: '100',
          description: 'Test description',
          featured: 'true',
          image: new File(['image'], 'product.jpg', {
            type: 'image/jpeg',
          }),
        });

        const result = await createProductAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Product validation failed',
        });

        expect(mockedUploadImage).not.toHaveBeenCalled();
        expect(mockedDb.product.create).not.toHaveBeenCalled();
      });

      it('returns the error when image upload fails', async () => {
        mockedUploadImage.mockRejectedValue(
          new Error('Image upload failed')
        );

        const formData = createFormData({
          name: 'Test Product',
          company: 'Test Company',
          price: '100',
          description: 'Test description',
          featured: 'true',
          image: new File(['image'], 'product.jpg', {
            type: 'image/jpeg',
          }),
        });

        const result = await createProductAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Image upload failed',
        });

        expect(mockedDb.product.create).not.toHaveBeenCalled();
      });

      it('returns the error when product creation fails', async () => {
        mockedDb.product.create.mockRejectedValue(
          new Error('Product creation failed')
        );

        const formData = createFormData({
          name: 'Test Product',
          company: 'Test Company',
          price: '100',
          description: 'Test description',
          featured: 'true',
          image: new File(['image'], 'product.jpg', {
            type: 'image/jpeg',
          }),
        });

        const result = await createProductAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Product creation failed',
        });
      });
    });

    describe('deleteProductAction', () => {
      it('returns an error when product deletion fails', async () => {
        mockedCurrentUser.mockResolvedValue(mockAdminUser);

        mockedDb.product.delete.mockRejectedValue(
          new Error('Product deletion failed')
        );

        const result = await deleteProductAction({
          productId: 'product-1',
        });

        expect(result).toEqual({
          message: 'Product deletion failed',
        });

        expect(mockedDeleteImage).not.toHaveBeenCalled();
        expect(mockedRevalidatePath).not.toHaveBeenCalled();
      });

      it('returns an error when image deletion fails', async () => {
        mockedCurrentUser.mockResolvedValue(mockAdminUser);

        mockedDb.product.delete.mockResolvedValue({
          id: 'product-1',
          image: 'old-image.jpg',
        } as any);

        mockedDeleteImage.mockRejectedValue(
          new Error('Image deletion failed')
        );

        const result = await deleteProductAction({
          productId: 'product-1',
        });

        expect(result).toEqual({
          message: 'Image deletion failed',
        });

        expect(mockedRevalidatePath).not.toHaveBeenCalled();
      });

      it('handles a non-Error thrown value', async () => {
        mockedCurrentUser.mockResolvedValue(mockAdminUser);

        mockedDb.product.delete.mockRejectedValue(
          'something went wrong'
        );

        const result = await deleteProductAction({
          productId: 'product-1',
        });

        expect(result).toEqual({
          message: 'An error occurred',
        });
      });
    });

    describe('updateProductAction', () => {
      it('returns validation errors', async () => {
        mockedCurrentUser.mockResolvedValue(mockAdminUser);

        mockedValidate.mockImplementation(() => {
          throw new Error('Product validation failed');
        });

        const formData = createFormData({
          id: 'product-1',
          name: 'Invalid Product',
        });

        const result = await updateProductAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Product validation failed',
        });

        expect(mockedDb.product.update).not.toHaveBeenCalled();
      });

      it('returns database update errors', async () => {
        mockedCurrentUser.mockResolvedValue(mockAdminUser);

        mockedDb.product.update.mockRejectedValue(
          new Error('Product update failed')
        );

        const formData = createFormData({
          id: 'product-1',
          name: 'Updated Product',
        });

        const result = await updateProductAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Product update failed',
        });

        expect(mockedRevalidatePath).not.toHaveBeenCalled();
      });
    });

    describe('updateProductImageAction', () => {
      it('returns validation errors', async () => {
        mockedValidate.mockImplementation(() => {
          throw new Error('Invalid image');
        });

        const formData = createFormData({
          id: 'product-1',
          url: 'old-image.jpg',
          image: new File(['image'], 'new.jpg', {
            type: 'image/jpeg',
          }),
        });

        const result = await updateProductImageAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Invalid image',
        });

        expect(mockedUploadImage).not.toHaveBeenCalled();
      });

      it('returns upload errors', async () => {
        mockedUploadImage.mockRejectedValue(
          new Error('Upload failed')
        );

        const formData = createFormData({
          id: 'product-1',
          url: 'old-image.jpg',
          image: new File(['image'], 'new.jpg', {
            type: 'image/jpeg',
          }),
        });

        const result = await updateProductImageAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Upload failed',
        });

        expect(mockedDeleteImage).not.toHaveBeenCalled();
        expect(mockedDb.product.update).not.toHaveBeenCalled();
      });

      it('returns delete-image errors', async () => {
        mockedDeleteImage.mockRejectedValue(
          new Error('Old image deletion failed')
        );

        const formData = createFormData({
          id: 'product-1',
          url: 'old-image.jpg',
          image: new File(['image'], 'new.jpg', {
            type: 'image/jpeg',
          }),
        });

        const result = await updateProductImageAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Old image deletion failed',
        });

        expect(mockedDb.product.update).not.toHaveBeenCalled();
      });

      it('returns product update errors', async () => {
        mockedDb.product.update.mockRejectedValue(
          new Error('Image product update failed')
        );

        const formData = createFormData({
          id: 'product-1',
          url: 'old-image.jpg',
          image: new File(['image'], 'new.jpg', {
            type: 'image/jpeg',
          }),
        });

        const result = await updateProductImageAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Image product update failed',
        });
      });
    });

    describe('toggleFavoriteAction', () => {
      it('returns an error when deleting a favorite fails', async () => {
        mockedDb.favorite.delete.mockRejectedValue(
          new Error('Favorite deletion failed')
        );

        const result = await toggleFavoriteAction({
          productId: 'product-1',
          favoriteId: 'favorite-1',
          pathname: '/products',
        });

        expect(result).toEqual({
          message: 'Favorite deletion failed',
        });

        expect(mockedRevalidatePath).not.toHaveBeenCalled();
      });

      it('returns an error when creating a favorite fails', async () => {
        mockedDb.favorite.create.mockRejectedValue(
          new Error('Favorite creation failed')
        );

        const result = await toggleFavoriteAction({
          productId: 'product-1',
          favoriteId: null,
          pathname: '/products',
        });

        expect(result).toEqual({
          message: 'Favorite creation failed',
        });

        expect(mockedRevalidatePath).not.toHaveBeenCalled();
      });
    });

    describe('createReviewAction', () => {
      it('returns an error when review creation fails', async () => {
        mockedDb.review.create.mockRejectedValue(
          new Error('Review creation failed')
        );

        const formData = createFormData({
          productId: 'product-1',
          rating: '5',
          comment: 'Great product',
        });

        const result = await createReviewAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Review creation failed',
        });

        expect(mockedRevalidatePath).not.toHaveBeenCalled();
      });

      it('returns a non-Error failure using the generic message', async () => {
        mockedDb.review.create.mockRejectedValue(
          'review failed'
        );

        const formData = createFormData({
          productId: 'product-1',
          rating: '5',
          comment: 'Great product',
        });

        const result = await createReviewAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'An error occurred',
        });
      });
    });

    describe('deleteReviewAction', () => {
      it('returns an error when deleting a review fails', async () => {
        mockedDb.review.delete.mockRejectedValue(
          new Error('Review deletion failed')
        );

        const result = await deleteReviewAction({
          reviewId: 'review-1',
        });

        expect(result).toEqual({
          message: 'Review deletion failed',
        });

        expect(mockedRevalidatePath).not.toHaveBeenCalled();
      });
    });
  });

  describe('cart and order error branches', () => {
    describe('fetchOrCreateCart', () => {
      it('returns the error when cart creation fails', async () => {
        mockedDb.cart.findFirst.mockResolvedValue(null);

        mockedDb.cart.create.mockRejectedValue(
          new Error('Cart creation failed')
        );

        await expect(
          fetchOrCreateCart({
            userId: 'user-123',
          })
        ).rejects.toThrow('Cart creation failed');
      });
    });

    describe('updateCart', () => {
      it('throws when updating the cart fails', async () => {
        mockedDb.cartItem.findMany.mockResolvedValue([]);

        mockedDb.cart.update.mockRejectedValue(
          new Error('Cart update failed')
        );

        await expect(
          updateCart({
            id: 'cart-1',
            taxRate: 0.1,
            shipping: 10,
          } as any)
        ).rejects.toThrow('Cart update failed');
      });
    });

    describe('addToCartAction', () => {
      it('returns an error when fetching the product fails', async () => {
        mockedDb.product.findUnique.mockRejectedValue(
          new Error('Product lookup failed')
        );

        const formData = createFormData({
          productId: 'product-1',
          amount: '2',
        });

        const result = await addToCartAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Product lookup failed',
        });

        expect(mockedDb.cart.findFirst).not.toHaveBeenCalled();
      });

      it('returns an error when cart creation fails', async () => {
        mockedDb.product.findUnique.mockResolvedValue({
          id: 'product-1',
          price: 100,
        } as any);

        mockedDb.cart.findFirst.mockResolvedValue(null);

        mockedDb.cart.create.mockRejectedValue(
          new Error('Cart creation failed')
        );

        const formData = createFormData({
          productId: 'product-1',
          amount: '2',
        });

        const result = await addToCartAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Cart creation failed',
        });
      });

      it('returns an error when adding the cart item fails', async () => {
        mockedDb.product.findUnique.mockResolvedValue({
          id: 'product-1',
          price: 100,
        } as any);

        mockedDb.cart.findFirst.mockResolvedValue({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        } as any);

        mockedDb.cartItem.findFirst.mockRejectedValue(
          new Error('Cart item lookup failed')
        );

        const formData = createFormData({
          productId: 'product-1',
          amount: '2',
        });

        const result = await addToCartAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Cart item lookup failed',
        });
      });

      it('returns an error when updating the cart total fails', async () => {
        mockedDb.product.findUnique.mockResolvedValue({
          id: 'product-1',
          price: 100,
        } as any);

        mockedDb.cart.findFirst.mockResolvedValue({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        } as any);

        mockedDb.cartItem.findFirst.mockResolvedValue(null);

        mockedDb.cartItem.create.mockResolvedValue({
          id: 'item-1',
        } as any);

        mockedDb.cartItem.findMany.mockResolvedValue([]);

        mockedDb.cart.update.mockRejectedValue(
          new Error('Cart total update failed')
        );

        const formData = createFormData({
          productId: 'product-1',
          amount: '2',
        });

        const result = await addToCartAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Cart total update failed',
        });

        expect(mockedRedirect).not.toHaveBeenCalled();
      });

      it('returns an error when updating an existing cart item fails', async () => {
        mockedDb.product.findUnique.mockResolvedValue({
          id: 'product-1',
          price: 100,
        } as any);

        mockedDb.cart.findFirst.mockResolvedValue({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        } as any);

        mockedDb.cartItem.findFirst.mockResolvedValue({
          id: 'item-1',
          amount: 2,
        } as any);

        mockedDb.cartItem.update.mockRejectedValue(
          new Error('Cart item update failed')
        );

        const formData = createFormData({
          productId: 'product-1',
          amount: '2',
        });

        const result = await addToCartAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Cart item update failed',
        });
      });
    });

    describe('removeCartItemAction', () => {
      it('returns an error when deleting the cart item fails', async () => {
        mockedDb.cart.findFirst.mockResolvedValue({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        } as any);

        mockedDb.cartItem.delete.mockRejectedValue(
          new Error('Cart item deletion failed')
        );

        const formData = createFormData({
          id: 'item-1',
        });

        const result = await removeCartItemAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Cart item deletion failed',
        });

        expect(mockedRevalidatePath).not.toHaveBeenCalled();
      });

      it('returns an error when cart recalculation fails', async () => {
        mockedDb.cart.findFirst.mockResolvedValue({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        } as any);

        mockedDb.cartItem.delete.mockResolvedValue({
          id: 'item-1',
        } as any);

        mockedDb.cartItem.findMany.mockRejectedValue(
          new Error('Cart recalculation failed')
        );

        const formData = createFormData({
          id: 'item-1',
        });

        const result = await removeCartItemAction(
          {},
          formData
        );

        expect(result).toEqual({
          message: 'Cart recalculation failed',
        });
      });
    });

    describe('updateCartItemAction', () => {
      it('returns an error when updating the cart item fails', async () => {
        mockedDb.cart.findFirst.mockResolvedValue({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        } as any);

        mockedDb.cartItem.update.mockRejectedValue(
          new Error('Cart item update failed')
        );

        const result = await updateCartItemAction({
          amount: 3,
          cartItemId: 'item-1',
        });

        expect(result).toEqual({
          message: 'Cart item update failed',
        });

        expect(mockedRevalidatePath).not.toHaveBeenCalled();
      });

      it('returns an error when cart recalculation fails', async () => {
        mockedDb.cart.findFirst.mockResolvedValue({
          id: 'cart-1',
          taxRate: 0.1,
          shipping: 10,
        } as any);

        mockedDb.cartItem.update.mockResolvedValue({
          id: 'item-1',
          amount: 3,
        } as any);

        mockedDb.cartItem.findMany.mockRejectedValue(
          new Error('Cart recalculation failed')
        );

        const result = await updateCartItemAction({
          amount: 3,
          cartItemId: 'item-1',
        });

        expect(result).toEqual({
          message: 'Cart recalculation failed',
        });
      });
    });

    describe('createOrderAction', () => {
      it('returns an error when fetching the cart fails', async () => {
        mockedDb.cart.findFirst.mockRejectedValue(
          new Error('Cart lookup failed')
        );

        const result = await createOrderAction(
          {},
          new FormData()
        );

        expect(result).toEqual({
          message: 'Cart lookup failed',
        });

        expect(mockedDb.order.deleteMany).not.toHaveBeenCalled();
        expect(mockedDb.order.create).not.toHaveBeenCalled();
      });

      it('returns an error when deleting unpaid orders fails', async () => {
        mockedDb.cart.findFirst.mockResolvedValue({
          id: 'cart-1',
          numItemsInCart: 2,
          orderTotal: 220,
          tax: 20,
          shipping: 10,
        } as any);

        mockedDb.order.deleteMany.mockRejectedValue(
          new Error('Order cleanup failed')
        );

        const result = await createOrderAction(
          {},
          new FormData()
        );

        expect(result).toEqual({
          message: 'Order cleanup failed',
        });

        expect(mockedDb.order.create).not.toHaveBeenCalled();
      });

      it('returns an error when order creation fails', async () => {
        mockedDb.cart.findFirst.mockResolvedValue({
          id: 'cart-1',
          numItemsInCart: 2,
          orderTotal: 220,
          tax: 20,
          shipping: 10,
        } as any);

        mockedDb.order.deleteMany.mockResolvedValue({
          count: 0,
        } as any);

        mockedDb.order.create.mockRejectedValue(
          new Error('Order creation failed')
        );

        const result = await createOrderAction(
          {},
          new FormData()
        );

        expect(result).toEqual({
          message: 'Order creation failed',
        });

        expect(mockedRedirect).not.toHaveBeenCalled();
      });
    });
  });

  describe('fetchAllProducts', () => {
  it('searches products by name and company', async () => {
    const products = [{ id: '1', name: 'Nike Shoes' }];

    mockedDb.product.findMany.mockResolvedValue(products as any);

    const result = await fetchAllProducts({
      search: 'nike',
    });

    expect(result).toEqual(products);

    expect(mockedDb.product.findMany).toHaveBeenCalledWith({
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
    const products = [
      {
        id: '1',
        name: 'Product 1',
      },
    ];

    mockedDb.product.findMany.mockResolvedValue(products as any);

    const result = await fetchAllProducts({} as any);

    expect(result).toEqual(products);

    expect(mockedDb.product.findMany).toHaveBeenCalledWith({
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
});

describe('fetchCartItems', () => {
  it('returns the number of items in the cart', async () => {
    mockedAuth.mockReturnValue({
      userId: 'user-123',
    } as any);

    mockedDb.cart.findFirst.mockResolvedValue({
      numItemsInCart: 4,
    } as any);

    const result = await fetchCartItems();

    expect(result).toBe(4);

    expect(mockedDb.cart.findFirst).toHaveBeenCalledWith({
      where: {
        clerkId: 'user-123',
      },
      select: {
        numItemsInCart: true,
      },
    });
  });

  it('returns zero when no cart exists', async () => {
    mockedDb.cart.findFirst.mockResolvedValue(null);

    const result = await fetchCartItems();

    expect(result).toBe(0);
  });

  it('uses an empty string when auth returns no userId', async () => {
    mockedAuth.mockReturnValue({
      userId: null,
    } as any);

    mockedDb.cart.findFirst.mockResolvedValue(null);

    const result = await fetchCartItems();

    expect(result).toBe(0);

    expect(mockedDb.cart.findFirst).toHaveBeenCalledWith({
      where: {
        clerkId: '',
      },
      select: {
        numItemsInCart: true,
      },
    });
  });
});

});