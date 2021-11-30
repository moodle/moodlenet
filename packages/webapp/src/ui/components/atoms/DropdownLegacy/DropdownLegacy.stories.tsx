import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  LevelDropdown,
  LicenseDropdown,
} from '../../pages/NewResource/FieldsData'
import { DropdownLegacy, DropdownLegacyProps } from './DropdownLegacy'

const meta: ComponentMeta<typeof DropdownLegacy> = {
  title: 'Atoms/DropdownLegacy',
  component: DropdownLegacy,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'DropdownLegacyTextStoryProps',
    'DropdownLegacyTextAndIconsStoryProps',
  ],
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

export const DropdownLegacyTextStoryProps: DropdownLegacyProps = LevelDropdown

//const by = <img src={uploadImageIcon} alt="Link"/>

export const DropdownLegacyTextAndIconsStoryProps: DropdownLegacyProps =
  LicenseDropdown

const DropdownLegacyStory: ComponentStory<typeof DropdownLegacy> = (args) => (
  <DropdownLegacy {...args}></DropdownLegacy>
)

export const Text = DropdownLegacyStory.bind({})
Text.args = DropdownLegacyTextStoryProps

export const TextAndIcons = DropdownLegacyStory.bind({})
TextAndIcons.args = DropdownLegacyTextAndIconsStoryProps

export default meta
