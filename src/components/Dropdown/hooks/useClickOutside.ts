import { RefObject, useEffect } from 'react';

const useClickOutside = (ref: RefObject<any>, cb: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        cb();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [cb, ref]);
};

export default useClickOutside;
