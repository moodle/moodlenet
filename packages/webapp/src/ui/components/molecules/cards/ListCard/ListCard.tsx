import React, { FC, ReactNode } from 'react'
import './styles.scss'

export type ListCardProps = {
  className: string
  title?: string | ReactNode | undefined
  content: ReactNode[]
  minGrid?: number
  noCard?: boolean
  maxWidth?: string | undefined | 'auto'
  direction?: 'vertical' | 'horizontal'
}

export const ListCard: FC<ListCardProps> = ({ className, content, direction, title, minGrid, noCard }) => {
  const contentWithKeys = content.map((element, i) => {
    return [<React.Fragment key={i}>{element}</React.Fragment>]
  })
  return (
    <div className={`list-card ${className} ${noCard ? 'no-card' : ''}`}>
      {title && <div className="title">{title}</div>}
      <div
        className={`content ${direction} ${direction === 'horizontal' ? 'scroll' : ''} ${minGrid ? 'grid' : ''}`}
        style={{ gridTemplateColumns: minGrid && `repeat(auto-fit, minmax(${minGrid}px, 1fr))` }}
      >
        {contentWithKeys}
      </div>
    </div>
  )
}

ListCard.defaultProps = {
  noCard: false,
  direction: 'vertical',
}

export default ListCard
