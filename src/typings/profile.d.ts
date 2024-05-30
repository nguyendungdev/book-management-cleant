export interface ProfileUpdate {
  photo?: FileEntity;
  avatar?: FileEntity;
  firstName?: string;
  lastName?: string;
  password?: string;
  oldPassword?: string;
}

export interface FileEntity {
  id: string;
}

export interface ProfileInfoUpdate {
  firstName: string;
  lastName: string;
}

export interface FileUploadResponse {
  path: string;
  uploaderId: number;
  deletedAt: any;
  id: string;
  createdAt: string;
  updatedAt: string;
}
