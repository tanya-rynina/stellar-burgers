import { fetchIngredients } from '@/services/ingredientsSlice';
import { useDispatch } from '@/services/store';
import {
  AppHeader,
  Modal,
  IngredientDetails,
  OrderInfo,
  ProtectedRoute,
} from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import type { ReactNode } from 'react';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

type TModalRouteProps = {
  title?: string;
  children: ReactNode;
};

const ModalRoute = ({ title, children }: TModalRouteProps): React.JSX.Element => {
  const navigate = useNavigate();

  const handleClose = (): void => {
    void navigate(-1);
  };

  return (
    <Modal title={title ?? ''} onClose={handleClose}>
      {children}
    </Modal>
  );
};

type TAppLocationState = {
  background?: Location;
};

const App = (): React.JSX.Element => {
  const location = useLocation();
  const state = location.state as TAppLocationState | null;
  const background = state?.background;
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route path="/profile/orders/:number" element={<OrderInfo />} />
        </Route>

        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/feed/:number" element={<OrderInfo />} />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <ModalRoute title="Детали ингредиента">
                <IngredientDetails />
              </ModalRoute>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <ModalRoute>
                <OrderInfo />
              </ModalRoute>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile/orders/:number"
              element={
                <ModalRoute>
                  <OrderInfo />
                </ModalRoute>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
