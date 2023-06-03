import type { ComponentMeta, ComponentStory } from '@storybook/react'
import type { SimpleDropdownProps } from './SimpleDropdown.js'
import { SimpleDropdown } from './SimpleDropdown.js'

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
  list: [
    { name: 'Item 1', key: 'Item 1' },
    { name: 'Item 2', key: 'Item 2' },
    { name: 'Item 3', key: 'Item 3' },
  ],
  selected: ['Item 1'],
  onClick: () => undefined,
}

export const Template: ComponentStory<typeof SimpleDropdown> = () => (
  <SimpleDropdown {...SimpleDropdownStoryProps} />
)

export const Default = Template.bind({})
Default.args = SimpleDropdownStoryProps

export default meta
