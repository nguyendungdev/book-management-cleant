
export interface UserEmailLogin {
  email: string;
  password: string;
}

export interface UserEmailRegister extends UserEmailLogin {
  firstName: string;
  lastName: string;
}

export interface UserForgotPassword {
  email: string;
}

export interface UserEmailConfirm {
  hash: string;
}

export interface UserResetPassword {
  password: string;
  hash: string;
}

export interface UserLoginResponse {
  refreshToken?: string;
  token?: string;
  tokenExpires?: number;
  user?: GetUserInfoResponse;
}

export interface GetUserInfoResponse {
  id: number
  email: string
  provider: string
  socialId: any
  firstName: string
  lastName: string
  photoID: string
  createdAt: string
  updatedAt: string
  deletedAt: any
  photo: Photo
  role: Role
  status: Status
  __entity: string
}

export interface Photo {
  id: string
  path: string
  __entity: string
}

export interface Role {
  id: number
  name: string
  __entity: string
}

export interface Status {
  id: number
  name: string
  __entity: string
}

