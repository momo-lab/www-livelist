import React from 'react';
// import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LinkButtonProps extends React.ComponentProps<'a'> {
  // 名前変更
  href: string;
  children: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({ href, children, className, ...props }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('h-auto p-0 text-blue-500 underline hover:text-blue-600', className)}
      {...props}
    >
      {children}
    </a>
  );
};
