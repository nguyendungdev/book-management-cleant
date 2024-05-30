import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import MainContainer from '../common/MainContainer';
import LayoutLoader from '../loading/LayoutLoader';
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';

const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg bg-orange-100 ' >
      
      <MainHeader />
      <MainContainer className='flex-1'>
        <Suspense fallback={<LayoutLoader />}>
          <Outlet />
        </Suspense>
      </MainContainer>
      <MainFooter />
    </div>
  );
};

export default MainLayout;
