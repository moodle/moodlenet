'use client'
import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { Modal } from './Modal.jsx'

const meta: ComponentMeta<typeof Modal> = {
  title: 'Atoms/Modal',
  component: Modal,
}

const ModalStory: ComponentStory<typeof Modal> = args => <Modal {...args} />

export const Default: typeof ModalStory = ModalStory.bind({})
Default.args = {
  onClose: action('close modal'),
  children: <h1>Modal Content</h1>,
}

export default meta
