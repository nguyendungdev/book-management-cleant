import { FileUploadResponse } from '@/typings/profile';
import env from '@/utils/env';
import axios, { AxiosInstance } from 'axios';
import { from } from 'rxjs';
import { createAxiosClient } from '../interceptors/PrivateAxios';

class FileRepository {
  private static _instance: FileRepository;
  private authClient: AxiosInstance;
  private client: AxiosInstance;

  private constructor() {
    this.authClient = createAxiosClient({
      options: {
        baseURL: `${env.apiUrl}/files`,
      },
    });

    this.client = axios.create({
      baseURL: `${env.apiUrl}/files`,
    })
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return from(
      this.authClient.post<FileUploadResponse>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    );
  }

  getSingleFile(path: string) {
    return from(this.client.get(`/${path}`));
  }

  updateFile(id: string, newFileID: string) {
    return from(
      this.authClient.patch(`/${id}`, {
        id: newFileID,
      }),
    );
  }

  static getInstance() {
    if (!this._instance) {
      return (this._instance = new FileRepository());
    }

    return this._instance;
  }
}

export default FileRepository.getInstance();
