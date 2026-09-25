import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';

import FavoriteToggleForm from '@/components/products/FavoriteToggleForm';
import { toggleFavoriteAction } from '@/utils/actions';

import FormContainer from '@/components/form/FormContainer';
import { CardSubmitButton } from '@/components/form/Buttons';

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

jest.mock('@/utils/actions', () => ({
    toggleFavoriteAction: jest.fn(),
}));

jest.mock('@/components/form/FormContainer', () => ({
    __esModule: true,
    default: jest.fn(({ action, children }) => (
        <form data-testid='form-container' action={action}>
            {children}
        </form>
    )),
}));

jest.mock('@/components/form/Buttons', () => ({
    CardSubmitButton: jest.fn(({ isFavorite }) => (
        <button
            type='submit'
            data-testid='card-submit-button'
            data-is-favorite={isFavorite}
        >
            {isFavorite ? 'Favorite' : 'Not Favorite'}
        </button>
    )),
}));

const mockedUsePathname = jest.mocked(usePathname);
const mockedToggleFavoriteAction = jest.mocked(toggleFavoriteAction);
const mockedFormContainer = jest.mocked(FormContainer);
const mockedCardSubmitButton = jest.mocked(CardSubmitButton);

describe('FavoriteToggleForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockedUsePathname.mockReturnValue('/products/product-123');

        mockedToggleFavoriteAction.mockImplementation(
            jest.fn() as typeof toggleFavoriteAction
        );
    });

    describe('rendering', () => {
        it('renders the FormContainer', () => {
            render(
                <FavoriteToggleForm
                    productId='product-123'
                    favoriteId={null}
                />
            );

            expect(screen.getByTestId('form-container')).toBeInTheDocument();
        });

        it('renders the CardSubmitButton inside the FormContainer', () => {
            render(
                <FavoriteToggleForm
                    productId='product-123'
                    favoriteId={null}
                />
            );

            expect(
                screen.getByTestId('card-submit-button')
            ).toBeInTheDocument();
        });
    });

    describe('pathname', () => {
        it('gets the current pathname using usePathname', () => {
            mockedUsePathname.mockReturnValue('/products');

            render(
                <FavoriteToggleForm
                    productId='product-123'
                    favoriteId={null}
                />
            );

            expect(mockedUsePathname).toHaveBeenCalledTimes(1);
        });
    });

    describe('bind action', () => {
        it('passes the productId, favoriteId, and pathname to the action', async () => {
            const productId = 'product-123';
            const favoriteId = 'favorite-456';
            const pathname = '/products/product-123';
            const actionMock = jest.fn();

            mockedToggleFavoriteAction.mockImplementation(
                actionMock as typeof toggleFavoriteAction
            );

            mockedUsePathname.mockReturnValue(pathname);

            render(
                <FavoriteToggleForm
                    productId={productId}
                    favoriteId={favoriteId}
                />
            );

            const { action } = mockedFormContainer.mock.calls[0][0];

            await action({}, new FormData());
            expect(actionMock.mock.calls[0][0]).toEqual({
                productId,
                favoriteId,
                pathname,
            });
        });

        it('passes null as favoriteId when the product is not favorited', async () => {
            const productId = 'product-123';
            const pathname = '/products/product-123';
            const actionMock = jest.fn();

            mockedToggleFavoriteAction.mockImplementation(
                actionMock as typeof toggleFavoriteAction
            );

            mockedUsePathname.mockReturnValue(pathname);

            render(
                <FavoriteToggleForm
                    productId={productId}
                    favoriteId={null}
                />
            );

            const { action } = mockedFormContainer.mock.calls[0][0];

            await action({}, new FormData());

            expect(actionMock.mock.calls[0][0]).toEqual({
                productId,
                favoriteId: null,
                pathname,
            });
        });
    });

    describe('favorite state', () => {
        it('passes true to CardSubmitButton when favoriteId exists', () => {
            render(
                <FavoriteToggleForm
                    productId='product-123'
                    favoriteId='favorite-456'
                />
            );

            expect(mockedCardSubmitButton).toHaveBeenCalledWith(
                { isFavorite: true },
                expect.anything()
            );

            expect(screen.getByTestId('card-submit-button')).toHaveAttribute(
                'data-is-favorite',
                'true'
            );
        });

        it('passes false to CardSubmitButton when favoriteId is null', () => {
            render(
                <FavoriteToggleForm
                    productId='product-123'
                    favoriteId={null}
                />
            );

            expect(mockedCardSubmitButton).toHaveBeenCalledWith(
                { isFavorite: false },
                expect.anything()
            );

            expect(screen.getByTestId('card-submit-button')).toHaveAttribute(
                'data-is-favorite',
                'false'
            );
        });
    });

    describe('form action', () => {
        it('passes the bound toggle action to FormContainer', () => {
            render(
                <FavoriteToggleForm
                    productId='product-123'
                    favoriteId='favorite-456'
                />
            );

            expect(mockedFormContainer).toHaveBeenCalledTimes(1);

            const formContainerProps = mockedFormContainer.mock.calls[0][0];

            expect(formContainerProps.action).toEqual(
                expect.any(Function)
            );
        });

        // it('binds the action using the current product, favorite, and pathname', () => {
        //   const productId = 'product-123';
        //   const favoriteId = 'favorite-456';
        //   const pathname = '/products/product-123';

        //   mockedUsePathname.mockReturnValue(pathname);

        //   render(
        //     <FavoriteToggleForm
        //       productId={productId}
        //       favoriteId={favoriteId}
        //     />
        //   );

        //   const formContainerProps = mockedFormContainer.mock.calls[0][0];

        //   expect(formContainerProps.action).toEqual(
        //     expect.any(Function)
        //   );

        //   expect(mockedToggleFavoriteAction).toHaveBeenCalledWith({
        //     productId,
        //     favoriteId,
        //     pathname,
        //   });
        // });

        it('binds productId, favoriteId, and pathname to the toggle action', async () => {
            const actionMock = jest.fn();

            mockedToggleFavoriteAction.mockImplementation(
                actionMock as typeof toggleFavoriteAction
            );

            mockedUsePathname.mockReturnValue('/products/product-123');

            render(
                <FavoriteToggleForm
                    productId='product-123'
                    favoriteId='favorite-456'
                />
            );

            const { action } = mockedFormContainer.mock.calls[0][0];

            await action({}, new FormData());

            expect(actionMock.mock.calls[0][0]).toEqual({
                productId: 'product-123',
                favoriteId: 'favorite-456',
                pathname: '/products/product-123',
            });
        });
    });
});