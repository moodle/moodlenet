import { ComponentMeta, ComponentStory } from '@storybook/react'
import { RoundButton } from './RoundButton.js'

const meta: ComponentMeta<typeof RoundButton> = {
  title: 'Atoms/RoundButton',
  component: RoundButton,
}

const RoundButtonStory: ComponentStory<typeof RoundButton> = () => (
  <RoundButton />
)

export const RoundButtonDefault = RoundButtonStory.bind({})

export default meta