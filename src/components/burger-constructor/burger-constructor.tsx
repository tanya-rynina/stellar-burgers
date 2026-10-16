import { selectConstructorState, selectTotalPrice } from '@/services/constructorSlice';
import { useSelector } from '@/services/store';
import { BurgerConstructorUI } from '@ui';

import type { TOrder } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems = useSelector(selectConstructorState);
  const price = useSelector(selectTotalPrice);

  // TODO (Шаг 4): orderRequest и orderModalData подключим после создания orderSlice
  const orderRequest = false;
  const orderModalData: TOrder | null = null;

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    // TODO (Шаг 4): Оформить заказ
  };

  const closeOrderModal = (): void => {
    // TODO (Шаг 4): Закрыть модальное окно и сбросить заказ
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
