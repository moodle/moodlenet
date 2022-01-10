import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Dropdown, IconTextOption, TextOption } from '../Dropdown'
import { LevelDropdown, LicenseDropdown } from './storiesData'
import { useStoriesDDCtrl } from './storiesUtil'

const meta: ComponentMeta<typeof Dropdown> = {
  title: 'Atoms/DropdownNew',
  component: Dropdown,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['DropdownTextStoryProps', 'DropdownTextAndIconsStoryProps'],
  decorators: [
    (Story) => (
      <div
        style={{ width: '300px' /*, height: '1200px', position: 'absolute'*/ }}
      >
        <Story />
      </div>
    ),
  ],
}

export const Text: ComponentStory<typeof Dropdown> = () => {
  const {
    filteredOpts,
    setFilter,
    value,
    headerLabels,
    onChange,
    filterString,
  } = useStoriesDDCtrl({
    initialSelectionIndexes: [3],
    options: LevelDropdown.options,
  })

  return (
    <Dropdown
      headerLabels={headerLabels}
      onChange={onChange}
      label={LevelDropdown.label}
      searchByText={setFilter}
      searchText={filterString}
      value={value[0]}
      edit
    >
      {filteredOpts.map(([value, label]) => (
        <TextOption label={label} value={value} key={value} />
      ))}
    </Dropdown>
  )
}

export const TextMulti: ComponentStory<typeof Dropdown> = () => {
  const {
    filteredOpts,
    setFilter,
    value,
    headerLabels,
    onChange,
    filterString,
  } = useStoriesDDCtrl({
    initialSelectionIndexes: [3],
    options: LevelDropdown.options,
  })

  return (
    <Dropdown
      headerLabels={headerLabels}
      onChange={onChange}
      label={LevelDropdown.label}
      searchByText={setFilter}
      searchText={filterString}
      value={value}
      multiple
      edit
    >
      {filteredOpts.map(([value, label]) => (
        <TextOption label={label} value={value} key={value} />
      ))}
    </Dropdown>
  )
}

export const TextAndIcons: ComponentStory<typeof Dropdown> = () => {
  const {
    filteredOpts,
    setFilter,
    value,
    headerLabels,
    onChange,
    filterString,
  } = useStoriesDDCtrl({
    initialSelectionIndexes: [0],
    options: LicenseDropdown.options,
  })

  return (
    <Dropdown
      headerLabels={headerLabels}
      onChange={onChange}
      label={LicenseDropdown.label}
      searchByText={setFilter}
      searchText={filterString}
      value={value[0]}
      edit
    >
      {filteredOpts.map(([value, label, icon]) => (
        <IconTextOption icon={icon} label={label} value={value} key={value} />
      ))}
    </Dropdown>
  )
}

export default meta
