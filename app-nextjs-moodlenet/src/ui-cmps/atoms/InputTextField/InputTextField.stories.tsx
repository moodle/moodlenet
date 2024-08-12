"use client"
import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { useState } from 'react'
import type { InputTextFieldProps } from './InputTextField.jsx'
import { InputTextField } from './InputTextField.jsx'

const meta: ComponentMeta<typeof InputTextField> = {
  title: 'Atoms/InputTextField',
  component: InputTextField,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'TransStory',
    'InputTextFieldStoryProps',
    'InputTextFieldErrorStoryProps',
    'TextAreaFieldStoryProps',
  ],
  parameters: {
    layout: 'centered',
  },
}

export const TransStory = () => {
  const [error, setError] = useState('')

  return (
    <div onClick={() => (error ? setError('') : setError('errore'))}>
      <InputTextField error={error}></InputTextField>
    </div>
  )
}
export const InputTextFieldStoryProps: InputTextFieldProps = {
  label: 'Just a text field',
  edit: true,
  placeholder: 'Start typing to fill it',
  onChange: action('text area change'),
  // onChange: action('input change'),
}

export const InputTextFieldErrorStoryProps: InputTextFieldProps = {
  ...InputTextFieldStoryProps,
  error: 'Just a cute error',
}

export const InputButton: ComponentStory<typeof InputTextField> = () => (
  <InputTextField {...InputTextFieldStoryProps} />
)

const InputTextFieldStory: ComponentStory<typeof InputTextField> = args => (
  <InputTextField {...args}></InputTextField>
)

export const Input: typeof InputTextFieldStory = InputTextFieldStory.bind({})
Input.args = InputTextFieldStoryProps

export const Error: typeof InputTextFieldStory = InputTextFieldStory.bind({})
Error.args = InputTextFieldErrorStoryProps

export const TextAreaFieldStoryProps: InputTextFieldProps = {
  label: 'Just a text area',
  edit: true,
  highlight: true,
  isTextarea: true,
  value:
    'This is the description that tells you that this is not only the best content ever, but also the most dynamic and enjoyable you will never ever find. Trust us.',
  textAreaAutoSize: true,
  placeholder: 'Start typing to fill it',
  onChange: action('text area change'),
}

export const TextArea: typeof InputTextFieldStory = InputTextFieldStory.bind({})
TextArea.args = TextAreaFieldStoryProps

export default meta
