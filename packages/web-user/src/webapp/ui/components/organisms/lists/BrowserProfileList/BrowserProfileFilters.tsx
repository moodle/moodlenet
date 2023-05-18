import { SortBy } from '@moodlenet/react-app/ui'

export const SortByItem = (selected: string, setselected: (e: string) => void) => (
  <SortBy selected={selected} setSelection={setselected} />
)

export const BrowserProfileFilters = { SortByItem }
