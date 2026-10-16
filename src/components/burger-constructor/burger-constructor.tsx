import {
  clearConstructor,
  selectConstructorState,
  selectTotalPrice,
} from '@/services/constructorSlice';
import {
  clearOrder,
  createOrderThunk,
  selectOrderModalData,
  selectOrderRequest,
} from '@/services/orderSlice';
import { useDispatch, useSelector } from '@/services/store';
import { selectUser } from '@/services/userSlice';
import { BurgerConstructorUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems = useSelector(selectConstructorState);
  const price = useSelector(selectTotalPrice);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrderThunk(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(() => undefined);
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
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
