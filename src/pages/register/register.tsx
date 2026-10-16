import { useDispatch, useSelector } from '@/services/store';
import { registerUserThunk, selectUserError } from '@/services/userSlice';
import { RegisterUI } from '@ui-pages';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { SyntheticEvent } from 'react';
import type { Location } from 'react-router-dom';

type TLocationState = {
  from?: Location;
};

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector(selectUserError);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(registerUserThunk({ email, name: userName, password }))
      .unwrap()
      .then(() => {
        const from = (location.state as TLocationState | null)?.from;
        void navigate(from ?? '/', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <RegisterUI
      errorText={error ?? undefined}
      email={email}
      setEmail={setEmail}
      userName={userName}
      setUserName={setUserName}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
