import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ContentBackupImages } from '../../../../assets/data/images'
import { href } from '../../../../elements/link'
import { TagListStory } from '../../../../elements/tags'
import { ResourceCard, ResourceCardProps } from './ResourceCard'

const meta: ComponentMeta<typeof ResourceCard> = {
  title: 'Molecules/ResourceCard',
  component: ResourceCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'ResourceCardStoryProps',
    'ResourceCardLoggedOutStoryProps',
    'ResourceCardLoggedInStoryProps',
    'ResourceCardOwnerStoryProps',
    'ResourceCardOwnerBookmarkedStoryProps',
    'ResourceCardOwnerPrivateStoryProps',
  ],
  decorators: [
    (Story) => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const ResourceCardStoryProps = (i?: 0 | 1): ResourceCardProps => {
  return {
    resourceId: `${Math.floor(Math.random() * ContentBackupImages.length)}`,
    tags: TagListStory,
    isOwner: false,
    title: `Why the Tropical rainforest ${
      Math.random() < 0.5 ? 'stands as' : 'is'
    } the world's most important ecosystem`,
    image: i === 0 ? 'https://picsum.photos/400/400' : null,
    type: 'Video',
    resourceHomeHref: href('Pages/Resource/Logged In'),
    isAuthenticated: true,
    bookmarked: false,
    liked: false,
    numLikes: 23,
    visibility: 'Public',
    owner: {
      profileHref: href('Pages/Profile/Logged In'),
      avatar:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
      displayName: 'Karl Phosler',
    },
  }
}

export const ResourceCardLoggedInStoryProps: ResourceCardProps = {
  ...ResourceCardStoryProps(),
}

export const ResourceCardLoggedOutStoryProps = (
  i?: 0 | 1
): ResourceCardProps => {
  return {
    ...ResourceCardStoryProps(i),
    isAuthenticated: false,
  }
}

export const ResourceCardOwnerStoryProps: ResourceCardProps = {
  ...ResourceCardLoggedInStoryProps,
  isOwner: true,
}

export const ResourceCardOwnerPrivateStoryProps: ResourceCardProps = {
  ...ResourceCardLoggedInStoryProps,
  isOwner: true,
  visibility: 'Private',
}

export const ResourceCardOwnerBookmarkedStoryProps: ResourceCardProps = {
  ...ResourceCardOwnerStoryProps,
  bookmarked: true,
}

const ResourceCardStory: ComponentStory<typeof ResourceCard> = (args) => (
  <ResourceCard {...args} />
)

export const LoggedIn = ResourceCardStory.bind({})
LoggedIn.args = ResourceCardLoggedInStoryProps

export const LoggedOut = ResourceCardStory.bind({})
LoggedOut.args = ResourceCardLoggedOutStoryProps()

export const Owner = ResourceCardStory.bind({})
Owner.args = ResourceCardOwnerStoryProps

export const Public = ResourceCardStory.bind({})
Public.args = ResourceCardOwnerStoryProps

export const Private = ResourceCardStory.bind({})
Private.args = ResourceCardOwnerPrivateStoryProps

export const VerticalLoggedIn = ResourceCardStory.bind({})
VerticalLoggedIn.args = {
  ...ResourceCardLoggedInStoryProps,
  orientation: 'vertical',
  liked: true,
}

export const VerticalLoggedOut = ResourceCardStory.bind({})
VerticalLoggedOut.args = {
  ...ResourceCardLoggedOutStoryProps,
  orientation: 'vertical',
}

export const VerticalOwner = ResourceCardStory.bind({})
VerticalOwner.args = { ...ResourceCardOwnerStoryProps, orientation: 'vertical' }

export const VerticalPublic = ResourceCardStory.bind({})
VerticalPublic.args = {
  ...ResourceCardOwnerStoryProps,
  orientation: 'vertical',
}

export const VerticalPrivate = ResourceCardStory.bind({})
VerticalPrivate.args = {
  ...ResourceCardOwnerPrivateStoryProps,
  orientation: 'vertical',
}

export default meta
