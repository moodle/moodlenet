import { SimpleDropdown } from '@moodlenet/component-library'
import { FC } from 'react'
import './SortBy.scss'

export type SortByProps = {
  selected: string
  setSelection: (e: string) => void
}

export const SortBy: FC<SortByProps> = ({ selected, setSelection }) => {
  return (
    <SimpleDropdown
      list={['Relevant', 'Popular', 'Recent']}
      selected={[selected]}
      label="Sort by"
      onClick={name => setSelection(name)}
      notHighlightInitialSelection={true}
      initialSelection="Relevant"
    />
  )
}

// item is MainColumItem /* | JSX.Element */ => !!item,
