import useDarkModeStore from '@/stores/useDarkMode';
import { Switch } from '@nextui-org/react';
import { IconHazeMoon, IconSunset2 } from '@tabler/icons-react';

const DarkModeSwitcher = () => {
  const { toggleDarkMode } = useDarkModeStore();

  return (
    <Switch
      size='lg'
      color='success'
      startContent={<IconSunset2 />}
      endContent={<IconHazeMoon />}
      onClick={() => toggleDarkMode()}
    />
  );
};

export default DarkModeSwitcher;
