/* eslint-disable prettier/prettier */
import {create} from 'zustand';
import {User} from '../../../domain/entities/user';
import type {AuthStatus} from '../../../infrastructure/interfaces/auth.status';
import {
  authCheckStatus,
  authLogin,
  authRegister,
  validateGoogleToken,
} from '../../../actions/auth/auth';
import {StorageAdapter} from '../../../config/adapters/storage-adapter';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (
    idToken: string,
    email: string,
    name: string | null,
  ) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<boolean>;
  checkStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  token: undefined,
  user: undefined,

  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);
    if (!resp) {
      set({status: 'unauthenticated', token: undefined, user: undefined});
      return false;
    }
    await StorageAdapter.setItem('token', resp.token);
    set({token: resp.token});
    await get().checkStatus();
    return true;
  },

  loginWithGoogle: async (
    idToken: string,
    email: string,
    name: string | null,
  ) => {
    const resp = await validateGoogleToken(idToken, email, name);
    if (!resp) {
      set({status: 'unauthenticated', token: undefined, user: undefined});
      return false;
    }
    set({token: resp.token});
    await StorageAdapter.setItem('token', resp.token);
    set({status: 'authenticated', token: resp.token, user: resp.user});
    await get().checkStatus();
    return true;
  },

  register: async (email: string, password: string, fullName: string) => {
    const resp = await authRegister(email, password, fullName);
    if (!resp) {
      set({status: 'unregistered', token: undefined, user: undefined});
      return false;
    }
    await StorageAdapter.setItem('token', resp.token);
    set({status: 'registered', token: resp.token, user: resp.user});

    return true;
  },

  checkStatus: async () => {
    const token = await StorageAdapter.getItem('token');

    if (!token) {
      set({status: 'unauthenticated', token: undefined, user: undefined});
      return;
    }

    set({token});

    const resp = await authCheckStatus();
    if (!resp) {
      await StorageAdapter.removeItem('token');
      set({status: 'unauthenticated', token: undefined, user: undefined});
      return;
    }
    set({status: 'authenticated', user: resp.user});
  },

  logout: async () => {
    await StorageAdapter.removeItem('token');
    await GoogleSignin.signOut();
    set({status: 'unauthenticated', token: undefined, user: undefined});
  },
}));
