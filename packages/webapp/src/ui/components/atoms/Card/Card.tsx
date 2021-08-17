import { CSSProperties, FC } from 'react'
import './styles.scss'

export type CardProps = {
  className?: string
  style?: CSSProperties
  hideBorderWhenSmall?: boolean
  removePaddingWhenSmall?: boolean
}

export const Card: FC<CardProps> = ({ className, style, hideBorderWhenSmall, removePaddingWhenSmall, children }) => {
  return (
    <div
      className={`card ${className}${hideBorderWhenSmall ? ' hide-border' : ''} ${
        removePaddingWhenSmall ? 'remove-padding' : ''
      }`}
      style={style}
    >
      {children}
    </div>
  )
}

Card.defaultProps = {
  removePaddingWhenSmall: false,
}

export default Card
