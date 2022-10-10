import { CSSProperties, FC, ReactNode } from 'react'
import './Card.scss'
export declare type CardProps = {
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
export declare const Card: FC<CardProps>
export default Card
//# sourceMappingURL=Card.d.ts.map
