import { SortBy } from '@moodlenet/react-app/ui'

export const SortByItem = (selected: string, setSelected: (e: string) => void) => (
  <SortBy selected={selected} setSelected={setSelected} />
)

export const BrowserResourceFilters = { SortByItem }
