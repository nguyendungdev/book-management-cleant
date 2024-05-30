import { GetUserInfoResponse } from '@/typings/auth';
import { ProfileUpdate } from '@/typings/profile';
import env from '@/utils/env';
import { AxiosInstance } from 'axios';
import { from } from 'rxjs';
import { createAxiosClient } from '../interceptors/PrivateAxios';

class ProfileRepository {
  private static _instance: ProfileRepository;
  private client: AxiosInstance;

  private constructor() {
    this.client = createAxiosClient({
      options: {
        baseURL: `${env.apiUrl}/auth`,
      },
    });
  }

  getProfileInfo() {
    return from(this.client.get<GetUserInfoResponse>('/me'));
  }

  updateProfile(updatePayload: ProfileUpdate) {
    return from(this.client.patch('/me', updatePayload));
  }

  deleteProfile() {
    return from(this.client.delete('/me'));
  }

  logout() {
    return from(this.client.post('/logout'));
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new ProfileRepository();
    }

    return this._instance;
  }
}

export default ProfileRepository.getInstance();
