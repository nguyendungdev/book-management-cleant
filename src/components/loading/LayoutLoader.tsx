import { Spinner } from '@nextui-org/react';

const LayoutLoader = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-60'>
      <Spinner color='primary' size='lg' />
    </div>
  );
};

export default LayoutLoader;
