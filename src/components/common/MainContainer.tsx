import classNames from 'classnames';
import { ReactNode } from 'react';

interface MainContainerProps {
  children?: ReactNode;
  className?: string;
}

const MainContainer = ({ children, className }: MainContainerProps) => {
  return (
    <div
      className={classNames(
        'xl:max-w-[1200px] md:max-w-[768px] xl:p-0 md:px-6 w-full max-w-full p-6 mx-auto',
        className ? className : '',
      )}
    >
      {children}
    </div>
  );
};

export default MainContainer;
