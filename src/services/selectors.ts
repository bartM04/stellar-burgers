import type { RootState } from './store';
import type { TUser } from '@utils-types';

export const selectUser = (state: RootState): TUser | null => state.user.user;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const selectUserName = (state: RootState): string | undefined =>
  state.user.user?.name;
export const selectUserError = (state: RootState): string | null => state.user.error;
export const selectUserIsLoading = (state: RootState): boolean => state.user.isLoading;
