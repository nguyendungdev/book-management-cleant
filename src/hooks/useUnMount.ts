import { useEffect } from 'react';

export const useUnMount = (callback: any): void => {
  useEffect(
    () => () => {
      callback();
    },
    [],
  );
};
