import { Check } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils';

interface SelectProps {
  options: { label: string; value: string }[];
  onSelected: (val: string) => void;
  selected: string;
  label?: string;
}

const Select: React.FC<SelectProps> = ({ onSelected, options, selected, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    onSelected(value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className='relative flex flex-col w-fit px-2 text-sm'
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='w-full flex items-center gap-2.5 text-left px-4 pr-2 py-2 border rounded bg-white text-gray-800 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none'
        aria-haspopup='listbox'
        aria-expanded={isOpen}>
        <span>{label || selected}</span>
        <svg
          className={cn(
            'w-4 h-4 inline transition-transform duration-200',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='#6B7280'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {isOpen && (
        <ul
          role='listbox'
          className='absolute top-10 z-30 w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2'>
          {options.map(({ label, value }, index) => (
            <li
              key={value}
              role='option'
              aria-selected={selected === value}
              className={cn(
                'px-4 capitalize py-2 flex items-center gap-1 cursor-pointer',
                highlightedIndex === index
                  ? 'bg-indigo-500 text-white'
                  : 'hover:bg-indigo-500 hover:text-white'
              )}
              onClick={() => handleSelect(value)}
              onMouseEnter={() => setHighlightedIndex(index)}>
              <Check size={12} style={{ visibility: selected === value ? 'visible' : 'hidden' }} />
              {label || value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
