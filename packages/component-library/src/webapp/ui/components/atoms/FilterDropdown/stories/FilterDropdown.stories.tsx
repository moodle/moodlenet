import { ComponentMeta, ComponentStory } from '@storybook/react'
import { IconPill, IconTextOption, SimplePill, TextOption } from '../../Dropdown/Dropdown.js'
import { LevelDropdown, LicenseDropdown } from '../../Dropdown/stories/storiesData.js'
import { FilterDropdown } from '../FilterDropdown.js'
import { useStoriesDDCtrl } from './storiesUtil.js'

const meta: ComponentMeta<typeof FilterDropdown> = {
  title: 'Atoms/DropdownNew',
  component: FilterDropdown,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['DropdownTextStoryProps', 'DropdownTextAndIconsStoryProps'],
  decorators: [
    Story => (
      <div style={{ width: '300px' /*, height: '1200px', position: 'absolute'*/ }}>
        <Story />
      </div>
    ),
  ],
}

export const Text: ComponentStory<typeof FilterDropdown> = () => {
  const {
    filteredOpts,
    setFilter,
    selectedOpts,
    onChange,
    //filterString,
    value,
  } = useStoriesDDCtrl({
    initialSelectionIndexes: [],
    options: LevelDropdown.options,
  })
  const edit = true
  return (
    <FilterDropdown
      value={value && value[0]}
      pills={
        selectedOpts &&
        selectedOpts.map(([value, label], i) => (
          <SimplePill label={label} value={value} edit={edit} key={i} />
        ))
      }
      onChange={onChange}
      label={LevelDropdown.label}
      searchByText={setFilter}
      edit={edit}
    >
      {selectedOpts &&
        selectedOpts.map(([value, label]) => (
          <TextOption label={label} value={value} key={value} />
        ))}

      {filteredOpts
        .filter(([value]) => !(selectedOpts && selectedOpts.map(([v]) => v).includes(value)))
        .map(([value, label]) => (
          <TextOption label={label} value={value} key={value} />
        ))}
    </FilterDropdown>
  )
}

export const Error: ComponentStory<typeof FilterDropdown> = () => {
  const {
    filteredOpts,
    setFilter,
    selectedOpts,
    onChange,
    //filterString,
    value,
  } = useStoriesDDCtrl({
    initialSelectionIndexes: [],
    options: LevelDropdown.options,
  })
  const edit = true
  return (
    <FilterDropdown
      value={value && value[0]}
      pills={
        selectedOpts &&
        selectedOpts.map(([value, label], i) => (
          <SimplePill label={label} value={value} edit={edit} key={i} />
        ))
      }
      onChange={onChange}
      label={LevelDropdown.label}
      searchByText={setFilter}
      edit={edit}
      error="You must select and option"
    >
      {selectedOpts &&
        selectedOpts.map(([value, label]) => (
          <TextOption label={label} value={value} key={value} />
        ))}

      {filteredOpts
        .filter(([value]) => !(selectedOpts && selectedOpts.map(([v]) => v).includes(value)))
        .map(([value, label]) => (
          <TextOption label={label} value={value} key={value} />
        ))}
    </FilterDropdown>
  )
}

export const TextMulti: ComponentStory<typeof FilterDropdown> = () => {
  const { filteredOpts, setFilter, value, selectedOpts, onChange } = useStoriesDDCtrl({
    initialSelectionIndexes: [3],
    options: LevelDropdown.options,
  })
  const edit = true

  return (
    <FilterDropdown
      pills={
        selectedOpts &&
        selectedOpts.map(([value, label], i) => (
          <SimplePill label={label} value={value} edit={edit} key={i} />
        ))
      }
      onChange={onChange}
      label={LevelDropdown.label}
      searchByText={setFilter}
      value={value}
      multiple
      multilines={false}
      edit={edit}
    >
      {selectedOpts &&
        selectedOpts.map(([value, label]) => (
          <TextOption label={label} value={value} key={value} />
        ))}

      {filteredOpts
        .filter(([value]) => selectedOpts && !selectedOpts.map(([v]) => v).includes(value))
        .map(([value, label]) => (
          <TextOption label={label} value={value} key={value} />
        ))}
    </FilterDropdown>
  )
}

export const TextAndIcons: ComponentStory<typeof FilterDropdown> = () => {
  const { filteredOpts, filterString, setFilter, value, selectedOpts, onChange } = useStoriesDDCtrl(
    {
      initialSelectionIndexes: [],
      options: LicenseDropdown.options,
    },
  )
  const edit = true

  return (
    <FilterDropdown
      pills={
        selectedOpts && selectedOpts.map(([_, __, icon], i) => <IconPill key={i} icon={icon} />)
      }
      onChange={onChange}
      label={LicenseDropdown.label}
      searchByText={setFilter}
      searchText={filterString}
      value={value && value[0]}
      edit={edit}
    >
      {selectedOpts &&
        selectedOpts.map(([value, label, icon]) => (
          <IconTextOption icon={icon} label={label} value={value} key={value} />
        ))}

      {filteredOpts
        .filter(([value]) => selectedOpts && !selectedOpts.map(([v]) => v).includes(value))
        .map(([value, label, icon]) => (
          <IconTextOption icon={icon} label={label} value={value} key={value} />
        ))}
    </FilterDropdown>
  )
}

export default meta
