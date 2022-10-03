import { CSSProperties, FC, PropsWithChildren } from 'react'
import './styles.scss'

export type CardProps = {
  className?: string
  style?: CSSProperties
  hideBorderWhenSmall?: boolean
  noCard?: boolean
  hover?: boolean
  removePaddingWhenSmall?: boolean
  onClick?(arg0: unknown): unknown
  onMouseDown?(arg0: unknown): unknown
}

export const Card: FC<PropsWithChildren<CardProps>> = ({
  onClick,
  onMouseDown,
  className,
  noCard,
  hover,
  style,
  hideBorderWhenSmall,
  removePaddingWhenSmall,
  children,
}) => {
  return (
    <div
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
}

Card.defaultProps = {
  removePaddingWhenSmall: false,
}

export default Card
