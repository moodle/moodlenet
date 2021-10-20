import { ComponentMeta, ComponentStory } from '@storybook/react'
import Checkbox from './Checkbox'

const meta: ComponentMeta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
}

const CheckboxStory: ComponentStory<typeof Checkbox> = () => <Checkbox label="Resources" name="Resources"></Checkbox>

export const Default = CheckboxStory.bind({})

export default meta
