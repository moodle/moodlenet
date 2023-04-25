import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SimpleDropdown, SimpleDropdownProps } from './SimpleDropdown.js'

const meta: ComponentMeta<typeof SimpleDropdown> = {
  title: 'Atoms/SimpleDropdown',
  component: SimpleDropdown,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'SimpleDropdownDefaultProps',
    'SimpleDropdownStoryProps',
    'SimpleDropdownErrorStoryProps',
    'TextAreaFieldStoryProps',
  ],
}

export const SimpleDropdownStoryProps: SimpleDropdownProps = {
  label: 'Label',
  list: ['Item 1', 'Item 2', 'Item 3'],
  selected: ['Item 1'],
  onClick: () => undefined,
}

export const Template: ComponentStory<typeof SimpleDropdown> = () => (
  <SimpleDropdown {...SimpleDropdownStoryProps} />
)

export const Default = Template.bind({})
Default.args = SimpleDropdownStoryProps

export default meta
