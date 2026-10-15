import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser, clearError } from '../../services/slices/userSlice';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { user, error } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  const [editingField, setEditingField] = useState<'name' | 'email' | 'password' | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || '',
    }));
  }, [user]);

  const isFormChanged =
    editingField !== null &&
    (formValue.name !== user?.name ||
      formValue.email !== user?.email ||
      !!formValue.password);

  const handleEditClick = (field: 'name' | 'email' | 'password'): void => {
    setEditingField(field);
    setValidationError(null);
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(clearError());
    setValidationError(null);

    const updateData: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== user?.name) updateData.name = formValue.name;
    if (formValue.email !== user?.email) updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    if (Object.keys(updateData).length > 0) {
      dispatch(updateUser(updateData)).then((result) => {
        if (updateUser.fulfilled.match(result)) {
          setFormValue((prev) => ({ ...prev, password: '' }));
          setEditingField(null);
        }
      });
    }
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
    setEditingField(null);
    dispatch(clearError());
    setValidationError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      editingField={editingField}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
      onEditClick={handleEditClick}
      updateUserError={validationError || error || undefined}
    />
  );
};