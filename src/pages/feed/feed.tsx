import { fetchFeed, selectFeedLoading, selectFeedOrders } from '@/services/feedSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useCallback, useEffect } from 'react';

const FEED_REFRESH_INTERVAL = 5000;

export const Feed = (): React.JSX.Element => {
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  const dispatch = useDispatch();

  const handleGetFeeds = useCallback((): void => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  useEffect(() => {
    handleGetFeeds();
    const timerId = setInterval(handleGetFeeds, FEED_REFRESH_INTERVAL);
    return (): void => {
      clearInterval(timerId);
    };
  }, [handleGetFeeds]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
