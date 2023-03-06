import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SmallProfileCard, SmallProfileCardProps } from './SmallProfileCard.js'
import { getSmallProfileCardFactory } from './story-props.js'

const meta: ComponentMeta<typeof SmallProfileCard> = {
  title: 'Molecules/SmallProfileCard',
  component: SmallProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'getSmallProfilesCardStoryProps',
    'SmallProfileCardLoggedOutStoryProps',
    'SmallProfileCardLoggedInStoryProps',
    'SmallProfileCardFollowingStoryProps',
    'SmallProfileCardOwnerStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export const SmallProfileCardLoggedOutStoryProps: SmallProfileCardProps = {
  ...getSmallProfileCardFactory(),
}

export const SmallProfileCardLoggedInStoryProps: SmallProfileCardProps = {
  ...getSmallProfileCardFactory(undefined, {
    mainColumnItems: [],
    data: {},
    actions: {},
    access: {
      isAuthenticated: true,
    },
  }),
}

export const SmallProfileCardFollowingStoryProps: SmallProfileCardProps = {
  ...getSmallProfileCardFactory(undefined, {
    mainColumnItems: [],
    data: {},
    actions: {
      followed: true,
    },
    access: {},
  }),
}

export const SmallProfileCardOwnerStoryProps: SmallProfileCardProps = {
  ...getSmallProfileCardFactory(undefined, {
    ...SmallProfileCardLoggedInStoryProps,
    mainColumnItems: [],
    data: {},
    actions: {},
    access: {
      isOwner: true,
    },
  }),
}

const SmallProfileCardStory: ComponentStory<typeof SmallProfileCard> = args => (
  <SmallProfileCard {...args} />
)

export const LoggedOut = SmallProfileCardStory.bind({})
LoggedOut.args = SmallProfileCardLoggedOutStoryProps

export const LoggedIn = SmallProfileCardStory.bind({})
LoggedIn.args = SmallProfileCardLoggedInStoryProps

export const Following = SmallProfileCardStory.bind({})
Following.args = SmallProfileCardFollowingStoryProps

export const Owner = SmallProfileCardStory.bind({})
Owner.args = SmallProfileCardOwnerStoryProps

export default meta
