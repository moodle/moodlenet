import { CSSProperties, forwardRef, ReactNode } from 'react'
import { useForwardedRef } from '../../../lib/useForwardedRef.mjs'
import './Card.scss'

export type CardProps = {
  className?: string
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
    style,
    hideBorderWhenSmall,
    removePaddingWhenSmall,
    children,
  } = props

  const cardElementRef = useForwardedRef(ref)

  return (
    <div
      ref={cardElementRef as any}
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

Card.defaultProps = {
  removePaddingWhenSmall: false,
}
Card.displayName = 'Card'

export default Card
