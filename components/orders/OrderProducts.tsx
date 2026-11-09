type OrderProductLine = {
  id: string;
  productName: string;
  quantity: number;
};

function OrderProducts({
  items,
  legacyCount,
}: {
  items: OrderProductLine[];
  legacyCount: number;
}) {
  if (items.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>
        Product details unavailable ({legacyCount}{' '}
        {legacyCount === 1 ? 'item' : 'items'})
      </p>
    );
  }

  return (
    <ul className='space-y-1.5 text-sm'>
      {items.map(({ id, productName, quantity }) => (
        <li key={id} className='flex items-start justify-between gap-3'>
          <span className='min-w-0 break-words'>{productName}</span>
          <span className='shrink-0 text-xs text-muted-foreground'>
            Qty {quantity}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default OrderProducts;
