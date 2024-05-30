import useAuthStore from '@/stores/useAuthStore';
import { UserLoginResponse } from '@/typings/auth';
import axios, { CreateAxiosDefaults } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    authorization?: boolean;
    retry?: boolean;
  }
}

let failedQueue: any[] = [];
let isRefreshing = false;

const refreshUrl = `${import.meta.env.VITE_API_URL}/auth/refresh`;

function getAccessToken() {
  return useAuthStore.getState().authState?.token;
}

function getRefreshToken() {
  return useAuthStore.getState().authState?.refreshToken;
}

function logoutFn() {
  useAuthStore.getState().logout();
}

function setRefreshedTokensFn(payload: { accessToken: string; refreshToken: string }) {
  const authState = useAuthStore.getState().authState as UserLoginResponse;

  return useAuthStore.getState().setAuth({
    ...authState,
    refreshToken: payload.refreshToken,
    token: payload.accessToken,
  });
}

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

export function createAxiosClient({
  options,
  getCurrentAccessToken = getAccessToken,
  getCurrentRefreshToken = getRefreshToken,
  refreshTokenUrl = refreshUrl,
  logout = logoutFn,
  setRefreshedTokens = setRefreshedTokensFn,
}: {
  options: CreateAxiosDefaults<any>;
  getCurrentAccessToken?: () => string | undefined;
  getCurrentRefreshToken?: () => string | undefined;
  refreshTokenUrl?: string;
  logout?: () => void;
  setRefreshedTokens?: (payload: { accessToken: string; refreshToken: string }) => void;
}) {
  const client = axios.create(options);

  client.interceptors.request.use(
    (config) => {
      if (config.authorization !== false) {
        const token = getCurrentAccessToken();
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const originalRequest = error.config;
      originalRequest.headers = JSON.parse(JSON.stringify(originalRequest.headers || {}));
      const refreshToken = getCurrentRefreshToken();

      const handleError = (error: any) => {
        processQueue(error);
        logout();
        return Promise.reject(error);
      };

      if (
        refreshToken &&
        error.response?.status === 401 &&
        (!originalRequest._retry || originalRequest._retry !== true)
      ) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
        isRefreshing = true;
        originalRequest._retry = true;

        return axios
          .post(refreshTokenUrl, undefined, {
            headers: {
              Authorization: 'Bearer ' + refreshToken,
            },
          })
          .then((res) => {
            const tokens = {
              accessToken: res.data?.token,
              refreshToken: res.data?.refreshToken,
            };
            setRefreshedTokens(tokens);
            processQueue(null);

            return client(originalRequest);
          }, handleError)
          .finally(() => {
            isRefreshing = false;
          });
      }

      if (error.response?.status === 401) {
        return handleError(error);
      }

      return Promise.reject(error);
    },
  );

  return client;
}
