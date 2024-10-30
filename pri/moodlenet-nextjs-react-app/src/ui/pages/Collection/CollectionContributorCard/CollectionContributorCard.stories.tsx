import { href } from '@moodlenet/react-app/common'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import type { CollectionContributorCardProps } from './CollectionContributorCard'
import { CollectionContributorCard } from './CollectionContributorCard'

const meta: ComponentMeta<typeof CollectionContributorCard> = {
  title: 'Pages/Collection/CollectionContributorCard',
  component: CollectionContributorCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['CollectionContributorCardStoryProps', 'Default'],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const CollectionContributorCardStoryProps: CollectionContributorCardProps = {
  avatarUrl:
    'https://images.pexels.com/photos/3746326/pexels-photo-3746326.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200&w=200',
  displayName: 'Juanita Rodriguez',
  creatorProfileHref: href('Pages/Profile/Logged In'),
}

const CollectionContributorCardStory: ComponentStory<typeof CollectionContributorCard> = args => (
  <CollectionContributorCard {...args} />
)

export const Default: typeof CollectionContributorCardStory = CollectionContributorCardStory.bind(
  {},
)
Default.args = CollectionContributorCardStoryProps

export default meta
