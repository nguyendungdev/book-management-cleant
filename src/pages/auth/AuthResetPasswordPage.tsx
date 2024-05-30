import AuthRepository from '@/api/repositories/AuthRepository';
import { useCallApi } from '@/hooks/useCallApi';
import { UserResetPassword } from '@/typings/auth';
import { schemaResetPasswordValidation } from '@/utils/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@nextui-org/react';
import { IconEye, IconEyeOff, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { catchError, map, of } from 'rxjs';

interface ResetPasswordFormValue {
  password: string;
  confirmPassword: string;
}

const AuthResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hash = searchParams.get('hash');

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValue>({
    mode: 'onChange',
    resolver: yupResolver(schemaResetPasswordValidation),
  });

  const { run: resetPassword } = useCallApi((resetPasswordPayload: UserResetPassword) => {
    const loadingToast = toast.loading('Đang xác nhận tài khoản!');

    return AuthRepository.userResetPassword(resetPasswordPayload).pipe(
      map((response) => {
        if (response.status === 204) {
          toast.dismiss(loadingToast);
          toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại...');

          setTimeout(() => {
            return navigate('/');
          }, 200);
        }
      }),
      catchError((errors) => {
        toast.dismiss(loadingToast);
        toast.error('Có lỗi xảy ra! Vui lòng thử lại...');

        return of(errors);
      }),
    );
  });

  const onSubmitResetPassword: SubmitHandler<ResetPasswordFormValue> = (data) => {
    resetPassword({
      hash: hash ?? '',
      password: data.password,
    });
  };

  return (
    <div>
      <form className='flex flex-col w-full gap-y-3' onSubmit={handleSubmit(onSubmitResetPassword)}>
        <Input
          label='Mật khẩu'
          variant='bordered'
          color={errors.password?.message ? 'danger' : 'default'}
          placeholder='Nhập mật khẩu...'
          labelPlacement='outside'
          className='w-full'
          type={isVisible ? 'text' : 'password'}
          startContent={<IconLock className='w-4 h-4' />}
          endContent={
            <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
              {isVisible ? <IconEye className='w-4 h-4' /> : <IconEyeOff className='w-4 h-4' />}
            </button>
          }
          {...register('password', { required: true })}
          errorMessage={errors.password?.message}
        />

        <Input
          label='Xác nhận mật khẩu'
          variant='bordered'
          placeholder='Nhập mật khẩu...'
          labelPlacement='outside'
          color={errors.confirmPassword?.message ? 'danger' : 'default'}
          className='w-full'
          type={isVisible ? 'text' : 'password'}
          startContent={<IconLock className='w-4 h-4' />}
          endContent={
            <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
              {isVisible ? <IconEye className='w-4 h-4' /> : <IconEyeOff className='w-4 h-4' />}
            </button>
          }
          {...register('confirmPassword', { required: true })}
          errorMessage={errors.confirmPassword?.message}
        />

        <Button type='submit' color='primary' className='my-2'>
          Đổi mật khẩu
        </Button>
      </form>
    </div>
  );
};

export default AuthResetPasswordPage;
