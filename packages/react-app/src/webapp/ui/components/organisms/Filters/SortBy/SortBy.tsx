import { SimpleDropdown } from '@moodlenet/component-library'
import type { FC } from 'react'

export type SortType = 'Relevant' | 'Popular' | 'Recent'
export type SortByProps = {
  selected: SortType
  setSelected: (e: SortType) => void
}
const sortTypes: SortType[] = ['Relevant', 'Popular', 'Recent']
const sortTypesList = sortTypes.map(name => ({
  label: name,
  value: name,
}))
export const SortBy: FC<SortByProps> = ({ selected, setSelected }) => {
  return (
    <SimpleDropdown
      options={sortTypesList}
      selected={[selected]}
      label="Sort by"
      onClick={name => setSelected(name as SortType)}
      notHighlightInitialSelection={true}
      initialSelection="relevant"
    />
  )
}

// item is MainColumItem /* | JSX.Element */ => !!item,
