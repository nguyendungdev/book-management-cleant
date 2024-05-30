import AuthRepository from '@/api/repositories/AuthRepository';
import { useCallApi } from '@/hooks/useCallApi';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { catchError, map, of } from 'rxjs';

const AuthConfirmPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hash = searchParams.get('hash');
  const [isSuccess, setIsSuccess] = useState(false);

  const { run: confirmEmail } = useCallApi((hash: string) => {
    const loadingToast = toast.loading('Đang xác nhận tài khoản!');

    return AuthRepository.userEmailConfirm({
      hash,
    }).pipe(
      map((response) => {
        if (response.status === 204) {
          toast.dismiss(loadingToast);
          toast.success('Xác nhận thành công!');
          setIsSuccess(true);
        }
      }),
      catchError((errors) => {
        toast.dismiss(loadingToast);
        toast.error('Có lỗi xảy ra! Vui lòng thử lại...');

        return of(errors);
      }),
    );
  });

  const handleBackToHomepage = () => {
    return navigate('/');
  };

  useEffect(() => {
    if (!hash) {
      return navigate('/');
    }

    confirmEmail(hash);
  }, [hash]);

  return (
    <div className='flex items-center justify-center'>
      {!isSuccess ? (
        <div className='font-semibold text-[48px]'>Xác nhận tài khoản</div>
      ) : (
        <div className='flex flex-col gap-y-4'>
          <h2 className='font-semibold text-[38px]'>Xác nhận thành công</h2>
          <Button
            variant='solid'
            color='success'
            className='font-semibold text-white'
            onClick={handleBackToHomepage}
          >
            Về trang chủ
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthConfirmPage;
