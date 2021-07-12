import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CheckInput } from './CheckInput'

const meta: ComponentMeta<typeof CheckInput> = {
  title: 'Components/Atoms/CheckInput',
  component: CheckInput
}

const CheckInputStory: ComponentStory<typeof CheckInput> = () => <CheckInput label="Resources"></CheckInput>

export const Default = CheckInputStory.bind({})

export default meta
