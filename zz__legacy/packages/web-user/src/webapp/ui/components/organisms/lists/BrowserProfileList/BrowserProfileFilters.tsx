import type { SortType } from '@moodlenet/react-app/ui'
import { SortBy } from '@moodlenet/react-app/ui'

export const SortByItem = ({
  selected,
  setSelected,
}: {
  selected: SortType
  setSelected: (e: SortType) => void
}) => <SortBy selected={selected} setSelected={setSelected} />

export const BrowserProfileFilters = { SortByItem }
