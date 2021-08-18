import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { CollectionCard, CollectionCardProps } from './CollectionCard'

const meta: ComponentMeta<typeof CollectionCard> = {
  title: 'Components/Cards/CollectionCard',
  component: CollectionCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'CollectionCardStoryProps',
    'CollectionCardLoggedInStoryProps',
    'CollectionCardLoggedOutStoryProps',
    'CollectionCardFollowingStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const CollectionCardStoryProps: CollectionCardProps = {
  title: 'Best Collection Ever',
  imageUrl: 'https://picsum.photos/200/100',
  collectionHref: href('collection/home'),
  bookmarked: false,
  following: false,
  numFollowers: 32,
  isAuthenticated: true,
  toggleFollow: linkTo('Components/Cards/CollectionCard', 'Following'),
}

export const CollectionCardLoggedInStoryProps: CollectionCardProps = {
  ...CollectionCardStoryProps
}

export const CollectionCardFollowingStoryProps: CollectionCardProps = {
  ...CollectionCardLoggedInStoryProps,
  following: true
}

export const CollectionCardLoggedOutStoryProps: CollectionCardProps = {
  ...CollectionCardStoryProps,
  isAuthenticated: false,
}

const CollectionCardStory: ComponentStory<typeof CollectionCard> = args => <CollectionCard {...args} />

export const LoggedIn = CollectionCardStory.bind({})
LoggedIn.args = CollectionCardLoggedInStoryProps

export const Following = CollectionCardStory.bind({})
Following.args = CollectionCardFollowingStoryProps

export const LoggedOut = CollectionCardStory.bind({})
LoggedOut.args = CollectionCardLoggedOutStoryProps

export default meta
