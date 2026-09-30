import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddToCart from '@/components/single-product/AddToCart';
import CartPage from '@/app/cart/page';
import CartTotals from '@/components/cart/CartTotals';
import ThirdColumn from '@/components/cart/ThirdColumn';
import CheckoutPage from '@/app/checkout/page';

import {
  addToCartAction,
  fetchOrCreateCart,
  updateCart,
  updateCartItemAction,
  removeCartItemAction,
  createOrderAction,
} from '@/utils/actions';

import { useAuth } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import {
  useSearchParams,
  redirect,
} from 'next/navigation';

import axios from 'axios';

/* -------------------------------------------------------------------------- */
/*                                   MOCKS                                    */
/* -------------------------------------------------------------------------- */

jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),

  SignInButton: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <>{children}</>,
}));

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),

  /*
   * Next.js redirect() terminates server-component execution.
   * Throwing here reproduces that behavior in Jest.
   */
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

jest.mock('@/utils/actions', () => ({
  addToCartAction: jest.fn(),
  fetchOrCreateCart: jest.fn(),
  updateCart: jest.fn(),
  updateCartItemAction: jest.fn(),
  removeCartItemAction: jest.fn(),
  createOrderAction: jest.fn(),
}));

/* -------------------------------------------------------------------------- */
/*                              FORM COMPONENTS                               */
/* -------------------------------------------------------------------------- */

jest.mock('@/components/form/Buttons', () => ({
  ProductSignInButton: () => (
    <button type="button">
      Please Sign In
    </button>
  ),

  SubmitButton: ({
    text,
    ...props
  }: {
    text: string;
    [key: string]: unknown;
  }) => (
    <button type="submit" {...props}>
      {text}
    </button>
  ),
}));

jest.mock('@/components/form/FormContainer', () => ({
  __esModule: true,

  default: ({
    children,
    action,
  }: {
    children: React.ReactNode;
    action?: (formData: FormData) => unknown;
  }) => (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (!action) return;

        const formData = new FormData(
          event.currentTarget,
        );

        void action(formData);
      }}
    >
      {children}
    </form>
  ),
}));

/* -------------------------------------------------------------------------- */
/*                         PRODUCT AMOUNT SELECT                             */
/* -------------------------------------------------------------------------- */

/*
 * The real SelectProductAmount uses Radix Select.
 *
 * This integration suite tests our application's behavior around the
 * selector, not Radix's internal implementation.
 *
 * A native select gives us the same contract:
 *
 * amount -> setAmount(value)
 */
jest.mock(
  '@/components/single-product/SelectProductAmount',
  () => ({
    __esModule: true,

    Mode: {
      SingleProduct: 'singleProduct',
      CartItem: 'cartItem',
    },

    default: ({
      amount,
      setAmount,
      mode,
      isLoading,
    }: {
      amount: number;
      setAmount: (
        value: number,
      ) => void | Promise<void>;
      mode: string;
      isLoading?: boolean;
    }) => {
      const isCartItem =
        mode === 'cartItem';

      const optionCount = isCartItem
        ? amount + 10
        : 10;

      return (
        <div>
          <label htmlFor="amount-selector">
            Amount :
          </label>

          <select
            id="amount-selector"
            aria-label="Amount"
            value={amount}
            disabled={isLoading}
            onChange={(event) => {
              void setAmount(
                Number(event.target.value),
              );
            }}
          >
            {Array.from(
              { length: optionCount },
              (_, index) => {
                const value = index + 1;

                return (
                  <option
                    key={value}
                    value={value}
                  >
                    {value}
                  </option>
                );
              },
            )}
          </select>
        </div>
      );
    },
  }),
);

/* -------------------------------------------------------------------------- */
/*                              CART COMPONENTS                               */
/* -------------------------------------------------------------------------- */

jest.mock(
  '@/components/global/SectionTitle',
  () => ({
    __esModule: true,

    default: ({
      text,
    }: {
      text: string;
    }) => <h1>{text}</h1>,
  }),
);

