import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputTextField, InputTextFieldProps } from './InputTextField'

const meta: ComponentMeta<typeof InputTextField> = {
  title: 'Atoms/InputTextField',
  component: InputTextField,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['InputTextFieldStoryProps']
}

export const InputTextFieldStoryProps: InputTextFieldProps = {
  label: 'Just a text field',
  placeholder: 'Start typing to fill it'
}

const InputTextFieldStory: ComponentStory<typeof InputTextField> = args => <InputTextField {...args}></InputTextField>

export const Default = InputTextFieldStory.bind({})
Default.args = InputTextFieldStoryProps

export default meta
