import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { TertiaryButton } from './TertiaryButton.js'

const meta: ComponentMeta<typeof TertiaryButton> = {
  title: 'Atoms/TertiaryButton',
  component: TertiaryButton,
}

const TertiaryButtonStory: ComponentStory<typeof TertiaryButton> = () => (
  <TertiaryButton>Tertiary Button</TertiaryButton>
)

export const Default = TertiaryButtonStory.bind({})

export default meta
