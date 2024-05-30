import ProfileRepository from '@/api/repositories/ProfileRepository';
import useAuthStore from '@/stores/useAuthStore';
import { map } from 'rxjs';
import { useCallApi } from './useCallApi';

const useRefreshProfile = () => {
  const { setAuth, authState } = useAuthStore();

  const { run: refreshProfileInfo } = useCallApi(() => {
    return ProfileRepository.getProfileInfo().pipe(
      map((response) => {
        if (response.status === 200) {
          setAuth({
            ...authState,
            user: {
              ...response.data,
            },
          });
        }
      }),
    );
  });

  return refreshProfileInfo;
};

export default useRefreshProfile;
