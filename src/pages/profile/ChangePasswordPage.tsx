import ProfileRepository from '@/api/repositories/ProfileRepository';
import { useCallApi } from '@/hooks/useCallApi';
import useAuthStore from '@/stores/useAuthStore';
import { schemaChangePasswordValidation } from '@/utils/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input } from '@nextui-org/react';
import { IconEye, IconEyeOff, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { catchError, map, of } from 'rxjs';

interface ChangePasswordFormValue {
  password: string;
  confirmPassword: string;
  oldPassword: string;
}

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { logout } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValue>({
    mode: 'onChange',
    resolver: yupResolver(schemaChangePasswordValidation),
  });

  const { run: changePassword } = useCallApi((changePasswordPayload: ChangePasswordFormValue) => {
    const loadingToast = toast.loading('Đổi mật khẩu...');
    return ProfileRepository.updateProfile({
      oldPassword: changePasswordPayload.oldPassword,
      password: changePasswordPayload.password,
    }).pipe(
      map((response) => {
        toast.dismiss(loadingToast);
        if (response.status === 200) {
          toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại');

          setTimeout(() => {
            logout();
          }, 200);
        }
      }),
      catchError((errors) => {
        toast.dismiss(loadingToast);
        if (errors.response.data.status === 422) {
          toast.error('Mật khẩu cũ sai!');
        }

        return of(errors);
      }),
    );
  });

  const handleChangePassword: SubmitHandler<ChangePasswordFormValue> = (data) => {
    changePassword(data);
  };

  const handleBackBtn = () => {
    return navigate(-1);
  };

  return (
    <div className='flex flex-col mt-5 gap-y-5'>
      <div className='p-5 bg-white rounded-md'>
        <h2 className='font-medium text-[20px]'>Thông tin tài khoản</h2>

        <form onSubmit={handleSubmit(handleChangePassword)}>
          <div className='grid grid-cols-2 mt-2 gap-x-5'>
            <Input
              label='Mật khẩu mới'
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
              label='Xác nhận mật khẩu mới'
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
          </div>

          <div className='mt-2'>
            <Input
              label='Mật khẩu cũ'
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
              {...register('oldPassword', { required: true })}
              errorMessage={errors.oldPassword?.message}
            />
          </div>

          <div className='flex justify-end mt-4 gap-x-2'>
            <Button type='button' variant='solid' color='primary' onClick={handleBackBtn}>
              Trở về
            </Button>
            <Button type='submit' variant='solid' color='secondary'>
              Đổi mật khẩu
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
