"use client"
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { SecondaryButton } from './SecondaryButton.js'

const meta: ComponentMeta<typeof SecondaryButton> = {
  title: 'Atoms/SecondaryButton',
  component: SecondaryButton,
  parameters: {
    layout: 'centered',
  },
}

const SecondaryButtonStory: ComponentStory<typeof SecondaryButton> = () => (
  <SecondaryButton>Secondary Button</SecondaryButton>
)

export const Default: typeof SecondaryButtonStory = SecondaryButtonStory.bind({})

export default meta
