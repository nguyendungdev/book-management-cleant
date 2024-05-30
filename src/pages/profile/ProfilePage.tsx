import FileRepository from '@/api/repositories/FileRepository';
import ProfileRepository from '@/api/repositories/ProfileRepository';
import { useCallApi } from '@/hooks/useCallApi';
import useRefreshProfile from '@/hooks/useRefreshProfile';
import useAuthStore from '@/stores/useAuthStore';
import { ProfileInfoUpdate } from '@/typings/profile';
import { schemaChangeProfileInfoValidation } from '@/utils/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Button, Chip, Input } from '@nextui-org/react';
import { IconAlertCircleFilled, IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import FileUploading from 'react-files-uploading';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { catchError, map, of, switchMap } from 'rxjs';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { authState } = useAuthStore();
  const [images, setImages] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInfoUpdate>({
    mode: 'onChange',
    resolver: yupResolver(schemaChangeProfileInfoValidation),
  });
  const refreshProfile = useRefreshProfile();

  const maxNumber = 1;

  const handleNavigateToChangePassword = () => {
    return navigate('/profile/change-password');
  };

  const onSubmitChangeProfileInfoForm: SubmitHandler<ProfileInfoUpdate> = (data) => {
    changeProfileInfo({
      firstName: data.firstName,
      lastName: data.lastName,
    });
  };

  const { run: changeProfileInfo } = useCallApi((changeInfoPayload: ProfileInfoUpdate) => {
    const toastLoading = toast.loading('Đang thay đổi thông tin!');

    return ProfileRepository.updateProfile({
      firstName: changeInfoPayload.firstName,
      lastName: changeInfoPayload.lastName,
    }).pipe(
      map((response) => {
        if (response.status === 200) {
          toast.dismiss(toastLoading);
          refreshProfile();
          toast.success('Thay đổi thông tin thành công!');
        } else {
          toast.dismiss(toastLoading);
          toast.error('Thay đổi thông tin thất bại!');
        }
      }),
    );
  });

  const { run: uploadAvatar } = useCallApi((file: File) => {
    const toastLoading = toast.loading('Uploading ảnh đại diện...');

    return FileRepository.uploadFile(file).pipe(
      map((response) => {
        setImages([]);

        return response;
      }),
      switchMap((response) => {
        return ProfileRepository.updateProfile({
          photo: {
            id: response.data.id,
          },
        }).pipe(
          map((response) => {
            toast.dismiss(toastLoading);
            if (response.status === 200) {
              toast.success('Thay đổi ảnh đại diện thành công!');

              refreshProfile();
            }
          }),
        );
      }),
      catchError((errors) => {
        toast.dismiss(toastLoading);
        toast.error('Có lỗi xảy ra vui lòng thử lại!');

        return of(errors);
      }),
    );
  });

  useEffect(() => {
    const image = images?.at(0);
    if (!image) return;

    uploadAvatar(image);
  }, [images]);

  return (
    <div className='flex flex-col mt-5 gap-y-5'>
      <div className='flex items-center justify-between p-5 bg-white rounded-md'>
        <div className='min-w-[150px] p-2 flex gap-x-2 items-center'>
          <div className='w-[150px]'>
            {!authState?.user?.photo ? (
              <Avatar size='lg' name={authState?.user?.firstName} className='w-[150px] h-[150px]' />
            ) : (
              <Avatar
                size='lg'
                src={authState?.user?.photo.path}
                className='w-[150px] h-[150px]'
              />
            )}
          </div>

          <div className='flex flex-col pl-5 gap-y-2'>
            {authState?.user?.status?.name === 'Active' ? (
              <Chip startContent={<IconCheck size={18} />} variant='flat' color='success'>
                Đã xác nhận
              </Chip>
            ) : (
              <Chip
                startContent={<IconAlertCircleFilled size={18} />}
                variant='flat'
                color='warning'
              >
                Chưa xác nhận
              </Chip>
            )}
            <h2 className='font-semibold text-[28px]'>
              {authState?.user?.lastName} {authState?.user?.firstName}
            </h2>

            <p className='text-neutral-600 '>{authState?.user?.email}</p>
          </div>
        </div>

        <div className='flex justify-end flex-1 pr-5'>
          <div className='flex flex-col gap-y-2'>
            <Button color={'secondary'} onClick={handleNavigateToChangePassword}>
              Đổi mật khẩu
            </Button>
            <FileUploading
              multiple={false}
              value={images ?? []}
              onChange={files => setImages(files)}
              maxNumber={maxNumber}
            >
              {({ fileList, onFileUpload, onFileRemoveAll, dragProps }) => {
                return (
                  <Button
                    onClick={fileList.length === 0 ? onFileUpload : onFileRemoveAll}
                    color='primary'
                    {...dragProps}
                  >
                    {fileList.length === 0 ? 'Thay đổi ảnh đại diện' : 'Xoá thay đổi'}
                  </Button>
                );
              }}
            </FileUploading>
          </div>
        </div>
      </div>

      <div className='p-5 bg-white rounded-md'>
        <h2 className='font-medium text-[20px]'>Thông tin tài khoản</h2>

        <form onSubmit={handleSubmit(onSubmitChangeProfileInfoForm)}>
          <div className='grid grid-cols-2 mt-2 gap-x-5'>
            <Input
              isClearable
              label='Tên'
              variant='bordered'
              color={errors.firstName?.message ? 'danger' : 'default'}
              labelPlacement='outside'
              placeholder='Nhập tên...'
              className='w-full'
              {...register('firstName', { required: true })}
              errorMessage={errors.firstName?.message}
              defaultValue={authState?.user?.firstName}
            />

            <Input
              isClearable
              label='Họ'
              variant='bordered'
              color={errors.lastName?.message ? 'danger' : 'default'}
              labelPlacement='outside'
              placeholder='Nhập họ...'
              className='w-full'
              {...register('lastName', { required: true })}
              errorMessage={errors.lastName?.message}
              defaultValue={authState?.user?.lastName}
            />
          </div>

          <div className='flex justify-end mt-4'>
            <Button type='submit' variant='solid' color='secondary'>
              Thay đổi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
