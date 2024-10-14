
import axios from 'axios';
import { pricetrackerApi } from '../../config/api/pricetrackerApi';
import { User } from '../../domain/entities/user';
import type { AuthResponse } from '../../infrastructure/interfaces/auth.responses';


const returnUserToken = ( data: AuthResponse ) => {

  const user: User = {
    id: data.id,
    email: data.email,
    fullName: data.fullName,
    isActive: data.isActive,
    roles: data.roles,
  }

  return {
    user: user,
    token: data.token,
  }
}

export const validateGoogleToken = async (token: string, email: string, name: string | null) => {
  try {
    const { data } = await pricetrackerApi.post<AuthResponse>('/auth/validate-google-token', {
      token,
      email,
      name,
    });
    return returnUserToken(data);

  } catch (error) {
    console.log(error);
    return null;
  }
};



export const authLogin = async (email: string, password: string) => {

  email = email.toLowerCase();


  try {
    const { data } = await pricetrackerApi.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    return returnUserToken(data);


  } catch (error) {
    console.log(error);
    return null;
  }
};

export const authRegister = async (email: string, password: string, fullName:string) => {

  email = email.toLowerCase();


  try {
    const { data } = await pricetrackerApi.post<AuthResponse>('/auth/register', {
      email,
      password,
      fullName,
    });
    return returnUserToken(data);


  } catch (error) {
    console.log(error);
    return null;
  }
};


export const authCheckStatus = async () => {
  try {
    const { data } = await pricetrackerApi.get<AuthResponse>('/auth/check-status');
    return returnUserToken(data);
  } catch (error) {
    return null;
  }
};