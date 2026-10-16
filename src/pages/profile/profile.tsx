import { useDispatch, useSelector } from '@/services/store';
import {
  clearError,
  selectUser,
  selectUserError,
  updateUserThunk,
} from '@/services/userSlice';
import { ProfileUI } from '@ui-pages';
import { useEffect, useState } from 'react';

import type { ChangeEvent, SyntheticEvent } from 'react';

type TFormValue = {
  name: string;
  email: string;
  password: string;
};

const INITIAL_FORM_VALUE: TFormValue = {
  name: '',
  email: '',
  password: '',
};

export const Profile = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUserError);

  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState<TFormValue>(INITIAL_FORM_VALUE);

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  }, [user]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    formValue.password !== '';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (!isFormChanged) return;

    const payload: Partial<TFormValue> = {
      name: formValue.name,
      email: formValue.email,
    };

    if (formValue.password) {
      payload.password = formValue.password;
    }

    void dispatch(updateUserThunk(payload))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch(() => undefined);
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError ?? undefined}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
