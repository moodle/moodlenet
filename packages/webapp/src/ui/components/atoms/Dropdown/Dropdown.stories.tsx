import { ComponentMeta, ComponentStory } from '@storybook/react'
import { LevelDropdown, LicenseDropdown } from '../../pages/NewResource/FieldsData'
import { Dropdown, DropdownProps } from './Dropdown'

const meta: ComponentMeta<typeof Dropdown> = {
  title: 'Atoms/Dropdown',
  component: Dropdown,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['DropdownTextStoryProps', 'DropdownTextAndIconsStoryProps'],
  decorators:[
    (Story)=>(<div style={{width: '300px'/*, height: '1200px', position: 'absolute'*/}}><Story/></div>)
  ]
}

export const DropdownTextStoryProps: DropdownProps = LevelDropdown


//const by = <img src={uploadImageIcon} alt="Link"/>

export const DropdownTextAndIconsStoryProps: DropdownProps = LicenseDropdown

const DropdownStory: ComponentStory<typeof Dropdown> = args => <Dropdown {...args}></Dropdown>

export const Text = DropdownStory.bind({})
Text.args = DropdownTextStoryProps

export const TextAndIcons = DropdownStory.bind({})
TextAndIcons.args = DropdownTextAndIconsStoryProps

export default meta
