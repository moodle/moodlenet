import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PrimaryButton } from './PrimaryButton'

const meta: ComponentMeta<typeof PrimaryButton> = {
  title: 'Atoms/PrimaryButton',
  component: PrimaryButton,
}

const PrimaryButtonStory: ComponentStory<typeof PrimaryButton> = () => (
  <PrimaryButton>Primary Button</PrimaryButton>
)

export const Default = PrimaryButtonStory.bind({})

export default meta
