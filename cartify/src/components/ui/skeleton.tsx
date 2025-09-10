import React from 'react';
import { cn } from '../../utils';

type SkeletonProps = {
  width?: string;
  height?: string;
  circle?: boolean;
  className?: string;
};

const Skeleton: React.FC<SkeletonProps> = ({ width, height, circle = false, className = '' }) => {
  return (
    <div
      className={cn('animate-pulse bg-gray-300', circle ? 'rounded-full' : 'rounded-md', className)}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
};

export default Skeleton;
