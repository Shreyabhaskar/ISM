"use client"
import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarToggleProps {
  size?: number;
  onChange?: (filled: boolean) => void;
}

export default function StarToggle({ size = 32, onChange }: StarToggleProps) {
  const [filled, setFilled] = useState(false);

  const handleClick = () => {
    const newState = !filled;
    setFilled(newState);
    onChange?.(newState);
  };

  return (
    <button
      type="button"
      className="transition-transform hover:scale-110 focus:outline-none focus:scale-110"
      onClick={handleClick}
    >
      <Star
        size={size}
        className={`transition-all duration-300 ${
          filled ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-gray-300'
        }`}
      />
    </button>
  );
}