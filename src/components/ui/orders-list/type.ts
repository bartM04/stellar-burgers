import type { TOrder } from '@utils-types';

export type OrdersListUIProps = {
  orderByDate: TOrder[];
  onOrderClick: (orderNumber: number) => void;
  newOrderNumbers?: number[];
};
