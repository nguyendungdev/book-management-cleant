import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LayoutLoader from '../loading/LayoutLoader';

const AuthLayout = () => {
  return (
    <div className='min-h-screen text-black bg-white dark:bg-black dark:text-white'>
      <div className='max-w-[30%] w-full mx-auto pt-[340px]'>
        <Suspense fallback={<LayoutLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AuthLayout;
