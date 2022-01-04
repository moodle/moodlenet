import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputTextField, InputTextFieldProps } from './InputTextField'

const meta: ComponentMeta<typeof InputTextField> = {
  title: 'Atoms/InputTextField',
  component: InputTextField,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['InputTextFieldStoryProps', 'InputTextFieldErrorStoryProps'],
}

export const InputTextFieldStoryProps: InputTextFieldProps = {
  label: 'Just a text field',
  placeholder: 'Start typing to fill it',
}

export const InputTextFieldErrorStoryProps: InputTextFieldProps = {
  label: 'Just a text field',
  placeholder: 'Start typing to fill it',
  error: 'Just a cute error',
}

const InputTextFieldStory: ComponentStory<typeof InputTextField> = (args) => (
  <InputTextField {...args}></InputTextField>
)

export const Default = InputTextFieldStory.bind({})
Default.args = InputTextFieldStoryProps

export const Error = InputTextFieldStory.bind({})
Error.args = InputTextFieldErrorStoryProps

export default meta
