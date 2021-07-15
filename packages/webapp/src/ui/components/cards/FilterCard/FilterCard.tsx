import { FC, ReactNode } from 'react'
import './styles.scss'

export type FilterCardProps = {
  className: string
  title: string
  content: ReactNode[]
}

export const FilterCard: FC<FilterCardProps> = ({ className, content, title }) => {
  return (
    <div className={'filter-card ' + className}>
      <div className="title">{title}</div>
      <div className="content">{content}</div>
    </div>
  )
}

export default FilterCard
