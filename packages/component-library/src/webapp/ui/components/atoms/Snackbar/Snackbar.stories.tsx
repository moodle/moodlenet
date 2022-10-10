import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Snackbar } from './Snackbar.js'

const meta: ComponentMeta<typeof Snackbar> = {
  title: 'Atoms/Snackbar',
  component: Snackbar,
}

const SnackbarStory: ComponentStory<typeof Snackbar> = (args) => (
  <Snackbar {...args} />
)

export const SnackbarDefault = SnackbarStory.bind({})
SnackbarDefault.args = {
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Success = SnackbarStory.bind({})
Success.args = {
  type: 'success',
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Warning = SnackbarStory.bind({})
Warning.args = {
  type: 'warning',
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const SnackbarError = SnackbarStory.bind({})
SnackbarError.args = {
  type: 'error',
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export const Info = SnackbarStory.bind({})
Info.args = {
  type: 'info',
  onClose: action('close Snackbar'),
  children: <div>Snackbar Content</div>,
}

export default meta
