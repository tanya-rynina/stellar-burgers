import { useDispatch, useSelector } from '@/services/store';
import { loginUserThunk, selectUserError } from '@/services/userSlice';
import { LoginUI } from '@ui-pages';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { SyntheticEvent } from 'react';
import type { Location } from 'react-router-dom';

type TLocationState = {
  from?: Location;
};

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(loginUserThunk({ email, password }))
      .unwrap()
      .then(() => {
        const from = (location.state as TLocationState | null)?.from;
        void navigate(from ?? '/', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <LoginUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
