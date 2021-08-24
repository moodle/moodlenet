import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Modal } from './Modal'

const meta: ComponentMeta<typeof Modal> = {
  title: 'Components/Atoms/Modal',
  component: Modal
}

const ModalStory: ComponentStory<typeof Modal> = () => <Modal onClose={()=>{}}>Modal Content</Modal>

export const Default = ModalStory.bind({})

export default meta
