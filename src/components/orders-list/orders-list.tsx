import { OrdersListUI } from '@ui';
import { memo, useState, useEffect, useRef } from 'react';

import type { OrdersListProps } from './type';

export const OrdersList = memo(function OrdersList({
  orders,
  onOrderClick,
}: OrdersListProps): React.JSX.Element {
  const [newOrderNumbers, setNewOrderNumbers] = useState<number[]>([]);
  const prevOrderNumbersRef = useRef<Set<number>>(new Set());
  const isFirstRender = useRef(true);

  useEffect(() => {
    const currentNumbers = orders.map((order) => order.number);
    const currentSet = new Set(currentNumbers);

    if (isFirstRender.current) {
      prevOrderNumbersRef.current = currentSet;
      isFirstRender.current = false;
      return;
    }

    const newNumbers = currentNumbers.filter(
      (num) => !prevOrderNumbersRef.current.has(num)
    );

    let timeout: ReturnType<typeof setTimeout>;

    if (newNumbers.length > 0) {
      setNewOrderNumbers(newNumbers);
      prevOrderNumbersRef.current = currentSet;

      timeout = setTimeout(() => {
        setNewOrderNumbers([]);
      }, 5000);
    } else {
      prevOrderNumbersRef.current = currentSet;
    }

    const cleanup = (): void => {
      clearTimeout(timeout);
    };

    return cleanup;
  }, [orders]);

  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <OrdersListUI
      orderByDate={orderByDate}
      onOrderClick={onOrderClick}
      newOrderNumbers={newOrderNumbers}
    />
  );
});
