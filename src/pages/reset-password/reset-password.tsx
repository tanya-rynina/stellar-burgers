import { useDispatch, useSelector } from '@/services/store';
import { clearError, resetPasswordThunk, selectUserError } from '@/services/userSlice';
import { ResetPasswordUI } from '@ui-pages';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { SyntheticEvent } from 'react';

export const ResetPassword = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(resetPasswordThunk({ password, token }))
      .unwrap()
      .then(() => {
        void navigate('/login', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <ResetPasswordUI
      errorText={error ?? undefined}
      password={password}
      setPassword={setPassword}
      token={token}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
