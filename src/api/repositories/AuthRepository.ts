import {
  UserEmailConfirm,
  UserEmailLogin,
  UserEmailRegister,
  UserForgotPassword,
  UserLoginResponse,
  UserResetPassword,
} from '@/typings/auth';
import env from '@/utils/env';
import axios, { AxiosInstance } from 'axios';
import { from } from 'rxjs';

class AuthRepository {
  private static _instance: AuthRepository;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: `${env.apiUrl}/auth`,
    });
  }

  userEmailLogin(payload: UserEmailLogin) {
    return from(this.client.post<UserLoginResponse>('/email/login', payload));
  }

  userEmailRegister(payload: UserEmailRegister) {
    return from(this.client.post('/email/register', payload));
  }

  userEmailConfirm(payload: UserEmailConfirm) {
    return from(this.client.post('/email/confirm', payload));
  }

  userForgotPassword(payload: UserForgotPassword) {
    return from(this.client.post('/forgot/password', payload));
  }

  userResetPassword(payload: UserResetPassword) {
    return from(this.client.post('/reset/password', payload));
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new AuthRepository();
    }

    return this._instance;
  }
}

export default AuthRepository.getInstance();
