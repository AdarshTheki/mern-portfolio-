import React from 'react';

type ButtonProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  svg?: React.ReactNode;
  name?: string;
  className?: string;
};

const Button: ButtonProps = ({ svg = '', name = '', className = '', ...prop }) => {
  return (
    <button
      {...prop}
      className={`flex items-center gap-2.5 border rounded-lg px-4 py-2 text-sm active:scale-95 hover:opacity-90 transition ${className}`}>
      {!!svg && svg}
      {!!name && name}
    </button>
  );
};

export default Button;
