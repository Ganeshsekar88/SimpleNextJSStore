import { render, screen } from '@testing-library/react';
import FavoriteToggleButton from '@/components/products/FavoriteToggleButton';
import { auth } from '@clerk/nextjs/server';
import { fetchFavoriteId } from '@/utils/actions';

jest.mock('@clerk/nextjs/server', () => ({
    auth: jest.fn(),
}));

jest.mock('@/utils/actions', () => ({
    fetchFavoriteId: jest.fn(),
}));

jest.mock('@/components/form/Buttons', () => ({
    CardSignInButton: () => (
        <button data-testid='card-sign-in-button'>
            Sign In
        </button>
    ),
}));

jest.mock('@/components/products/FavoriteToggleForm', () => ({
    __esModule: true,
    default: ({
        productId,
        favoriteId,
    }: {
        productId: string;
        favoriteId: string | null;
    }) => (
        <div data-testid='favorite-toggle-form'>
            <span data-testid='product-id'>{productId}</span>
            <span data-testid='favorite-id'>
                {favoriteId ?? 'null'}
            </span>
        </div>
    ),
}));

describe('FavoriteToggleButton', () => {
    const mockedAuth = auth as jest.Mock;
    const mockedFetchFavoriteId = fetchFavoriteId as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('when the user is not authenticated', () => {
        it('renders the CardSignInButton', async () => {
            mockedAuth.mockReturnValue({
                userId: null,
            });

            const result = await FavoriteToggleButton({
                productId: 'product-123',
            });

            render(result);

            expect(
                screen.getByTestId('card-sign-in-button')
            ).toBeInTheDocument();
        });

        it('does not fetch the favorite id', async () => {
            mockedAuth.mockReturnValue({
                userId: null,
            });

            const result = await FavoriteToggleButton({
                productId: 'product-123',
            });

            render(result);

            expect(mockedFetchFavoriteId).not.toHaveBeenCalled();
        });
    });

    describe('when the user is authenticated', () => {
        beforeEach(() => {
            mockedAuth.mockReturnValue({
                userId: 'user-123',
            });
        });

        it('fetches the favorite id using the product id', async () => {
            mockedFetchFavoriteId.mockResolvedValue('favorite-456');

            const result = await FavoriteToggleButton({
                productId: 'product-123',
            });

            render(result);

            expect(mockedFetchFavoriteId).toHaveBeenCalledTimes(1);
            expect(mockedFetchFavoriteId).toHaveBeenCalledWith({
                productId: 'product-123',
            });
        });

        it('renders FavoriteToggleForm with the returned favorite id', async () => {
            mockedFetchFavoriteId.mockResolvedValue('favorite-456');

            const result = await FavoriteToggleButton({
                productId: 'product-123',
            });

            render(result);

            expect(
                screen.getByTestId('favorite-toggle-form')
            ).toBeInTheDocument();

            expect(screen.getByTestId('product-id')).toHaveTextContent(
                'product-123'
            );

            expect(screen.getByTestId('favorite-id')).toHaveTextContent(
                'favorite-456'
            );
        });

        it('renders FavoriteToggleForm with null when the product is not favorited', async () => {
            mockedFetchFavoriteId.mockResolvedValue(null);

            const result = await FavoriteToggleButton({
                productId: 'product-123',
            });

            render(result);

            expect(
                screen.getByTestId('favorite-toggle-form')
            ).toBeInTheDocument();

            expect(screen.getByTestId('product-id')).toHaveTextContent(
                'product-123'
            );

            expect(screen.getByTestId('favorite-id')).toHaveTextContent(
                'null'
            );
        });

        it('renders FavoriteToggleForm instead of CardSignInButton when the user is logged in', async () => {
            mockedAuth.mockReturnValue({
                userId: 'user-123',
            });

            mockedFetchFavoriteId.mockResolvedValue(null);

            const result = await FavoriteToggleButton({
                productId: 'product-123',
            });

            render(result);

            expect(
                screen.queryByTestId('card-sign-in-button')
            ).not.toBeInTheDocument();

            expect(
                screen.getByTestId('favorite-toggle-form')
            ).toBeInTheDocument();
        });
    });
});