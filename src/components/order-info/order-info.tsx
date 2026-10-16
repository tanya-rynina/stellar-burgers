import { selectFeedOrders } from '@/services/feedSlice';
import { selectIngredients } from '@/services/ingredientsSlice';
import {
  clearCurrentOrder,
  fetchOrderByNumber,
  selectCurrentOrder,
  selectCurrentOrderLoading,
} from '@/services/orderSlice';
import { selectProfileOrders } from '@/services/profileOrdersSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const isCurrentOrderLoading = useSelector(selectCurrentOrderLoading);
  const ingredients = useSelector(selectIngredients);

  const dispatch = useDispatch();

  /** Ищем заказ в ленте или в истории — там данные уже есть после REST-запросов */
  const orderFromStore = useMemo(
    () =>
      feedOrders.find((order) => order.number === orderNumber) ??
      profileOrders.find((order) => order.number === orderNumber) ??
      null,
    [feedOrders, profileOrders, orderNumber]
  );

  /** Если в сторе нет — запрашиваем с сервера по номеру */
  useEffect(() => {
    if (!orderFromStore && Number.isFinite(orderNumber)) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderFromStore, orderNumber]);

  /** Чистим currentOrder при закрытии модалки (размонтирование) */
  useEffect(
    () => (): void => {
      dispatch(clearCurrentOrder());
    },
    [dispatch]
  );

  const orderData = orderFromStore ?? currentOrder;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
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
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    if (isCurrentOrderLoading || !orderData) {
      return <Preloader />;
    }
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
