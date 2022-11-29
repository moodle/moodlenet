import { FC, useCallback, useState } from 'react'
import SortButton, { SortState } from './SortButton/SortButton'
import './styles.scss'

export type SortCardDirection = 'horizontal' | 'vertical'

export type SortCardProps = {
  className: string
  title: string
  content: [name: string, label: string, state: SortState][]
  direction?: SortCardDirection
  onChange(sortby: string, state: SortState): unknown
}

export const SortCard: FC<SortCardProps> = ({
  className,
  direction,
  content,
  title,
  onChange,
}) => {
  className += ' ' + direction
  const [currentSort, setCurrentSort] = useState<{
    name: string
    state: SortState
  }>({
    name: content[1] ? content[1][0] : 'none',
    state: 'inactive',
  })

  const onClick = useCallback(
    (name: string, state: SortState) => {
      onChange(name, state)
      setCurrentSort({ name, state })
    },
    [onChange]
  )

  const inContent = content.map(([name, label, state]) => (
    <SortButton
      key={name}
      label={label}
      state={state}
      active={currentSort.name === name ? true : false}
      clicked={onClick}
    />
  ))

  return (
    <div className={'sort-card ' + className}>
      <div className="title">{title}</div>
      <div className="content">{inContent}</div>
    </div>
  )
}

SortCard.defaultProps = {
  direction: 'vertical',
}

export default SortCard
