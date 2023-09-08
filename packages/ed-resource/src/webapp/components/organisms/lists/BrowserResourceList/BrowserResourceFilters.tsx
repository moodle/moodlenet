import type { SortByLanguageType, SortType } from '@moodlenet/react-app/ui'
import { SortBy, SortByLanguage } from '@moodlenet/react-app/ui'

export const SortByItem = ({
  selected,
  setSelected,
}: {
  selected: SortType
  setSelected: (e: SortType) => void
}) => <SortBy selected={selected} setSelected={setSelected} />

export const SortByLanguageItem = ({
  selected,
  setSelected,
}: {
  selected: SortByLanguageType[]
  setSelected: (e: SortByLanguageType[]) => void
}) => <SortByLanguage selected={selected} setSelected={setSelected} />

export const BrowserResourceFilters = { SortByItem, SortByLanguageItem }
