'use client'
import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { Snackbar } from './Snackbar.jsx'

const meta: ComponentMeta<typeof Snackbar> = {
  title: 'Atoms/Snackbar',
  component: Snackbar,
}

const SnackbarStory: ComponentStory<typeof Snackbar> = args => <Snackbar {...args} />

export const Default: typeof SnackbarStory = SnackbarStory.bind({})
Default.args = {
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Success: typeof SnackbarStory = SnackbarStory.bind({})
Success.args = {
  type: 'success',
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Warning: typeof SnackbarStory = SnackbarStory.bind({})
Warning.args = {
  type: 'warning',
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Error: typeof SnackbarStory = SnackbarStory.bind({})
Error.args = {
  type: 'error',
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Info: typeof SnackbarStory = SnackbarStory.bind({})
Info.args = {
  type: 'info',
  autoHideDuration: 9999999999,
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export default meta
