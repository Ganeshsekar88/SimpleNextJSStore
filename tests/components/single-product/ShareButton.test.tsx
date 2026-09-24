import { render, screen, fireEvent } from '@testing-library/react';
import ShareButton from '@/components/single-product/ShareButton';

// Mock the shadcn Popover components
jest.mock('@/components/ui/popover', () => ({
    Popover: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),

    PopoverTrigger: ({
        children,
        asChild,
    }: {
        children: React.ReactNode;
        asChild?: boolean;
    }) => <div data-testid="popover-trigger">{children}</div>,

    PopoverContent: ({
        children,
    }: {
        children: React.ReactNode;
    }) => <div data-testid="popover-content">{children}</div>,
}));

// Mock Button
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

// Mock react-icons
jest.mock('react-icons/lu', () => ({
    LuShare2: () => <span data-testid="share-icon" />,
}));

// Mock react-share
jest.mock('react-share', () => ({
    LinkedinShareButton: ({
        children,
        url,
        title,
    }: {
        children: React.ReactNode;
        url: string;
        title: string;
    }) => (
        <div
            data-testid="linkedin-share"
            data-url={url}
            data-title={title}
        >
            {children}
        </div>
    ),

    LinkedinIcon: ({
        size,
        round,
    }: {
        size: number;
        round: boolean;
    }) => (
        <span
            data-testid="linkedin-icon"
            data-size={size}
            data-round={round}
        />
    ),

    EmailShareButton: ({
        children,
        url,
        subject,
    }: {
        children: React.ReactNode;
        url: string;
        subject: string;
    }) => (
        <div
            data-testid="email-share"
            data-url={url}
            data-subject={subject}
        >
            {children}
        </div>
    ),

    EmailIcon: ({
        size,
        round,
    }: {
        size: number;
        round: boolean;
    }) => (
        <span
            data-testid="email-icon"
            data-size={size}
            data-round={round}
        />
    ),
}));

describe('ShareButton', () => {
    const productId = 'product-123';
    const productName = 'Awesome Product';

    beforeEach(() => {
        process.env.NEXT_PUBLIC_WEBSITE_URL = 'https://example.com';
    });

    it('renders the share button', () => {
        render(
            <ShareButton
                productId={productId}
                name={productName}
            />
        );

        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByTestId('share-icon')).toBeInTheDocument();
    });

    it('shows the sharing options when the share button is clicked', () => {
        render(
            <ShareButton
                productId="product-123"
                name="Awesome Product"
            />
        );

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByTestId('linkedin-share')).toBeInTheDocument();
        expect(screen.getByTestId('email-share')).toBeInTheDocument();
    });

    it('renders the LinkedIn share button with the correct URL and title', () => {
        render(
            <ShareButton
                productId={productId}
                name={productName}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        const linkedinShare = screen.getByTestId('linkedin-share');

        expect(linkedinShare).toHaveAttribute(
            'data-url',
            'https://example.com/products/product-123'
        );

        expect(linkedinShare).toHaveAttribute(
            'data-title',
            productName
        );
    });

    it('renders the Email share button with the correct URL and subject', () => {
        render(
            <ShareButton
                productId={productId}
                name={productName}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        const emailShare = screen.getByTestId('email-share');

        expect(emailShare).toHaveAttribute(
            'data-url',
            'https://example.com/products/product-123'
        );

        expect(emailShare).toHaveAttribute(
            'data-subject',
            productName
        );
    });

    it('renders the LinkedIn and Email icons with the correct props', () => {
        render(
            <ShareButton
                productId={productId}
                name={productName}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByTestId('linkedin-icon')).toHaveAttribute(
            'data-size',
            '32'
        );

        expect(screen.getByTestId('linkedin-icon')).toHaveAttribute(
            'data-round',
            'true'
        );

        expect(screen.getByTestId('email-icon')).toHaveAttribute(
            'data-size',
            '32'
        );

        expect(screen.getByTestId('email-icon')).toHaveAttribute(
            'data-round',
            'true'
        );
    });

    it('renders exactly two share options', () => {
        render(
            <ShareButton
                productId={productId}
                name={productName}
            />
        );

        fireEvent.click(screen.getByRole('button'));

        expect(
            screen.getAllByTestId(/-share$/)
        ).toHaveLength(2);
    });
});