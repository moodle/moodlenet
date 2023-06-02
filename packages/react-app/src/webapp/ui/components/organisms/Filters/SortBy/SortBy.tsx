import { SimpleDropdown } from '@moodlenet/component-library'
import type { FC } from 'react'
import './SortBy.scss'

export type SortByProps = {
  selected: string
  setSelected: (e: string) => void
}

export const SortBy: FC<SortByProps> = ({ selected, setSelected }) => {
  return (
    <SimpleDropdown
      list={[
        { name: 'Relevant', key: 'relevant' },
        { name: 'Popular', key: 'popular' },
        { name: 'Recent', key: 'recent' },
      ]}
      selected={[selected]}
      label="Sort by"
      onClick={key => setSelected(key)}
      notHighlightInitialSelection={true}
      initialSelection="relevant"
    />
  )
}

// item is MainColumItem /* | JSX.Element */ => !!item,
