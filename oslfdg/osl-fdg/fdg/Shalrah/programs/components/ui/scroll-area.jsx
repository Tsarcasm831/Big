import React from 'react';

export function ScrollArea({ children, className, ...props }) {
  return (
    <div className={className} style={{ overflowY: 'auto' }} {...props}>
      {children}
    </div>
  );
}
