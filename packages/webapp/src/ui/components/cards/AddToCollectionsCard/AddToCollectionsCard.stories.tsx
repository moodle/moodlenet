import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { AddToCollectionsCard, AddToCollectionsCardProps } from './AddToCollectionsCard'

const meta: ComponentMeta<typeof AddToCollectionsCard> = {
  title: 'Components/Organisms/Cards/AddToCollectionsCard',
  component: AddToCollectionsCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['AddToCollectionsCardStoryProps'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 1100 }}>
        <Story />
      </div>
    ),
  ],
}

export const AddToCollectionsCardStoryProps: AddToCollectionsCardProps = {
  setAddToCollections: action('setAddToCollectionsCard'),
  allCollections: [
    'Education',
    'Biology',
    'Algebra',
    'Phycology',
    'Phylosophy',
    'Sociology',
    'English Literature',
  ].map(label => ({ label, id: label })),
}

const AddToCollectionsCardStory: ComponentStory<typeof AddToCollectionsCard> = args => (
  <AddToCollectionsCard {...args} />
)

export const Default = AddToCollectionsCardStory.bind({})
Default.args = AddToCollectionsCardStoryProps

export default meta
