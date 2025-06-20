import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TooltipProps } from '../types';

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

// Tooltip组件，使用Portal避免z-index问题
export const Tooltip: React.FC<TooltipProps> = ({ children, content, maxWidth = 'w-64' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
      setIsVisible(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            className={cn(
              'fixed z-[99999] mb-2 rounded-lg bg-gray-800 px-3 py-2 text-xs text-white shadow-lg',
              maxWidth
            )}
            style={{
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {content}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>,
          document.body
        )}
    </>
  );
};
