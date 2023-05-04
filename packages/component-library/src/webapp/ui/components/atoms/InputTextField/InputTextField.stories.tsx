import { action } from '@storybook/addon-actions'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import PrimaryButton from '../PrimaryButton/PrimaryButton.js'
import type { InputTextFieldProps } from './InputTextField.js'
import { InputTextField } from './InputTextField.js'

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
  <InputTextField
    {...InputTextFieldStoryProps}
    action={<PrimaryButton onClick={action('Primary button click')}>Add</PrimaryButton>}
  />
)

const InputTextFieldStory: ComponentStory<typeof InputTextField> = args => (
  <InputTextField {...args}></InputTextField>
)

export const Input = InputTextFieldStory.bind({})
Input.args = InputTextFieldStoryProps

export const Error = InputTextFieldStory.bind({})
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

export const TextArea = InputTextFieldStory.bind({})
TextArea.args = TextAreaFieldStoryProps

export default meta
