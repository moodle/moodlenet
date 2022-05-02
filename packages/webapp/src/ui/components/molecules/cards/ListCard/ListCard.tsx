import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import './styles.scss'

export type ListCardProps = {
  className: string
  title?: string | ReactNode | undefined
  content: ReactNode[]
  minGrid?: number
  noCard?: boolean
  maxWidth?: string | undefined | 'auto'
  maxRows?: number
  direction?: 'vertical' | 'horizontal' | 'wrap'
  actions?: { element: ReactNode; position: 'start' | 'end' }
}

export const ListCard: FC<ListCardProps> = ({
  className,
  content,
  direction,
  title,
  minGrid,
  maxRows,
  noCard,
  actions,
}) => {
  const [maxHeight, setMaxHeight] = useState<number | null>(null)
  const contentDiv = useRef<HTMLDivElement>(null)
  const element = useRef<HTMLDivElement>(null)
  const contentWithKeys = content.map((el, i) => {
    const elementWithKey = [
      <div
        className={'element'}
        key={i}
        {...(maxRows && i === 0 && { ref: element })}
      >
        {el}
      </div>,
    ]
    return elementWithKey
  })

  useEffect(() => {
    const gap = contentDiv.current
      ? getComputedStyle(contentDiv.current).gap
      : '0'
    const elementHeight = element.current?.clientHeight
    const totalMaxHeight =
      maxRows && elementHeight
        ? maxRows * elementHeight + parseInt(gap) * (maxRows - 1) + 10
        : null
    totalMaxHeight && setMaxHeight(totalMaxHeight)
  }, [setMaxHeight, maxRows])

  return (
    <div className={`list-card ${className} ${noCard ? 'no-card' : ''}`}>
      {title && <div className="title">{title}</div>}
      {actions?.element && actions.position === 'start' && (
        <div className="action">{actions.element}</div>
      )}
      {contentWithKeys && contentWithKeys.length > 0 && (
        <div
          className={`content ${direction} ${
            direction === 'horizontal' ? 'scroll' : ''
          } ${minGrid ? 'grid' : ''}`}
          style={{
            maxHeight: maxHeight ? `${maxHeight}px` : 'auto',
            gridTemplateColumns:
              minGrid && `repeat(auto-fill, minmax(${minGrid}px, 1fr))`,
          }}
          ref={contentDiv}
        >
          {contentWithKeys}
        </div>
      )}
      {actions?.element && actions.position === 'end' && (
        <div className="action">{actions.element}</div>
      )}
    </div>
  )
}

ListCard.defaultProps = {
  noCard: false,
  direction: 'vertical',
}

export default ListCard
