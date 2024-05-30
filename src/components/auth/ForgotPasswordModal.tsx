import AuthRepository from '@/api/repositories/AuthRepository';
import { useCallApi } from '@/hooks/useCallApi';
import { schemaForgotPasswordValidation } from '@/utils/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { IconAt } from '@tabler/icons-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { catchError, map, of } from 'rxjs';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

interface ForgotPasswordFormValue {
  email: string;
}

const ForgotPasswordModal = ({ isOpen, onOpenChange }: ForgotPasswordModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValue>({
    mode: 'onChange',
    resolver: yupResolver(schemaForgotPasswordValidation),
  });

  const { run: forgotPassword } = useCallApi((forgotPasswordPayload: ForgotPasswordFormValue) => {
    const toastLoading = toast.loading('Đặt lại mật khẩu...');

    return AuthRepository.userForgotPassword({
      email: forgotPasswordPayload.email,
    }).pipe(
      map((response) => {
        if (response.status === 204) {
          toast.dismiss(toastLoading);

          toast.success('Vui lòng kiểm tra hòm thư điện tử!');
        }
      }),
      catchError((errors) => {
        toast.dismiss(toastLoading);
        if (errors.response.data.status === 422) {
          toast.error('Email không tồn tại!');
        }

        return of(errors);
      }),
    );
  });

  const onSubmitForgotPassword: SubmitHandler<ForgotPasswordFormValue> = (data) => {
    forgotPassword(data);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className='flex flex-col gap-1'>Đặt lại mật khẩu</ModalHeader>
            <ModalBody>
              <form
                className='flex flex-col w-full gap-y-3'
                onSubmit={handleSubmit(onSubmitForgotPassword)}
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

                <Button type='submit' color='primary' className='my-2'>
                  Lấy lại mật khẩu
                </Button>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ForgotPasswordModal;
