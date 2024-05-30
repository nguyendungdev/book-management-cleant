/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import AdminPrivateRouter from '@/components/auth/AdminPrivateRouter';
import PrivateRouter from '@/components/auth/PrivateRouter';
import Error500 from '@/components/errors/Error500';
import AuthLayout from '@/components/layouts/AuthLayout';
import MainLayout from '@/components/layouts/MainLayout';

const Homepage = lazy(() => import('@/pages/Homepage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const ChangePasswordPage = lazy(() => import('@/pages/profile/ChangePasswordPage'));
const AuthConfirmPage = lazy(() => import('@/pages/auth/AuthConfirmPage'));
const UploadDocumentPage = lazy(() => import("@/pages/profile/UploadDocumentPage"));
const AuthResetPasswordPage = lazy(() => import("@/pages/auth/AuthResetPasswordPage"))
const PostDetailPage = lazy(() => import('@/pages/post/PostDetailPage'));
const PostManagePage = lazy(() => import('@/pages/profile/PostManagePage'));
const ListPostInBookmarkPage = lazy(() => import("@/pages/post/ListPostInBookmarkPage"));
const ListPostInCategoryPage = lazy(() => import("@/pages/post/ListPostInCategoryPage"));
const ListPostPage = lazy(() => import("@/pages/post/ListPostPage"));
const SearchPostPage = lazy(() => import("@/pages/post/SearchPostPage"));
const EditPostPage = lazy(() => import("@/pages/profile/EditPostPage"));
const CategoryManagePage = lazy(() => import("@/pages/admin/CategoryManagePage"))

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <Error500 />,
    children: [
      {
        path: '/auth/confirm',
        element: <AuthConfirmPage />,
      },
      {
        path: '/auth/reset-password',
        element: <AuthResetPasswordPage />,
      },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error500 />,
    children: [
      {
        path: "/post",
        element: <ListPostPage />
      },
      {
        path: "/post/:id",
        element: (
          <PostDetailPage />
        )
      },
      {
        path: "/search",
        element: <SearchPostPage />
      },
      {
        path: "/category/:id",
        element: <ListPostInCategoryPage />
      },
      {
        path: "/bookmark",
        element: <ListPostInBookmarkPage />
      },
      {
        path: '/profile',
        element: (
          <PrivateRouter>
            <ProfilePage />
          </PrivateRouter>
        ),
      },
      {
        path: '/profile/change-password',
        element: (
          <PrivateRouter>
            <ChangePasswordPage />
          </PrivateRouter>
        ),
      },
      {
        path: '/post-manager',
        element: (
          <PrivateRouter>
            <PostManagePage />
          </PrivateRouter>
        ),
      },
      {
        path: "/category-manager",
        element: (
          <AdminPrivateRouter>
            <CategoryManagePage />
          </AdminPrivateRouter>
        )
      },
      {
        path: "/post-manager/edit/:id",
        element: (
          <PrivateRouter>
            <EditPostPage />
          </PrivateRouter>
        )
      },
      {
        path: "/upload-document",
        element: (
          <PrivateRouter>
            <UploadDocumentPage />
          </PrivateRouter>
        )
      },
      {
        path: '/',
        element: <Homepage />,
      },
    ],
  },
]);

export default router;
