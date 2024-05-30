import { NextUIProvider } from '@nextui-org/react';
import classNames from 'classnames';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import router from './routes';
import useDarkModeStore from './stores/useDarkMode';

const App = () => {
  const { darkMode } = useDarkModeStore();

  return (
    <>
      <NextUIProvider>
        <div className={classNames(darkMode ? 'dark' : '')}>
          <RouterProvider router={router} />
        </div>
      </NextUIProvider>
      <ToastContainer pauseOnHover={false} />
    </>
  );
};

export default App;
