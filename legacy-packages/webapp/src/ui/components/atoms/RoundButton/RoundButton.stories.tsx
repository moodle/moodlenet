import { ComponentMeta, ComponentStory } from '@storybook/react'
import { RoundButton } from './RoundButton'

const meta: ComponentMeta<typeof RoundButton> = {
  title: 'Atoms/RoundButton',
  component: RoundButton,
}

const RoundButtonStory: ComponentStory<typeof RoundButton> = () => (
  <RoundButton />
)

export const Default = RoundButtonStory.bind({})

export default meta
