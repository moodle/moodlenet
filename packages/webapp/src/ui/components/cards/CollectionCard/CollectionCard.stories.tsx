import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { CollectionCard, CollectionCardProps } from './CollectionCard'

const meta: ComponentMeta<typeof CollectionCard> = {
  title: 'Components/Cards/CollectionCard',
  component: CollectionCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['CollectionCardStoryProps'],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const CollectionCardStoryProps: CollectionCardProps = {
  title: 'Collection Title',
  imageUrl: 'https://picsum.photos/200/100',
  collectionHref: href('collection/home'),
}

const CollectionCardStory: ComponentStory<typeof CollectionCard> = args => <CollectionCard {...args} />

export const Default = CollectionCardStory.bind({})
Default.args = CollectionCardStoryProps

export default meta
