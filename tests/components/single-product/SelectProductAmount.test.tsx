import { render, screen, fireEvent } from '@testing-library/react';
import SelectProductAmount, { Mode } from '@/components/single-product/SelectProductAmount';

describe('SelectProductAmount', () => {
  describe('SingleProduct mode', () => {
    const setAmount = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders the amount heading', () => {
      render(
        <SelectProductAmount
          mode={Mode.SingleProduct}
          amount={2}
          setAmount={setAmount}
        />
      );

      expect(screen.getByText('Amount :')).toBeInTheDocument();
    });

    it('renders the current amount as the default selected value', () => {
      render(
        <SelectProductAmount
          mode={Mode.SingleProduct}
          amount={3}
          setAmount={setAmount}
        />
      );

      expect(screen.getByRole('combobox')).toHaveTextContent('3');
    });

    it('renders a select trigger with the single product width', () => {
      render(
        <SelectProductAmount
          mode={Mode.SingleProduct}
          amount={2}
          setAmount={setAmount}
        />
      );

      expect(screen.getByRole('combobox')).toHaveClass('w-[150px]');
    });

    it('is enabled in single product mode', () => {
      render(
        <SelectProductAmount
          mode={Mode.SingleProduct}
          amount={2}
          setAmount={setAmount}
        />
      );

      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    it('renders 10 amount options in single product mode', () => {
      render(
        <SelectProductAmount
          mode={Mode.SingleProduct}
          amount={2}
          setAmount={setAmount}
        />
      );

      fireEvent.click(screen.getByRole('combobox'));

      for (let amount = 1; amount <= 10; amount++) {
        expect(
          screen.getByRole('option', { name: amount.toString() })
        ).toBeInTheDocument();
      }

      expect(screen.getAllByRole('option')).toHaveLength(10);
    });

    it('calls setAmount with the selected numeric value', () => {
      render(
        <SelectProductAmount
          mode={Mode.SingleProduct}
          amount={2}
          setAmount={setAmount}
        />
      );

      fireEvent.click(screen.getByRole('combobox'));

      fireEvent.click(screen.getByRole('option', { name: '5' }));

      expect(setAmount).toHaveBeenCalledWith(5);
    });
  });

  describe('CartItem mode', () => {
    const setAmount = jest.fn().mockResolvedValue(undefined);

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders the current amount as the default selected value', () => {
      render(
        <SelectProductAmount
          mode={Mode.CartItem}
          amount={3}
          setAmount={setAmount}
          isLoading={false}
        />
      );

      expect(screen.getByRole('combobox')).toHaveTextContent('3');
    });

    it('renders a select trigger with the cart item width', () => {
      render(
        <SelectProductAmount
          mode={Mode.CartItem}
          amount={3}
          setAmount={setAmount}
          isLoading={false}
        />
      );

      expect(screen.getByRole('combobox')).toHaveClass('w-[100px]');
    });

    it('is enabled when the cart item is not loading', () => {
      render(
        <SelectProductAmount
          mode={Mode.CartItem}
          amount={3}
          setAmount={setAmount}
          isLoading={false}
        />
      );

      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    it('is disabled when the cart item is loading', () => {
      render(
        <SelectProductAmount
          mode={Mode.CartItem}
          amount={3}
          setAmount={setAmount}
          isLoading={true}
        />
      );

      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('renders amount + 10 options in cart item mode', () => {
      render(
        <SelectProductAmount
          mode={Mode.CartItem}
          amount={3}
          setAmount={setAmount}
          isLoading={false}
        />
      );

      fireEvent.click(screen.getByRole('combobox'));

      expect(screen.getAllByRole('option')).toHaveLength(13);

      for (let value = 1; value <= 13; value++) {
        expect(
          screen.getByRole('option', { name: value.toString() })
        ).toBeInTheDocument();
      }
    });

    it('calls setAmount with the selected numeric value', () => {
      render(
        <SelectProductAmount
          mode={Mode.CartItem}
          amount={3}
          setAmount={setAmount}
          isLoading={false}
        />
      );

      fireEvent.click(screen.getByRole('combobox'));

      fireEvent.click(screen.getByRole('option', { name: '8' }));

      expect(setAmount).toHaveBeenCalledWith(8);
    });

    it('does not allow changing the amount while loading', () => {
      render(
        <SelectProductAmount
          mode={Mode.CartItem}
          amount={3}
          setAmount={setAmount}
          isLoading={true}
        />
      );

      expect(screen.getByRole('combobox')).toBeDisabled();

      expect(setAmount).not.toHaveBeenCalled();
    });
  });
});