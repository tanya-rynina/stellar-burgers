import { useDispatch } from '@/services/store';
import { logoutUserThunk } from '@/services/userSlice';
import { ProfileMenuUI } from '@ui';
import { useNavigate, useLocation } from 'react-router-dom';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    void dispatch(logoutUserThunk())
      .unwrap()
      .then(() => {
        void navigate('/login', { replace: true });
      })
      .catch(() => undefined);
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
