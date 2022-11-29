import { ComponentMeta, ComponentStory } from '@storybook/react'
import Checkbox, { CheckboxProps } from './Checkbox'

const meta: ComponentMeta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  excludeStories: ['CheckboxUnselected', 'CheckboxSelected'],
}

const CheckboxStory: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
)

export const CheckboxUnselected: CheckboxProps = {
  label: 'Resources',
  name: 'Resources',
}

export const CheckboxSelected: CheckboxProps = {
  ...CheckboxUnselected,
  checked: true,
}

export const Unselected = CheckboxStory.bind({})
Unselected.args = CheckboxUnselected

export const Selected = CheckboxStory.bind({})
Selected.args = CheckboxSelected

export default meta
