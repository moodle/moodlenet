import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../../elements/link'
import { TagListStory } from '../../../../elements/tags'
import ResourceCardLegacy, {
  ResourceCardLegacyProps,
} from './ResourceCardLegacy'

const meta: ComponentMeta<typeof ResourceCardLegacy> = {
  title: 'Molecules/ResourceCardLegacy',
  component: ResourceCardLegacy,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'ResourceCardLegacyStoryProps',
    'ResourceCardLegacyLoggedOutStoryProps',
    'ResourceCardLegacyLoggedInStoryProps',
    'ResourceCardLegacyOwnerStoryProps',
    'ResourceCardLegacyOwnerBookmarkedStoryProps',
    'ResourceCardLegacyOwnerPrivateStoryProps',
  ],
  decorators: [
    (Story) => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const ResourceCardLegacyStoryProps: ResourceCardLegacyProps = {
  tags: TagListStory,
  isOwner: false,
  title: 'Best resource ever forever',
  image: 'https://picsum.photos/200/100',
  type: 'Video',
  resourceHomeHref: href('Pages/Resource/Logged In'),
  isAuthenticated: true,
  bookmarked: false,
  liked: false,
  numLikes: 23,
  visibility: 'Public',
}

export const ResourceCardLegacyLoggedInStoryProps: ResourceCardLegacyProps = {
  ...ResourceCardLegacyStoryProps,
}

export const ResourceCardLegacyLoggedOutStoryProps: ResourceCardLegacyProps = {
  ...ResourceCardLegacyStoryProps,
  isAuthenticated: false,
}

export const ResourceCardLegacyOwnerStoryProps: ResourceCardLegacyProps = {
  ...ResourceCardLegacyLoggedInStoryProps,
  isOwner: true,
}

export const ResourceCardLegacyOwnerPrivateStoryProps: ResourceCardLegacyProps =
  {
    ...ResourceCardLegacyLoggedInStoryProps,
    isOwner: true,
    visibility: 'Private',
  }

export const ResourceCardLegacyOwnerBookmarkedStoryProps: ResourceCardLegacyProps =
  {
    ...ResourceCardLegacyOwnerStoryProps,
    bookmarked: true,
  }

const ResourceCardLegacyStory: ComponentStory<typeof ResourceCardLegacy> = (
  args
) => <ResourceCardLegacy {...args} />

export const LoggedIn = ResourceCardLegacyStory.bind({})
LoggedIn.args = ResourceCardLegacyLoggedInStoryProps

export const LoggedOut = ResourceCardLegacyStory.bind({})
LoggedOut.args = ResourceCardLegacyLoggedOutStoryProps

export const Owner = ResourceCardLegacyStory.bind({})
Owner.args = ResourceCardLegacyOwnerStoryProps

export const Public = ResourceCardLegacyStory.bind({})
Public.args = ResourceCardLegacyOwnerStoryProps

export const Private = ResourceCardLegacyStory.bind({})
Private.args = ResourceCardLegacyOwnerPrivateStoryProps

export default meta
