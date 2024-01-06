import type { TextOptionProps } from '@moodlenet/component-library'
import { DropdownFilterField } from '@moodlenet/ed-meta/ui'
import type { FilterElement } from '@moodlenet/react-app/ui'
import { SortBy } from '@moodlenet/react-app/ui'

export type SortFilterElement = {
  Item: JSX.Element
  setSelected: (e: string[]) => void
}

export const SortByItem = ({
  selected,
  setSelected,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
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

export const SortByLanguageItem = ({
  selected,
  setSelected,
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}): FilterElement => ({
  filterItem: {
    Item: () => (
      <DropdownFilterField
        title={'Language'}
        selected={selected}
        setSelected={setSelected}
        options={options}
      />
    ),
    key: 'sort-by-language',
  },
  selected: selected,
  setSelected: setSelected,
})

export const SortByLicenseItem = ({
  selected,
  setSelected,
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}): FilterElement => ({
  filterItem: {
    Item: () => (
      <DropdownFilterField
        title={'License'}
        selected={selected}
        setSelected={setSelected}
        options={options}
      />
    ),
    key: 'sort-by-license',
  },
  selected: selected,
  setSelected: setSelected,
})

export const SortByLevelItem = ({
  selected,
  setSelected,
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}): FilterElement => ({
  filterItem: {
    Item: () => (
      <DropdownFilterField
        title={'Level'}
        selected={selected}
        setSelected={setSelected}
        options={options}
      />
    ),
    key: 'sort-by-level',
  },
  selected: selected,
  setSelected: setSelected,
})

export const SortByTypeItem = ({
  selected,
  setSelected,
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}): FilterElement => ({
  filterItem: {
    Item: () => (
      <DropdownFilterField
        title={'Type'}
        selected={selected}
        setSelected={setSelected}
        options={options}
      />
    ),
    key: 'sort-by-type',
  },
  selected: selected,
  setSelected: setSelected,
})

export const SortBySubjectItem = ({
  selected,
  setSelected,
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}): FilterElement => ({
  filterItem: {
    Item: () => (
      <DropdownFilterField
        title={'Subject'}
        selected={selected}
        setSelected={setSelected}
        options={options}
      />
    ),
    key: 'sort-by-subject',
  },
  selected: selected,
  setSelected: setSelected,
})

export const BrowserResourceFilters = {
  SortByItem,
  SortByLanguageItem,
  SortByLicenseItem,
  SortByLevelItem,
  SortByTypeItem,
  SortBySubjectItem,
}
