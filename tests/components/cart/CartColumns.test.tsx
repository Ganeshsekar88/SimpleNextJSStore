import { render, screen } from '@testing-library/react';
import {
  FirstColumn,
  SecondColumn,
  FourthColumn,
} from '@/components/cart/CartItemColumns';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    fill,
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
  }) => <img {...props} />,
}));


describe('FirstColumn', () => {
  it('renders the product image', () => {
    render(
      <FirstColumn
        name='Nike Shoes'
        image='/images/nike.jpg'
      />
    );

    expect(
      screen.getByRole('img', {
        name: 'Nike Shoes',
      })
    ).toBeInTheDocument();
  });
});

describe('SecondColumn', () => {
  it('renders the product information', () => {
    render(
      <SecondColumn
        name='Nike Shoes'
        company='Nike'
        productId='123'
      />
    );

    expect(
      screen.getByRole('heading', {
        name: 'Nike Shoes',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Nike')
    ).toBeInTheDocument();
  });

  it('links the product name to the product page', () => {
    render(
      <SecondColumn
        name='Nike Shoes'
        company='Nike'
        productId='123'
      />
    );

    expect(
      screen.getByRole('link', {
        name: 'Nike Shoes',
      })
    ).toHaveAttribute('href', '/products/123');
  });
});

describe('FourthColumn', () => {
  it('renders the formatted price', () => {
    render(<FourthColumn price={115} />);

    expect(
      screen.getByText('$115.00')
    ).toBeInTheDocument();
  });

  it('renders decimal prices correctly', () => {
    render(<FourthColumn price={115.5} />);

    expect(
      screen.getByText('$115.50')
    ).toBeInTheDocument();
  });
});