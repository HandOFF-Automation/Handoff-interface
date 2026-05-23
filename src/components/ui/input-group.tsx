import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'group/input-group relative flex w-full min-w-0 flex-col rounded-2xl border border-input bg-transparent transition-colors outline-none',
        className,
      )}
      {...props}
    />
  )
}

function InputGroupAddon({ className, align = 'inline-start', ...props }: React.ComponentProps<'div'> & { align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end' }) {
  return <div role="group" data-slot="input-group-addon" data-align={align} className={cn('flex h-auto items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground', align === 'inline-start' ? 'order-first pl-3' : align === 'inline-end' ? 'order-last pr-3' : 'w-full px-3', className)} {...props} />
}

function InputGroupButton({ className, type = 'button', variant = 'ghost', size = 'xs', ...props }: Omit<React.ComponentProps<typeof Button>, 'size'> & { size?: 'xs' | 'sm' | 'icon-xs' | 'icon-sm' }) {
  return <Button type={type} data-size={size} variant={variant} className={cn('flex items-center gap-2 text-sm shadow-none', className)} {...props} />
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'min-h-[112px] w-full resize-none rounded-none border-0 bg-transparent px-3 py-3 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent',
        className,
      )}
      {...props}
    />
  )
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea }
