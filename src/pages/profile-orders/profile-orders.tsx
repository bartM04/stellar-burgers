import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { fetchOrders } from '../../services/slices/ordersSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    void dispatch(fetchOrders());
  }, [dispatch]);

  const handleOrderClick = (orderNumber: number): void => {
    navigate(`/profile/orders/${orderNumber}`, {
      state: { background: location },
    });
  };

  return (
    <ProfileOrdersUI
      orders={orders}
      isLoading={isLoading}
      onOrderClick={handleOrderClick}
    />
  );
};
