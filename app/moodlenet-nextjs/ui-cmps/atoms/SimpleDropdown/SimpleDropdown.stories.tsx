'use client'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { SimpleDropdownProps } from './SimpleDropdown.jsx'
import { SimpleDropdown } from './SimpleDropdown.jsx'

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
  parameters: {
    layout: 'centered',
  },
}

export const SimpleDropdownStoryProps: SimpleDropdownProps = {
  label: 'Label',
  options: [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
  ],
  selected: ['Item 1'],
  onClick: () => undefined,
}

export const Template: ComponentStory<typeof SimpleDropdown> = () => (
  <SimpleDropdown {...SimpleDropdownStoryProps} />
)

export const Default: typeof Template = Template.bind({})
Default.args = SimpleDropdownStoryProps

export default meta
