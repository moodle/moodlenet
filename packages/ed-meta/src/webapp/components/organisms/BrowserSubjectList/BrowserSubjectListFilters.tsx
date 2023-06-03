import type { SortType } from '@moodlenet/react-app/ui'
import { SortBy } from '@moodlenet/react-app/ui'

export const SortByItem = ({
  selected,
  setSelection,
}: {
  selected: SortType
  setSelection: (e: SortType) => void
}) => <SortBy selected={selected} setSelected={setSelection} />

export const BrowserCollectionFilters = { SortByItem }
