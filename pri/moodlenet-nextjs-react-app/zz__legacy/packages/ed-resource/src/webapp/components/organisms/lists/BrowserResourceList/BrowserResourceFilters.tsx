import type { TextOptionProps } from '@moodlenet/component-library'
import { SecondaryButton } from '@moodlenet/component-library'
import { DropdownFilterField } from '@moodlenet/ed-meta/ui'
import type { SortType } from '@moodlenet/react-app/ui'
import { SortBy } from '@moodlenet/react-app/ui'
import { FilterAltOff } from '@mui/icons-material'

export type SortFilterElement = {
  Item: JSX.Element
  setSelected: (e: string[]) => void
}

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
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}) => (
  <DropdownFilterField
    title={'Language'}
    selected={selected}
    setSelected={setSelected}
    options={options}
  />
)

export const SortByLicenseItem = ({
  selected,
  setSelected,
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}) => (
  <DropdownFilterField
    title={'License'}
    selected={selected}
    setSelected={setSelected}
    options={options}
  />
)

export const SortByLevelItem = ({
  selected,
  setSelected,
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}) => (
  <DropdownFilterField
    title={'Level'}
    selected={selected}
    setSelected={setSelected}
    options={options}
  />
)

export const SortByTypeItem = ({
  selected,
  setSelected,
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}) => (
  <DropdownFilterField
    title={'Type'}
    selected={selected}
    setSelected={setSelected}
    options={options}
  />
)

export const SortBySubjectItem = ({
  selected,
  setSelected,
  options,
}: {
  selected: string[]
  setSelected: (e: string[]) => void
  options: TextOptionProps[]
}) => (
  <DropdownFilterField
    title={'Subject'}
    selected={selected}
    setSelected={setSelected}
    options={options}
  />
)

export const ResetFiltersButton = ({ resetFilters }: { resetFilters(): void }) => (
  <SecondaryButton className="reset-filters-button" abbr="Reset filters" onClick={resetFilters}>
    <FilterAltOff />
  </SecondaryButton>
)

export const BrowserResourceFilters = {
  SortByItem,
  SortByLanguageItem,
  SortByLicenseItem,
  SortByLevelItem,
  SortByTypeItem,
  SortBySubjectItem,
  ResetFiltersButton,
}
