import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { AddButton, AddButtonProps } from './AddButton'

const meta: ComponentMeta<typeof AddButton> = {
  title: 'Components/Atoms/AddButton',
  component: AddButton,
  excludeStories: ['AddButtonStoryProps'],
}

const AddButtonStory: ComponentStory<typeof AddButton> = args => <AddButton {...args} />

export const AddButtonStoryProps: AddButtonProps = {
  newResourceHref: href('Pages/New Resource/Default'),
  newCollectionHref: href('Pages/New Collection/Default'),
}

export const Default = AddButtonStory.bind({})
Default.args = AddButtonStoryProps

export default meta
