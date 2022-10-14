import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Modal } from './Modal.js'

const meta: ComponentMeta<typeof Modal> = {
  title: 'Atoms/Modal',
  component: Modal,
}

const ModalStory: ComponentStory<typeof Modal> = (args) => <Modal {...args} />

export const ModalDefault = ModalStory.bind({})
ModalDefault.args = {
  onClose: action('close modal'),
  children: <h1>Modal Content</h1>,
}

export default meta
