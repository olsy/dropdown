import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyCode } from '@/components/Dropdown/types';

interface UseDropdownProps<T> {
  value?: T;
  data: T[];
  onChange?: (value: T) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLSelectElement>) => void;
}

const useDropdown = <T>({
  value: initialValue,
  data,
  onChange,
  onKeyDown,
}: UseDropdownProps<T>) => {
  const ref = useRef<HTMLLabelElement>(null);
  const refSelect = useRef<HTMLSelectElement>(null);
  const [value, setValue] = useState<T | undefined>(initialValue);
  const [isOpen, setOpen] = useState(false);
  const [active, setActive] = useState<T>();
  const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (initialValue && value !== initialValue) {
      setValue(initialValue);
    }
  }, [initialValue, value]);

  useEffect(() => {
    if (isOpen) {
      setScrollToIndex(data.findIndex(v => v === value));
    } else {
      setActive(undefined);
    }
  }, [isOpen]);

  const handleClick = useCallback(() => setOpen(prev => !prev), [setOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSelectElement>) => {
    if (
      !isOpen &&
      [KeyCode.Space, KeyCode.Enter, KeyCode.ArrowDown, KeyCode.ArrowUp].includes(
        event.code as KeyCode,
      )
    ) {
      setOpen(true);
    } else if (isOpen && [KeyCode.ArrowDown].includes(event.code as KeyCode)) {
      const idx = data.findIndex(v => v === (active || value));
      setActive(data[idx < data.length - 1 ? idx + 1 : 0]);
      setScrollToIndex(idx < data.length - 1 ? idx + 1 : 0);
    } else if (isOpen && [KeyCode.ArrowUp].includes(event.code as KeyCode)) {
      const idx = data.findIndex(v => v === (active || value));
      setActive(data[idx === 0 ? data.length - 1 : idx - 1]);
      setScrollToIndex(idx === 0 ? data.length - 1 : idx - 1);
    } else if (isOpen && [KeyCode.Space, KeyCode.Enter].includes(event.code as KeyCode)) {
      setValue(active || value);
      onChange?.((active || value) as T);
      setOpen(false);
    } else if ([KeyCode.Escape].includes(event.code as KeyCode)) {
      setOpen(false);
      if (!isOpen) {
        refSelect?.current?.blur();
      }
    }
    onKeyDown?.(event);
  };

  const handleOptionClick = useCallback(
    (index: T) => () => {
      setValue(index);
      onChange?.(index);
    },
    [setValue, onChange],
  );

  const handleOptionHover = useCallback((index: T) => () => setActive(index), [setActive]);

  return {
    ref,
    refSelect,
    value,
    active,
    isOpen,
    setOpen,
    handleClick,
    handleKeyDown,
    handleOptionClick,
    handleOptionHover,
    scrollToIndex,
  };
};

export default useDropdown;
