import { ComponentMeta, ComponentStory } from '@storybook/react'
import { DeleteButton } from './DeleteButton'

const meta: ComponentMeta<typeof DeleteButton> = {
  title: 'Components/Atoms/DeleteButton',
  component: DeleteButton
}

const DeleteButtonStory: ComponentStory<typeof DeleteButton> = () => <DeleteButton/>

export const Default = DeleteButtonStory.bind({})

export default meta
