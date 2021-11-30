import { FC, ReactNode } from 'react'
import './styles.scss'

export type FilterCardDirection = 'horizontal' | 'vertical'

export type FilterCardProps = {
  className: string
  title: string
  content: ReactNode[]
  direction?: FilterCardDirection
}

export const FilterCard: FC<FilterCardProps> = ({
  className,
  direction,
  content,
  title,
}) => {
  className += ' ' + direction
  return (
    <div className={'filter-card ' + className}>
      <div className="title">{title}</div>
      <div className="content">{content}</div>
    </div>
  )
}

FilterCard.defaultProps = {
  direction: 'vertical',
}

export default FilterCard
