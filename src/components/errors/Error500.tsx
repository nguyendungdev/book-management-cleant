import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

const Error500 = () => {
  const navigate = useNavigate();

  const handleNavigateToHomepage = () => {
    return navigate('/');
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white dark:bg-black'>
      <div className='max-w-[50%] mx-auto text-red-600 font-bold text-3xl flex flex-col gap-y-5'>
        Something went wrong
        <Button
          className='font-semibold'
          type='button'
          color='danger'
          onClick={handleNavigateToHomepage}
        >
          Về lại trang chủ
        </Button>
      </div>
    </div>
  );
};

export default Error500;
