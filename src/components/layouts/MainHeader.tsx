import ProfileRepository from '@/api/repositories/ProfileRepository';
import { useCallApi } from '@/hooks/useCallApi';
import useAuthStore from '@/stores/useAuthStore';
import useCategoriesStore from '@/stores/useCategoriesStore';
import '@/styles/main-header.scss';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  useDisclosure
} from '@nextui-org/react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { map } from 'rxjs';
import ForgotPasswordModal from '../auth/ForgotPasswordModal';
import SignInModal from '../auth/SignInModal';
import SignUpModal from '../auth/SignUpModal';

const MainHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authState, logout: removeToken } = useAuthStore();
  const { categories } = useCategoriesStore();

  const {
    isOpen: isOpenSignInModal,
    onOpenChange: onOpenChangeSignInModal,
    onOpen: onOpenSignInModal,
    onClose: onCloseSignInModal,
  } = useDisclosure();

  const {
    isOpen: isOpenSignUpModal,
    onOpenChange: onOpenChangeSignUpModal,
    onOpen: onOpenSignUpModal,
    onClose: onCloseSignUpModal,
  } = useDisclosure();

  const { isOpen: isOpenFogotPasswordModal, onOpenChange: onOpenChangeFogotPasswordModal } =
    useDisclosure();

  const menuItems = useMemo(
    () =>
      authState?.user
        ? ['Tài khoản', 'Danh sách', 'Bộ sưu tầm', 'Tìm kiếm', 'Thể loại']
        : ['Danh sách', 'Tìm kiếm', 'Thể loại', 'Đăng ký'],
    [authState],
  );

  const handleClickBrand = () => {
    return navigate('/');
  };

  const { run: logout } = useCallApi(() => {
    return ProfileRepository.logout().pipe(
      map((response) => {
        if (response.status === 204) {
          removeToken();
        }
      }),
    );
  });

  const handleActionProfile = (key: React.Key) => {
    switch (key) {
      case 'logout':
        return logout();
      case 'profile':
        return navigate('/profile');
      case 'post-manager':
        return navigate('/post-manager');
      case "update-document":
        return navigate("/upload-document");
      case "category-manager":
        return navigate("/category-manager");
    }
  };

  return (
    <>
      <Navbar onMenuOpenChange={setIsMenuOpen} isBlurred className='bg-orange-200	 main-header' >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className='sm:hidden'
          />
          <NavbarBrand>
            <p
              className='font-semibold cursor-pointer text-inherit dark:text-dark-headline text-light-headline '
              onClick={handleClickBrand}
            >
              VÀO BẾP CÙNG NHAU
            </p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className='hidden gap-4 sm:flex header-nav-list' justify='center'>
          <NavbarItem>
            <Link className='dark:text-dark-headline text-light-headline font-semibold' to='/post'>
              Danh sách
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='dark:text-dark-headline text-light-headline font-semibold' to='/bookmark'>
              Bộ sưu tầm
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className='dark:text-dark-headline text-light-headline font-semibold'
              to='/search'
              aria-current='page'
            >
              Tìm kiếm
            </Link>
          </NavbarItem>
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <Link className='dark:text-dark-headline text-light-headline font-semibold' to={"#"}>
                  Thể loại
                </Link>
              </DropdownTrigger>
            </NavbarItem>

            <DropdownMenu className='w-[240px] ' itemClasses={{
              base: "gap-4",
            }}>
              {
                categories ? categories.map(cate => (
                  <DropdownItem key={cate.id} className='py-[10px]' onClick={() => navigate("/category/" + cate.id)}>
                    {cate.name}
                  </DropdownItem>
                )) : []
              }
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
        <NavbarContent justify='end'>
          {!authState?.user ? (
            <>
              <NavbarItem className='hidden lg:flex'>
                <Button
                  variant='flat'
                  className='dark:text-dark-headline text-light-headline'
                  onClick={onOpenSignUpModal}
                >
                  Đăng ký
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button color='primary' variant='solid' onClick={onOpenSignInModal}>
                  Đăng nhập
                </Button>
              </NavbarItem>
            </>
          ) : (
            <NavbarItem className='cursor-pointer'>
              <Dropdown placement='bottom-end'>
                <DropdownTrigger>
                  {!authState.user.photo ? (
                    <Avatar name={authState.user.firstName} />
                  ) : (
                    <Avatar src={authState.user.photo.path} />
                  )}
                </DropdownTrigger>

                {
                  authState.user.role.name === "Admin" ? (
                    <DropdownMenu
                      aria-label='Profile Actions'
                      variant='flat'
                      onAction={handleActionProfile}
                    >
                      <DropdownItem key='username' className='gap-2'>
                        <p className='font-semibold'>
                          {authState.user.firstName} {authState.user.lastName}
                        </p>
                      </DropdownItem>

                      <DropdownItem key='profile' color='primary'>
                        Tài khoản
                      </DropdownItem>

                      <DropdownItem key='category-manager' color='primary'>
                        Quản lý thể loại
                      </DropdownItem>

                      <DropdownItem key='update-document' color='primary'>
                        Chia sẻ công thức
                      </DropdownItem>

                      <DropdownItem key='post-manager' color='primary'>
                        Quản lý công thức
                      </DropdownItem>

                      <DropdownItem key='logout' color='primary'>
                        Đăng xuất
                      </DropdownItem>
                    </DropdownMenu>
                  ) : (
                    <DropdownMenu
                      aria-label='Profile Actions'
                      variant='flat'
                      onAction={handleActionProfile}
                    >
                      <DropdownItem key='username' className='gap-2'>
                        <p className='font-semibold'>
                          {authState.user.firstName} {authState.user.lastName}
                        </p>
                      </DropdownItem>

                      <DropdownItem key='profile' color='danger'>
                        Tài khoản
                      </DropdownItem>

                      <DropdownItem key='update-document' color='danger'>
                        Chia sẻ công thức
                      </DropdownItem>

                      <DropdownItem key='post-manager' color='danger'>
                        Quản lý công thức
                      </DropdownItem>

                      <DropdownItem key='logout' color='danger'>
                        Đăng xuất
                      </DropdownItem>
                    </DropdownMenu>
                  )
                }
              </Dropdown>
            </NavbarItem>
          )}

          {/* <NavbarItem>
            <DarkModeSwitcher />
          </NavbarItem> */}
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2 ? 'primary' : index === menuItems.length - 1 ? 'danger' : 'foreground'
                }
                className='w-full'
                to='#'
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      <SignInModal
        isOpen={isOpenSignInModal}
        onOpenChange={onOpenChangeSignInModal}
        handleOpenSignUp={() => {
          onCloseSignInModal();
          onOpenChangeSignUpModal();
        }}
        handleOpenForgotPassword={() => {
          onCloseSignInModal();
          onOpenChangeFogotPasswordModal();
        }}
        onClose={onCloseSignInModal}
      />

      <SignUpModal
        isOpen={isOpenSignUpModal}
        onOpenChange={onOpenChangeSignUpModal}
        handleOpenSignIn={() => {
          onCloseSignUpModal();
          onOpenChangeSignInModal();
        }}
        onClose={onCloseSignUpModal}
      />

      <ForgotPasswordModal
        isOpen={isOpenFogotPasswordModal}
        onOpenChange={onOpenChangeFogotPasswordModal}
      />
    </>
  );
};

export default MainHeader;
