import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import PrimaryButton from '../PrimaryButton/PrimaryButton'
import { InputTextField, InputTextFieldProps } from './InputTextField'

const meta: ComponentMeta<typeof InputTextField> = {
  title: 'Atoms/InputTextFieldNew',
  component: InputTextField,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
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
    action={
      <PrimaryButton onClick={action('Primary button click')}>
        Add
      </PrimaryButton>
    }
  />
)

const InputTextFieldStory: ComponentStory<typeof InputTextField> = (args) => (
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
  textarea: true,
  textAreaAutoSize: true,
  placeholder: 'Start typing to fill it',
  onChange: action('text area change'),
}

export const TextArea = InputTextFieldStory.bind({})
TextArea.args = TextAreaFieldStoryProps

export default meta
