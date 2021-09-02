import { CSSProperties, FC } from 'react'
import './styles.scss'

export type CardProps = {
  className?: string
  style?: CSSProperties
  hideBorderWhenSmall?: boolean
  noCard?: boolean
  removePaddingWhenSmall?: boolean
  onClick?(arg0: unknown): unknown
}

export const Card: FC<CardProps> = ({
  onClick,
  className,
  noCard,
  style,
  hideBorderWhenSmall,
  removePaddingWhenSmall,
  children,
}) => {
  return (
    <div
      className={`card${className ? ''+className : ''}${hideBorderWhenSmall ? ' hide-border' : ''}${noCard ? ' no-card' : ''}${
        removePaddingWhenSmall ? ' remove-padding' : ''
      }`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

Card.defaultProps = {
  removePaddingWhenSmall: false,
}

export default Card
