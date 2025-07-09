import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        mofcro:
          'border-transparent bg-mofcro-bg text-mofcro-fg hover:bg-mofcro-bg/80',
        'mofcro-outline': 'border-mofcro-text text-mofcro-text',
        girudoru:
          'border-transparent bg-girudoru-bg text-girudoru-fg hover:bg-girudoru-bg/80',
        'girudoru-outline': 'border-girudoru-text text-girudoru-text',
        mofrurock:
          'border-transparent bg-mofrurock-bg text-mofrurock-fg hover:bg-mofrurock-bg/80',
        'mofrurock-outline': 'border-mofrurock-text text-mofrurock-text',
        osahoto:
          'border-transparent bg-osahoto-bg text-osahoto-fg hover:bg-osahoto-bg/80',
        'osahoto-outline': 'border-osahoto-text text-osahoto-text',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
