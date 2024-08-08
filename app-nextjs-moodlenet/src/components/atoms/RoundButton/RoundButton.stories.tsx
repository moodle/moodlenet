"use client"
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { RoundButton } from './RoundButton.js'

const meta: ComponentMeta<typeof RoundButton> = {
  title: 'Atoms/RoundButton',
  component: RoundButton,
  parameters: {
    layout: 'centered',
  },
}

const RoundButtonStory: ComponentStory<typeof RoundButton> = () => <RoundButton />

export const Default: typeof RoundButtonStory = RoundButtonStory.bind({})

export default meta
