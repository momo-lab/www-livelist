import React from 'react';
import { Link } from 'react-router-dom';

interface SocialLinkItemProps {
  to?: string;
  icon: React.ElementType;
  siteName: string;
  onClick?: () => void;
}

export const SocialLinkItem: React.FC<SocialLinkItemProps> = ({
  to,
  icon: Icon,
  siteName,
  onClick,
}) => {
  if (!to) {
    return null;
  }

  return (
    <Link
      to={to}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground flex flex-col items-center hover:underline"
      onClick={onClick}
      aria-label={`${siteName}`}
    >
      <Icon className="h-8 w-8" />
      <span className="mt-1 text-xs">{siteName}</span>
    </Link>
  );
};
