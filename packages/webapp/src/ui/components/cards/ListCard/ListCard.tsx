import { FC, ReactNode } from 'react'
import './styles.scss'

export type ListCardProps = {
  className: string
  title?: string | undefined
  content: ReactNode[]
  noCard?: boolean
  maxWidth?: string | undefined | 'auto'
  direction?: 'vertical' | 'horizontal'
}

export const ListCard: FC<ListCardProps> = ({ className, content, direction, title, noCard, children }) => {
  return (
    <div className={`list-card ${className} ${noCard ? 'no-card' : ''}`}>
      {(title || children) && <div className="title">{title ? title : <div>{children}</div>}</div>}
      <div className={`content ${direction} ${direction === 'horizontal' ? 'scroll' : ''}`}>{content}</div>
    </div>
  )
}

ListCard.defaultProps = {
  noCard: false,
  direction: 'vertical'
}

export default ListCard
