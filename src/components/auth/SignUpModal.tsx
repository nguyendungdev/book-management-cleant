import AuthRepository from '@/api/repositories/AuthRepository';
import { useCallApi } from '@/hooks/useCallApi';
import { UserEmailRegister } from '@/typings/auth';
import { schemaSignUpValidation } from '@/utils/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { IconAt, IconEye, IconEyeOff, IconLock } from '@tabler/icons-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { catchError, map, of } from 'rxjs';

interface SignUpModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  handleOpenSignIn?: () => void;
  onClose?: () => void;
}

interface SignUpFormValue {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const SignUpModal = ({ isOpen, onOpenChange, handleOpenSignIn, onClose }: SignUpModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValue>({
    mode: 'onChange',
    resolver: yupResolver(schemaSignUpValidation),
  });

  const { run: registerUser } = useCallApi((registerPayload: UserEmailRegister) => {
    const loadingToast = toast.loading('Đăng ký tài khoản...');

    return AuthRepository.userEmailRegister(registerPayload).pipe(
      map((response) => {
        if (response.status === 204) {
          toast.dismiss(loadingToast);
          onClose?.();
          toast.success('Vui lòng kiểm tra hòm thư để xác nhận tài khoản!');
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

  const onSubmitSignUpForm: SubmitHandler<SignUpFormValue> = (data) => {
    registerUser({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex flex-col gap-1'>Đăng ký tài khoản</ModalHeader>
            <ModalBody>
              <form
                className='flex flex-col w-full gap-y-3'
                onSubmit={handleSubmit(onSubmitSignUpForm)}
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
                  isClearable
                  label='Tên'
                  variant='bordered'
                  color={errors.firstName?.message ? 'danger' : 'default'}
                  labelPlacement='outside'
                  placeholder='Nhập tên...'
                  className='w-full'
                  startContent={<IconAt className='w-4 h-4' />}
                  {...register('firstName', { required: true })}
                  errorMessage={errors.firstName?.message}
                />

                <Input
                  isClearable
                  label='Họ'
                  variant='bordered'
                  color={errors.lastName?.message ? 'danger' : 'default'}
                  labelPlacement='outside'
                  placeholder='Nhập họ...'
                  className='w-full'
                  startContent={<IconAt className='w-4 h-4' />}
                  {...register('lastName', { required: true })}
                  errorMessage={errors.lastName?.message}
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
                      {isVisible ? (
                        <IconEye className='w-4 h-4' />
                      ) : (
                        <IconEyeOff className='w-4 h-4' />
                      )}
                    </button>
                  }
                  {...register('confirmPassword', { required: true })}
                  errorMessage={errors.confirmPassword?.message}
                />

                <div className='flex justify-end'>
                  <p
                    className='text-sm font-medium text-blue-700 cursor-pointer hover:underline'
                    onClick={handleOpenSignIn}
                  >
                    Đã có tài khoản? Đăng nhập ngay
                  </p>
                </div>

                <Button type='submit' color='primary' className='mb-2'>
                  Đăng ký
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
