import { href } from '@moodlenet/react-app/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  CollectionContributorCard,
  CollectionContributorCardProps,
} from './CollectionContributorCard.js'

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
  creatorProfileHref: href('Pages/Profile/LoggedIn'),
}

const CollectionContributorCardStory: ComponentStory<typeof CollectionContributorCard> = args => (
  <CollectionContributorCard {...args} />
)

export const Default = CollectionContributorCardStory.bind({})
Default.args = CollectionContributorCardStoryProps

export default meta
