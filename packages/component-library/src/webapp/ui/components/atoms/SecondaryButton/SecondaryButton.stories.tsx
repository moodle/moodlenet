import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SecondaryButton } from './SecondaryButton.js'

const meta: ComponentMeta<typeof SecondaryButton> = {
  title: 'Atoms/SecondaryButton',
  component: SecondaryButton,
}

const SecondaryButtonStory: ComponentStory<typeof SecondaryButton> = () => (
  <SecondaryButton>Secondary Button</SecondaryButton>
)

export const SecondaryButtonDefault = SecondaryButtonStory.bind({})

export default meta
