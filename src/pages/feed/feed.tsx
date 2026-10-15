import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feedSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, isLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    dispatch(fetchFeed());
  };

  const handleOrderClick = (orderNumber: number): void => {
    navigate(`/feed/${orderNumber}`, {
      state: { background: location },
    });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={handleGetFeeds}
      onOrderClick={handleOrderClick}
    />
  );
};