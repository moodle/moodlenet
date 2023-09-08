import { SimpleDropdown } from '@moodlenet/component-library'
import type { FC } from 'react'

export type SortByLanguageType =
  | 'English'
  | 'Spanish'
  | 'French'
  | 'German'
  | 'Italian'
  | 'Catalan'
  | 'Portuguese'
  | 'Japanese'
export type SortByLanguageProps = {
  selected: SortByLanguageType[]
  setSelected: (e: SortByLanguageType[]) => void
}
const SortByLanguages: SortByLanguageType[] = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Catalan',
  'Portuguese',
  'Japanese',
]

const SortByLanguagesList = SortByLanguages.map(name => ({
  name,
  key: name,
}))
export const SortByLanguage: FC<SortByLanguageProps> = ({ selected, setSelected }) => {
  return (
    <SimpleDropdown
      list={SortByLanguagesList}
      selected={selected}
      label="Languages"
      onClick={name =>
        setSelected(
          selected.includes(name as SortByLanguageType)
            ? selected.filter(e => e !== name)
            : [...selected, name as SortByLanguageType],
        )
      }
      notHighlightInitialSelection={true}
      // initialSelection="relevant"
    />
  )
}

// item is MainColumItem /* | JSX.Element */ => !!item,
