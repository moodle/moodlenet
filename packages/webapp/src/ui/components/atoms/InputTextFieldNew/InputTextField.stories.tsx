import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputTextField, InputTextFieldProps } from './InputTextField'

const meta: ComponentMeta<typeof InputTextField> = {
  title: 'Atoms/InputTextField',
  component: InputTextField,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['InputTextFieldStoryProps', 'TextAreaFieldStoryProps'],
}

export const InputTextFieldStoryProps: InputTextFieldProps = {
  label: 'Just a text field',
  edit: true,
  highlight: true,
  fieldProps: {
    placeholder: 'Start typing to fill it',
    onChange: action('input change'),
  },
}

const InputTextFieldStory: ComponentStory<typeof InputTextField> = (args) => (
  <InputTextField {...args}></InputTextField>
)

export const InputField = InputTextFieldStory.bind({})
InputField.args = InputTextFieldStoryProps

export const TextAreaFieldStoryProps: InputTextFieldProps = {
  label: 'Just a text area',
  edit: true,
  highlight: true,
  textarea: true,
  textAreaAutoSize: true,
  fieldProps: {
    placeholder: 'Start typing to fill it',
    onChange: action('text area change'),
  },
}

export const TextAreaField = InputTextFieldStory.bind({})
TextAreaField.args = TextAreaFieldStoryProps

export default meta
