'use client';

import React, { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';

interface OptionProps {
  children: ReactNode;
  active?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  style?: CSSProperties;
}

const Option = ({ children, active, selected, onClick, onHover, style }: OptionProps) => {
  return (
    <div
      style={style}
      className={clsx(
        'h-10 truncate bg-neutral-100 p-2 text-zinc-800',
        selected && '!bg-indigo-100',
        active && '!bg-indigo-800 !text-neutral-200',
      )}
      onClick={onClick}
      onMouseOver={onHover}
    >
      {children}
    </div>
  );
};

export default Option;
