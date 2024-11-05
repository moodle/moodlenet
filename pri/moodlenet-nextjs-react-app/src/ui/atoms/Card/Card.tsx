'use client'
import type { CSSProperties, ReactNode } from 'react'
import { forwardRef } from 'react'
import { useForwardedRef } from '../../lib/hooks'
import './Card.scss'

export type CardProps = {
  className?: string
  role?: 'navigation'
  style?: CSSProperties
  hideBorderWhenSmall?: boolean
  noCard?: boolean
  hover?: boolean
  removePaddingWhenSmall?: boolean
  children?: ReactNode
  onClick?(arg0: unknown): unknown
  onMouseDown?(arg0: unknown): unknown
}

export const Card = forwardRef<HTMLDivElement | null | undefined, CardProps>((props, ref) => {
  const {
    onClick,
    onMouseDown,
    className,
    noCard,
    hover,
    role,
    style,
    hideBorderWhenSmall,
    removePaddingWhenSmall,
    children,
  } = props

  const cardElementRef = useForwardedRef(ref)

  return (
    <div
      ref={cardElementRef as any}
      role={role}
      className={`card ${className ? className : ''} ${hideBorderWhenSmall ? 'hide-border' : ''} ${
        noCard ? 'no-card' : ''
      } ${removePaddingWhenSmall ? 'remove-padding' : ''} ${hover ? 'hover' : ''}`}
      style={style}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'