jest.mock(
  '@/components/cart/CartItemList',
  () => ({
    __esModule: true,

    default: ({
      cartItems,
    }: {
      cartItems: Array<{
        id: string;
        quantity: number;
        product: {
          name: string;
        };
      }>;
    }) => (
      <div data-testid="cart-items">
        {cartItems.map((item) => (
          <div key={item.id}>
            <span>
              {item.product.name}
            </span>

            <span
              data-testid={`quantity-${item.id}`}
            >
              {item.quantity}
            </span>
          </div>
        ))}
      </div>
    ),
  }),
);

/* -------------------------------------------------------------------------- */
/*                               UI MOCKS                                    */
/* -------------------------------------------------------------------------- */

jest.mock('@/components/ui/card', () => ({
  Card: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div>{children}</div>,

  CardTitle: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <h2>{children}</h2>,
}));

jest.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />,
}));

jest.mock('@/utils/format', () => ({
  formatCurrency: (amount: number) =>
    `$${amount.toFixed(2)}`,
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

jest.mock('@radix-ui/react-icons', () => ({
  ReloadIcon: () => <span>Loading</span>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <button {...props}>
      {children}
    </button>
  ),
}));

/* -------------------------------------------------------------------------- */
/*                              STRIPE MOCKS                                 */
/* -------------------------------------------------------------------------- */

jest.mock('axios');

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() =>
    Promise.resolve({
      id: 'stripe-test-instance',
    }),
  ),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  EmbeddedCheckoutProvider: ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <div data-testid="stripe-checkout-provider">
      {children}
    </div>
  ),

  EmbeddedCheckout: () => (
    <div data-testid="stripe-embedded-checkout">
      Stripe Embedded Checkout
    </div>
  ),
}));

/* -------------------------------------------------------------------------- */
/*                            MOCK REFERENCES                                */
/* -------------------------------------------------------------------------- */

const mockedUseAuth =
  useAuth as jest.Mock;

const mockedAuth =
  auth as jest.Mock;

const mockedRedirect =
  redirect as unknown as jest.Mock;

const mockedAddToCartAction =
  addToCartAction as jest.Mock;

const mockedFetchOrCreateCart =
  fetchOrCreateCart as jest.Mock;

const mockedUpdateCart =
  updateCart as jest.Mock;

const mockedUpdateCartItemAction =
  updateCartItemAction as jest.Mock;

const mockedRemoveCartItemAction =
  removeCartItemAction as jest.Mock;

const mockedCreateOrderAction =
  createOrderAction as jest.Mock;

const mockedUseSearchParams =
  useSearchParams as jest.Mock;

const mockedAxiosPost =
  axios.post as jest.Mock;

/* -------------------------------------------------------------------------- */
/*                             TEST FIXTURES                                 */
/* -------------------------------------------------------------------------- */

/*
 * Product fixture.
 */
