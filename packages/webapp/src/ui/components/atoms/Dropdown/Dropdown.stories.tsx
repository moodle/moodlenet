import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Dropdown, DropdownProps } from './Dropdown'

const meta: ComponentMeta<typeof Dropdown> = {
  title: 'Components/Atoms/Dropdown',
  component: Dropdown,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['DropdownStoryProps']
}

export const DropdownStoryProps: DropdownProps = {
  label: 'Just a text field',
  placeholder: 'Start typing to fill it',
  options: [
    '0.1 Early childhood educational development',
    '0.2 Pre-primary education',
    '1 Primary education',
    '2 Lower secondary education',
    '3 Upper secondary education',
    '4 Post-secondary non-tertiary education',
    '5 Short-cycle tertiary education',
    '6 Bachelor or equivalent',
    '7 Master or equivalent',
    '8 Doctoral or equivalent'

  ]
}

const DropdownStory: ComponentStory<typeof Dropdown> = args => <Dropdown {...args}></Dropdown>

export const Default = DropdownStory.bind({})
Default.args = DropdownStoryProps

export default meta
