import type { FilterElement, SortType } from '@moodlenet/react-app/ui'
import { SortBy } from '@moodlenet/react-app/ui'

export const SortByItem = ({
  selected,
  setSelected,
}: {
  selected: SortType[]
  setSelected: (e: SortType[]) => void
}): FilterElement => {
  return {
    filterItem: {
      Item: () => <SortBy selected={selected} setSelected={setSelected} />,
      key: 'sort-by',
    },
    selected: selected,
    setSelected: setSelected,
  }
}

export const BrowserCollectionFilters = { SortByItem }
