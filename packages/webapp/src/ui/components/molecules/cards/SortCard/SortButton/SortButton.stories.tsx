import { ComponentMeta, ComponentStory } from '@storybook/react'
import SortButton from './SortButton'

const meta: ComponentMeta<typeof SortButton> = {
  title: 'Atoms/SortButton',
  component: SortButton,
}

const onClick: (label: string) => void = () => {
  return
}

const CheckButtonStory: ComponentStory<typeof SortButton> = () => (
  <SortButton label="Relevance" clicked={onClick}></SortButton>
)

export const Default = CheckButtonStory.bind({})

export default meta
