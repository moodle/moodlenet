import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Dropdown, TextOption } from '../Dropdown'
import { LevelDropdown, LicenseDropdown } from './data'

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

// export const DropdownTextStoryProps: DropdownProps = LevelDropdown

//const by = <img src={uploadImageIcon} alt="Link"/>

// export const DropdownTextAndIconsStoryProps: DropdownProps = LicenseDropdown

export const Text: ComponentStory<typeof Dropdown> = () => {
  const [value, setValue] = useState(['0.1', '0.2'])
  return (
    <Dropdown
      getOptionHeader={(value) =>
        LevelDropdown.options.find(([val]) => val === value)![1]
      }
      onChange={({ currentTarget }) => {
        setValue(
          Array.from(currentTarget.selectedOptions).map(({ value }) => value)
        )
      }}
      label={LevelDropdown.label}
      searchByText={() => null}
      value={value}
      edit
      multiple
    >
      {LevelDropdown.options.map(([value, label]) => (
        <TextOption label={label} value={value} key={value} />
      ))}
    </Dropdown>
  )
}

const LicenseDropdownStory: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args}></Dropdown>
)
export const TextAndIcons = LicenseDropdownStory.bind({})
TextAndIcons.args = {
  getOptionHeader: (value) =>
    LicenseDropdown.options.find(([val]) => val === value)![1],
}
export default meta
