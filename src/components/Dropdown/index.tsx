'use client';

import React from 'react';
import List from 'react-virtualized/dist/commonjs/List';
import Option from './components/Option';
import useClickOutside from './hooks/useClickOutside';
import useDropdown from './hooks/useDropdown';

const noop = () => {};

interface DropDownProps<T> {
  placeholder?: string;
  value?: T;
  data: T[];
  onChange?: (value: T) => void;
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLSelectElement>) => void;
}

const Dropdown = <T extends string | number>({
  placeholder,
  value: initialValue,
  data = [],
  onChange = noop,
  onFocus = noop,
  onBlur = noop,
  onKeyDown = noop,
}: DropDownProps<T>) => {
  const {
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
  } = useDropdown<T>({
    value: initialValue,
    data,
    onChange,
    onKeyDown,
  });

  useClickOutside(ref, () => setOpen(false));

  let rowWidth = 0;
  let rowHeight = 0;

  const clientRect = refSelect?.current?.getBoundingClientRect();

  if (clientRect) {
    rowWidth = clientRect.width;
    rowHeight = clientRect.height;
  }

  return (
    <label ref={ref} className="relative w-56 cursor-pointer">
      <select
        ref={refSelect}
        className="absolute top-0 h-10 w-full opacity-0 [&+div]:focus:outline-2 [&+div]:focus:outline-indigo-300"
        onClick={handleClick}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
      />
      <div className="h-10 truncate rounded border border-neutral-400 bg-neutral-100 p-2 outline outline-0">
        {value || <span className="text-neutral-400">{placeholder}</span>}
      </div>
      {isOpen && (
        <div className="absolute top-12 overflow-hidden rounded border border-neutral-400">
          <List
            className="scrollbar scrollbar-thumb-neutral-500 scrollbar-track-transparent"
            width={rowWidth}
            height={Math.min(data.length * rowHeight, 200)}
            rowHeight={rowHeight}
            rowCount={data.length}
            scrollToIndex={scrollToIndex}
            overscanRowCount={10}
            noRowsRenderer={() => <div>No data</div>}
            rowRenderer={({ key, index, parent, style }: any) => {
              const rowValue = parent.props.children[index];
              return (
                <Option
                  key={key}
                  active={rowValue === active}
                  selected={rowValue === value}
                  onClick={handleOptionClick(rowValue)}
                  onHover={handleOptionHover(rowValue)}
                  style={style}
                >
                  {rowValue}
                </Option>
              );
            }}
          >
            {data}
          </List>
        </div>
      )}
    </label>
  );
};

export default Dropdown;
