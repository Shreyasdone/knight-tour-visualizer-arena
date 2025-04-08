
import React from 'react';
import Knight from './Knight';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Computing tour...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="flex space-x-2">
        <Knight color="#FFB74D" size={36} />
        <Knight color="#E57373" size={36} className="delay-100" />
        <Knight color="#64B5F6" size={36} className="delay-200" />
        <Knight color="#81C784" size={36} className="delay-300" />
      </div>
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default Loader;
