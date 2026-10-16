import { fetchProfileOrders, selectProfileOrders } from '@/services/profileOrdersSlice';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

const PROFILE_ORDERS_REFRESH_INTERVAL = 5000;

export const ProfileOrders = (): React.JSX.Element => {
  const orders = useSelector(selectProfileOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(fetchProfileOrders());
    const timerId = setInterval(() => {
      void dispatch(fetchProfileOrders());
    }, PROFILE_ORDERS_REFRESH_INTERVAL);
    return (): void => {
      clearInterval(timerId);
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
