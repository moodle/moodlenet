import { action } from '@storybook/addon-actions'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { Snackbar } from './Snackbar.js'

const meta: ComponentMeta<typeof Snackbar> = {
  title: 'Atoms/Snackbar',
  component: Snackbar,
}

const SnackbarStory: ComponentStory<typeof Snackbar> = args => <Snackbar {...args} />

export const Default = SnackbarStory.bind({})
Default.args = {
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Success = SnackbarStory.bind({})
Success.args = {
  type: 'success',
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Warning = SnackbarStory.bind({})
Warning.args = {
  type: 'warning',
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Error = SnackbarStory.bind({})
Error.args = {
  type: 'error',
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Info = SnackbarStory.bind({})
Info.args = {
  type: 'info',
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export default meta
