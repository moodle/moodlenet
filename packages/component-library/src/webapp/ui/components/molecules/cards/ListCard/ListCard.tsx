import type { FC, ReactElement, ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'
import './ListCard.scss'

export type ListActionsType = { element: ReactElement; position: 'start' | 'end' }

export type ListCardProps = {
  className?: string
  header?: string | ReactNode | undefined
  footer?: string | ReactNode | undefined
  content: { el: ReactNode; key: string }[]
  minGrid?: number
  noCard?: boolean
  maxRows?: number
  direction?: 'vertical' | 'horizontal' | 'wrap'
  actions?: ListActionsType
}

export const ListCard: FC<ListCardProps> = ({
  className,
  content,
  direction,
  header,
  footer,
  minGrid,
  maxRows,
  noCard,
  actions,
}) => {
  const contentDiv = useRef<HTMLDivElement>(null)
  const element = useRef<HTMLDivElement>(null)
  const contentWithKeys = useMemo(
    () =>
      content.map(({ el, key }, i) => {
        const elementWithKey = (
          <div className={'element'} key={key} {...(i === 0 && { ref: element })}>
            {el}
          </div>
        )

        return elementWithKey
      }),
    [content],
  )

  const [maxHeight, setMaxHeight] = useState<undefined | number>(undefined)
  // const [paddingTop, setPaddingTop] = useState<number | undefined>(undefined)
  // const [paddingBottom, setPaddingBottom] = useState<number | undefined>(undefined)

  const parent = contentDiv.current
  const computedStyle = parent && window.getComputedStyle(parent)
  const childHeight = parent?.children[0]?.clientHeight
  const gap = Number((parent ? computedStyle.gap : '').replace('px', ''))
  const paddingTop = Number((computedStyle ? computedStyle.paddingTop : '').replace('px', ''))
  const paddingBottom = Number((computedStyle ? computedStyle.paddingBottom : '').replace('px', ''))

  const newMaxHeight =
    childHeight &&
    maxRows &&
    childHeight * maxRows + (maxRows - 1) * gap + paddingTop + paddingBottom
  newMaxHeight && setMaxHeight(newMaxHeight)

  return (
    <div className={`list-card ${className} ${noCard ? 'no-card' : ''}`}>
      {header && <div className="list-card-header">{header}</div>}
      {actions?.element && actions.position === 'start' && (
        <div className="action">{actions.element}</div>
      )}
      {contentWithKeys && contentWithKeys.length > 0 && (
        <div
          className={`content ${direction} ${direction === 'horizontal' ? 'scroll' : ''} ${
            minGrid ? 'grid' : ''
          }`}
          style={{
            // ...(maxHeight && { maxHeight: `${maxHeight}px` }),
            ...(maxRows &&
              maxHeight && {
                maxHeight: `${maxHeight}px`,
              }),

            // maxHeight: maxHeight ? `${maxHeight}px` : 'auto',
            gridTemplateColumns: minGrid && `repeat(auto-fill, minmax(${minGrid}px, 1fr))`,
          }}
          ref={contentDiv}
        >
          {contentWithKeys}
        </div>
      )}
      {actions?.element && actions.position === 'end' && (
        <div className="action">{actions.element}</div>
      )}
      {footer && <div className="list-card-footer">{footer}</div>}
    </div>
  )
}

ListCard.defaultProps = {
  noCard: false,
  direction: 'vertical',
}

export default ListCard
