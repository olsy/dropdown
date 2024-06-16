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
    // Update value if dropdown prop 'value' was changed
    if (initialValue && value !== initialValue) {
      setValue(initialValue);
    }
  }, [initialValue, value]);

  useEffect(() => {
    if (isOpen) {
      // scroll to active element when dropdown is open
      setScrollToIndex(data.findIndex(v => v === value));
    } else {
      // reset hovered option when dropdown is closed
      setActive(undefined);
    }
  }, [isOpen]);

  // toggle dropdown
  const handleClick = useCallback(() => setOpen(prev => !prev), [setOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSelectElement>) => {
    // user can open dropdown with some keyboard keys
    if (
      !isOpen &&
      [KeyCode.Space, KeyCode.Enter, KeyCode.ArrowDown, KeyCode.ArrowUp].includes(
        event.code as KeyCode,
      )
    ) {
      setOpen(true);
    }
    // user can navigate through options with arrows
    else if (isOpen && [KeyCode.ArrowDown].includes(event.code as KeyCode)) {
      const idx = data.findIndex(v => v === (active || value));
      // show hovered option
      setActive(data[idx < data.length - 1 ? idx + 1 : 0]);
      // scroll virtualized list
      setScrollToIndex(idx < data.length - 1 ? idx + 1 : 0);
    }
    // user can navigate through options with arrows
    else if (isOpen && [KeyCode.ArrowUp].includes(event.code as KeyCode)) {
      const idx = data.findIndex(v => v === (active || value));
      // show hovered option
      setActive(data[idx === 0 ? data.length - 1 : idx - 1]);
      // scroll virtualized list
      setScrollToIndex(idx === 0 ? data.length - 1 : idx - 1);
    } else if (isOpen && [KeyCode.Space, KeyCode.Enter].includes(event.code as KeyCode)) {
      // select value
      setValue(active || value);
      // cb to pass value outside
      onChange?.((active || value) as T);
      // close dropdown when value was selected
      setOpen(false);
    } else if ([KeyCode.Escape].includes(event.code as KeyCode)) {
      // close dropdown
      setOpen(false);
      // if dropdown is closed call blur to dismiss focus
      if (!isOpen) {
        refSelect?.current?.blur();
      }
    }
    // execute custom handler
    onKeyDown?.(event);
  };

  // select option
  const handleOptionClick = useCallback(
    (index: T) => () => {
      setValue(index);
      // cb to pass value outside
      onChange?.(index);
    },
    [setValue, onChange],
  );

  // set active to show styles for hovered option
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
