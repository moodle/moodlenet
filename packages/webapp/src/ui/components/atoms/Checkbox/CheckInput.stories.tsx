import { ComponentMeta, ComponentStory } from '@storybook/react'
import Checkbox from './CheckInput'

const meta: ComponentMeta<typeof Checkbox> = {
  title: 'Components/Atoms/Checkbox',
  component: Checkbox
}

const CheckboxStory: ComponentStory<typeof Checkbox> = () => <Checkbox label="Resources"></Checkbox>

export const Default = CheckboxStory.bind({})

export default meta
