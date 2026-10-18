import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { fetchOrderDetails } from '../../services/slices/orderDetailsSlice';
import { useSelector, useDispatch } from '../../services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const orderData = useSelector((state) => state.orderDetails.order);
  const isLoading = useSelector((state) => state.orderDetails.isLoading);

  const feedOrders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    if (!number) return;

    const orderNumber = Number(number);

    const foundInFeed = feedOrders.find((order) => order.number === orderNumber);
    const foundInUserOrders = userOrders.find((order) => order.number === orderNumber);

    if (!orderData && !foundInFeed && !foundInUserOrders) {
      void dispatch(fetchOrderDetails(orderNumber));
    }
  }, [dispatch, number, orderData, feedOrders, userOrders]);

  const orderInfo = useMemo(() => {
    const orderNumber = number ? Number(number) : null;

    const targetOrder = orderNumber
      ? (feedOrders.find((order) => order.number === orderNumber) ??
        userOrders.find((order) => order.number === orderNumber) ??
        orderData)
      : orderData;

    if (!targetOrder || !ingredients?.length) return null;

    const date = new Date(targetOrder.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = targetOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...targetOrder,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients, number, feedOrders, userOrders]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
