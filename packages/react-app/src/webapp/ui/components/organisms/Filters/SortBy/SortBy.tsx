import { SimpleDropdown } from '@moodlenet/component-library'
import type { FC } from 'react'
import './SortBy.scss'

export type SortType = 'Relevant' | 'Popular' | 'Recent'
export type SortByProps = {
  selected: SortType
  setSelection: (e: SortType) => void
}
const sortTypes: SortType[] = ['Relevant', 'Popular', 'Recent']
const sortTypesList = sortTypes.map(name => ({
  name,
  key: name,
}))
export const SortBy: FC<SortByProps> = ({ selected, setSelection }) => {
  return (
    <SimpleDropdown
      list={sortTypesList}
      selected={[selected]}
      label="Sort by"
      onClick={name => setSelection(name as SortType)}
      notHighlightInitialSelection={true}
      initialSelection="relevant"
    />
  )
}

// item is MainColumItem /* | JSX.Element */ => !!item,
