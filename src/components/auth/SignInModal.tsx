import AuthRepository from '@/api/repositories/AuthRepository';
import { useCallApi } from '@/hooks/useCallApi';
import useAuthStore from '@/stores/useAuthStore';
import { UserEmailLogin } from '@/typings/auth';
import { schemaSignInValidation } from '@/utils/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { IconAt, IconEye, IconEyeOff, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { catchError, map, of } from 'rxjs';

interface SignInModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  handleOpenSignUp?: () => void;
  handleOpenForgotPassword?: () => void;
  onClose?: () => void;
}

interface SignInFormValue {
  email: string;
  password: string;
}

const SignInModal = ({
  isOpen,
  onOpenChange,
  handleOpenSignUp,
  handleOpenForgotPassword,
  onClose,
}: SignInModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValue>({
    mode: 'onChange',
    resolver: yupResolver(schemaSignInValidation),
  });

  const { run: loginUser } = useCallApi((loginPayload: UserEmailLogin) => {
    const loadingToast = toast.loading('Đăng nhập tài khoản...');

    return AuthRepository.userEmailLogin(loginPayload).pipe(
      map((response) => {
        if (response.status === 200) {
          toast.dismiss(loadingToast);
          toast.success('Đăng nhập thành công!');
          onClose?.();
          setAuth({
            ...response.data,
            user: {
              ...response.data.user,
              file: response.data?.user?.file
                ? response.data?.user?.file.map((f: any) => {
                    return {
                      ...f,
                      path: f.path.replace('\\', '/'),
                    };
                  })
                : [],
            },
          });
        }
      }),
      catchError((errors) => {
        console.log(errors);
        toast.dismiss(loadingToast);
        toast.error(errors.message);

        return of(errors);
      }),
    );
  });

  const onSubmitSignInForm: SubmitHandler<SignInFormValue> = (data) => {
    loginUser(data);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex flex-col gap-1'>Đăng nhập tài khoản</ModalHeader>
            <ModalBody>
              <form
                className='flex flex-col w-full gap-y-3'
                onSubmit={handleSubmit(onSubmitSignInForm)}
              >
                <Input
                  isClearable
                  type='email'
                  label='Email'
                  variant='bordered'
                  color={errors.email?.message ? 'danger' : 'default'}
                  labelPlacement='outside'
                  placeholder='Nhập email...'
                  className='w-full'
                  startContent={<IconAt className='w-4 h-4' />}
                  {...register('email', { required: true })}
                  errorMessage={errors.email?.message}
                />

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
                      {isVisible ? (
                        <IconEye className='w-4 h-4' />
                      ) : (
                        <IconEyeOff className='w-4 h-4' />
                      )}
                    </button>
                  }
                  {...register('password', { required: true })}
                  errorMessage={errors.password?.message}
                />

                <div className='flex justify-between'>
                  <p
                    className='text-sm font-medium text-green-600 cursor-pointer hover:underline'
                    onClick={handleOpenForgotPassword}
                  >
                    Quên mật khẩu
                  </p>
                  <p
                    className='text-sm font-medium text-blue-700 cursor-pointer hover:underline'
                    onClick={handleOpenSignUp}
                  >
                    Chưa có tài khoản? Đăng ký ngay
                  </p>
                </div>

                <Button type='submit' color='primary' className='mb-2'>
                  Đăng nhập
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SignInModal;