const product = {
  id: 'product-1',
  name: 'Test Product',
  company: 'Test Company',
  description: 'Test product description',
  featured: false,
  image: '/test-product.jpg',
  price: 50,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/*
 * Cart item fixture.
 */
const cartItem = {
  id: 'cart-item-1',
  quantity: 2,
  product,
};

/*
 * IMPORTANT:
 *
 * CartTotals expects the complete Cart type:
 *
 * clerkId
 * numItemsInCart
 * cartTotal
 * shipping
 * tax
 * taxRate
 * orderTotal
 * createdAt
 * updatedAt
 */
const emptyCart = {
  id: 'cart-1',
  clerkId: 'user-1',
  numItemsInCart: 0,
  cartTotal: 0,
  shipping: 0,
  tax: 0,
  taxRate: 0.075,
  orderTotal: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const populatedCart = {
  id: 'cart-1',
  clerkId: 'user-1',
  numItemsInCart: 2,
  cartTotal: 100,
  shipping: 10,
  tax: 5,
  taxRate: 0.05,
  orderTotal: 115,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const updatedCart = {
  id: 'cart-1',
  clerkId: 'user-1',
  numItemsInCart: 3,
  cartTotal: 150,
  shipping: 10,
  tax: 7.5,
  taxRate: 0.05,
  orderTotal: 167.5,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const previousCart = {
  id: 'cart-1',
};

/* -------------------------------------------------------------------------- */
/*                               HELPERS                                    */
/* -------------------------------------------------------------------------- */

function authenticateUser() {
  mockedUseAuth.mockReturnValue({
    userId: 'user-1',
  });
}

function unauthenticateUser() {
  mockedUseAuth.mockReturnValue({
    userId: null,
  });
}

/* -------------------------------------------------------------------------- */
/*                         ADD TO CART INTEGRATION                           */
/* -------------------------------------------------------------------------- */

describe('Add to Cart Integration Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    authenticateUser();

    mockedAddToCartAction.mockResolvedValue({
      message: 'Product added to cart',
    });

    mockedUpdateCartItemAction.mockResolvedValue({
      message: 'Cart updated successfully',
    });

    mockedRemoveCartItemAction.mockResolvedValue({
      message: 'Product removed from cart',
    });

    mockedCreateOrderAction.mockResolvedValue({
      orderId: 'order-1',
      cartId: 'cart-1',
    });

    mockedFetchOrCreateCart.mockResolvedValue(
      previousCart,
    );
  });

  /* ====================================================================== */
  /*                           AUTHENTICATION                               */
  /* ====================================================================== */

  describe('authentication', () => {
    it('shows sign in instead of Add to Cart for an anonymous user', () => {
      unauthenticateUser();

      render(
        <AddToCart productId="product-1" />,
      );

      expect(
        screen.getByRole('button', {
          name: /please sign in/i,
        }),
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('button', {
          name: /add to cart/i,
        }),
      ).not.toBeInTheDocument();
    });

    it('shows Add to Cart for an authenticated user', () => {
      authenticateUser();

      render(
        <AddToCart productId="product-1" />,
      );

      expect(
        screen.getByRole('button', {
          name: /add to cart/i,
        }),
      ).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /*                           ADD TO CART                                  */
  /* ====================================================================== */

  describe('adding a product', () => {
    it('submits product ID and default quantity', async () => {
      authenticateUser();

      const user = userEvent.setup();

      render(
        <AddToCart productId="product-1" />,
      );

      await user.click(
        screen.getByRole('button', {
          name: /add to cart/i,
        }),
      );

      await waitFor(() => {
        expect(
          mockedAddToCartAction,
        ).toHaveBeenCalledTimes(1);
      });

      const formData =
        mockedAddToCartAction.mock
          .calls[0][0] as FormData;

      expect(
        formData.get('productId'),
      ).toBe('product-1');

      expect(
        formData.get('amount'),
      ).toBe('1');
    });

    it('submits the selected quantity when quantity is greater than one', async () => {
      authenticateUser();

      const user = userEvent.setup();

      render(
        <AddToCart productId="product-1" />,
      );

      const amountSelector =
        screen.getByRole('combobox', {
          name: /amount/i,
        });

      await user.selectOptions(
        amountSelector,
        '2',
      );

      expect(
        amountSelector,
      ).toHaveValue('2');

      await user.click(
        screen.getByRole('button', {
          name: /add to cart/i,
        }),
      );

      await waitFor(() => {
        expect(
          mockedAddToCartAction,
        ).toHaveBeenCalledTimes(1);
      });

      const formData =
        mockedAddToCartAction.mock
          .calls[0][0] as FormData;

      expect(
        formData.get('productId'),
      ).toBe('product-1');

      expect(
        formData.get('amount'),
      ).toBe('2');
    });
  });

  /* ====================================================================== */
  /*                           CART NAVIGATION                              */
  /* ====================================================================== */

  describe('cart navigation', () => {
    it('redirects unauthenticated users away from the cart', async () => {
      mockedAuth.mockReturnValue({
        userId: null,
      });

      await expect(
        CartPage(),
      ).rejects.toThrow('NEXT_REDIRECT');

      expect(
        mockedRedirect,
      ).toHaveBeenCalledWith('/');
    });

    it('renders the cart for an authenticated user', async () => {
      mockedAuth.mockReturnValue({
        userId: 'user-1',
      });

      mockedUpdateCart.mockResolvedValue({
        cartItems: [cartItem],
        currentCart: populatedCart,
      });

      const page =
        await CartPage();

      render(page);

      expect(
        screen.getByRole('heading', {
          name: /shopping cart/i,
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByText('Test Product'),
      ).toBeInTheDocument();

      expect(
        screen.getByTestId(
          'quantity-cart-item-1',
        ),
      ).toHaveTextContent('2');
    });

    it('shows Empty cart when no cart items remain', async () => {
      mockedAuth.mockReturnValue({
        userId: 'user-1',
      });

      mockedUpdateCart.mockResolvedValue({
        cartItems: [],
        currentCart: emptyCart,
      });

      const page =
        await CartPage();

      render(page);

      expect(
        screen.getByRole('heading', {
          name: /empty cart/i,
        }),
      ).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /*                         CART QUANTITY UPDATE                           */
  /* ====================================================================== */

  describe('quantity updates', () => {
    it('updates the cart item quantity', async () => {
      const user = userEvent.setup();

      render(
        <ThirdColumn
          quantity={2}
          id="cart-item-1"
        />,
      );

      const amountSelector =
        screen.getByRole('combobox', {
          name: /amount/i,
        });

      await user.selectOptions(
        amountSelector,
        '3',
      );

      await waitFor(() => {
        expect(
          mockedUpdateCartItemAction,
        ).toHaveBeenCalledWith({
          amount: 3,
          cartItemId: 'cart-item-1',
        });
      });
    });

    it('updates the displayed quantity after a successful update', async () => {
      const user = userEvent.setup();

      render(
        <ThirdColumn
          quantity={2}
          id="cart-item-1"
        />,
      );

      const amountSelector =
        screen.getByRole('combobox', {
          name: /amount/i,
        });

      await user.selectOptions(
        amountSelector,
        '3',
      );

      await waitFor(() => {
        expect(
          amountSelector,
        ).toHaveValue('3');
      });
    });
  });

  /* ====================================================================== */
  /*                              REMOVE ITEM                               */
  /* ====================================================================== */

  describe('removing a cart item', () => {
    it('submits the cart item ID to remove the item', async () => {
      const user = userEvent.setup();

      render(
        <ThirdColumn
          quantity={2}
          id="cart-item-1"
        />,
      );

      await user.click(
        screen.getByRole('button', {
          name: /remove/i,
        }),
      );

      await waitFor(() => {
        expect(
          mockedRemoveCartItemAction,
        ).toHaveBeenCalledTimes(1);
      });

      const formData =
        mockedRemoveCartItemAction.mock
          .calls[0][0] as FormData;

      expect(
        formData.get('id'),
      ).toBe('cart-item-1');
    });

    it('shows Empty cart after the final item is removed', async () => {
      mockedAuth.mockReturnValue({
        userId: 'user-1',
      });

      mockedUpdateCart.mockResolvedValue({
        cartItems: [],
        currentCart: emptyCart,
      });

      const page =
        await CartPage();

      render(page);

      expect(
        screen.getByRole('heading', {
          name: /empty cart/i,
        }),
      ).toBeInTheDocument();

      expect(
        screen.queryByText('Test Product'),
      ).not.toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /*                              CART TOTALS                               */
  /* ====================================================================== */

  describe('cart totals', () => {
    it('displays subtotal, shipping, tax and order total', () => {
      render(
        <CartTotals cart={populatedCart} />,
      );

      expect(
        screen.getByText('Subtotal'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('Shipping'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('Tax'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('Order Total'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('$100.00'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('$10.00'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('$5.00'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('$115.00'),
      ).toBeInTheDocument();
    });

    it('reflects the recalculated totals after a quantity change', () => {
      const { rerender } = render(
        <CartTotals
          cart={populatedCart}
        />,
      );

      expect(
        screen.getByText('$115.00'),
      ).toBeInTheDocument();

      rerender(
        <CartTotals
          cart={updatedCart}
        />,
      );

      expect(
        screen.getByText('$150.00'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('$167.50'),
      ).toBeInTheDocument();

      expect(
        screen.queryByText('$115.00'),
      ).not.toBeInTheDocument();
    });

    it('shows zero totals when the cart is empty', () => {
      render(
        <CartTotals cart={emptyCart} />,
      );

      /*
       * Subtotal
       * Shipping
       * Tax
       * Order Total
       *
       * = four $0.00 values.
       */
      expect(
        screen.getAllByText('$0.00'),
      ).toHaveLength(4);
    });
  });

  /* ====================================================================== */
  /*                              PLACE ORDER                               */
  /* ====================================================================== */

  describe('placing an order', () => {
    it('submits the Place Order action', async () => {
      const user = userEvent.setup();

      render(
        <CartTotals
          cart={populatedCart}
        />,
      );

      await user.click(
        screen.getByRole('button', {
          name: /place order/i,
        }),
      );

      await waitFor(() => {
        expect(
          mockedCreateOrderAction,
        ).toHaveBeenCalledTimes(1);
      });
    });
  });

  /* ====================================================================== */
  /*                               CHECKOUT                                 */
  /* ====================================================================== */

  describe('checkout', () => {
    beforeEach(() => {
      mockedUseSearchParams.mockReturnValue({
        get: (key: string) => {
          if (key === 'orderId') {
            return 'order-1';
          }

          if (key === 'cartId') {
            return 'cart-1';
          }

          return null;
        },
      });

      mockedAxiosPost.mockResolvedValue({
        data: {
          clientSecret:
            'test_client_secret',
        },
      });
    });

    it('renders the Stripe embedded checkout', () => {
      render(
        <CheckoutPage />,
      );

      expect(
        screen.getByTestId(
          'stripe-embedded-checkout',
        ),
      ).toBeInTheDocument();
    });

    it('renders the Stripe checkout provider', () => {
      render(
        <CheckoutPage />,
      );

      expect(
        screen.getByTestId(
          'stripe-checkout-provider',
        ),
      ).toBeInTheDocument();
    });
  });

  /* ====================================================================== */
  /*                        COMPLETE USER JOURNEY                            */
  /* ====================================================================== */

  describe('complete add-to-cart journey', () => {
    it('completes product -> cart -> quantity -> order -> checkout', async () => {
      const user = userEvent.setup();

      /* ----------------------------- PRODUCT ----------------------------- */

      authenticateUser();

      render(
        <AddToCart
          productId="product-1"
        />,
      );

      const amountSelector =
        screen.getByRole('combobox', {
          name: /amount/i,
        });

      await user.selectOptions(
        amountSelector,
        '2',
      );

      expect(
        amountSelector,
      ).toHaveValue('2');

      /* ---------------------------- ADD CART ----------------------------- */

      await user.click(
        screen.getByRole('button', {
          name: /add to cart/i,
        }),
      );

      await waitFor(() => {
        expect(
          mockedAddToCartAction,
        ).toHaveBeenCalledTimes(1);
      });

      const addFormData =
        mockedAddToCartAction.mock
          .calls[0][0] as FormData;

      expect(
        addFormData.get('productId'),
      ).toBe('product-1');

      expect(
        addFormData.get('amount'),
      ).toBe('2');

      /* ------------------------------- CART ------------------------------ */

      mockedAuth.mockReturnValue({
        userId: 'user-1',
      });

      mockedUpdateCart.mockResolvedValue({
        cartItems: [cartItem],
        currentCart: populatedCart,
      });

      const cartPage =
        await CartPage();

      const {
        unmount,
      } = render(cartPage);

      expect(
        screen.getByText('Test Product'),
      ).toBeInTheDocument();

      expect(
        screen.getByTestId(
          'quantity-cart-item-1',
        ),
      ).toHaveTextContent('2');

      unmount();

      /* ----------------------------- TOTALS ------------------------------ */

      render(
        <CartTotals
          cart={populatedCart}
        />,
      );

      expect(
        screen.getByText('$100.00'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('$115.00'),
      ).toBeInTheDocument();

      /* --------------------------- PLACE ORDER --------------------------- */

      await user.click(
        screen.getByRole('button', {
          name: /place order/i,
        }),
      );

      await waitFor(() => {
        expect(
          mockedCreateOrderAction,
        ).toHaveBeenCalledTimes(1);
      });

      /* ----------------------------- CHECKOUT ---------------------------- */

      mockedUseSearchParams.mockReturnValue({
        get: (key: string) => {
          if (key === 'orderId') {
            return 'order-1';
          }

          if (key === 'cartId') {
            return 'cart-1';
          }

          return null;
        },
      });

      mockedAxiosPost.mockResolvedValue({
        data: {
          clientSecret:
            'test_client_secret',
        },
      });

      render(
        <CheckoutPage />,
      );

      expect(
        screen.getByTestId(
          'stripe-checkout-provider',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByTestId(
          'stripe-embedded-checkout',
        ),
      ).toBeInTheDocument();
    });
  });
});