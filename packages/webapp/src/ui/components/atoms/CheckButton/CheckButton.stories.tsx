import { ComponentMeta, ComponentStory } from '@storybook/react'
import CheckButton from './CheckButton'

const meta: ComponentMeta<typeof CheckButton> = {
  title: 'Components/Atoms/CheckButton',
  component: CheckButton
}

const CheckButtonStory: ComponentStory<typeof CheckButton> = () => <CheckButton label="Relevance"></CheckButton>

export const Default = CheckButtonStory.bind({})

export default meta
