import React from 'react';
// import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LinkButtonProps extends React.ComponentProps<'a'> {
  // 名前変更
  href: string;
  children: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  className,
  ...props
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'p-0 h-auto underline text-blue-500 hover:text-blue-600',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
};
