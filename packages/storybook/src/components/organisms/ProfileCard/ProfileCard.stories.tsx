import { getProfileCardFactory, ProfileCard, ProfileCardProps } from '@moodlenet/web-user/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
// import { ProfileCardProps } from './ProfileCard.js'

const meta: ComponentMeta<typeof ProfileCard> = {
  title: 'Molecules/ProfileCard',
  component: ProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'getProfileCardsStoryProps',
    'ProfileCardLoggedOutStoryProps',
    'ProfileCardLoggedInStoryProps',
    'ProfileCardFollowingStoryProps',
    'ProfileCardOwnerStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export const ProfileCardLoggedOutStoryProps: ProfileCardProps = {
  ...getProfileCardFactory(),
}

export const ProfileCardLoggedInStoryProps: ProfileCardProps = {
  ...getProfileCardFactory(undefined, {
    mainColumnItems: [],
    data: {},
    actions: {},
    access: {
      isAuthenticated: true,
    },
  }),
}

export const ProfileCardFollowingStoryProps: ProfileCardProps = {
  ...getProfileCardFactory(undefined, {
    mainColumnItems: [],
    data: {},
    actions: {
      followed: true,
    },
    access: {},
  }),
}

export const ProfileCardOwnerStoryProps: ProfileCardProps = {
  ...getProfileCardFactory(undefined, {
    ...ProfileCardLoggedInStoryProps,
    mainColumnItems: [],
    data: {},
    actions: {},
    access: {
      isCreator: true,
    },
  }),
}

const ProfileCardStory: ComponentStory<typeof ProfileCard> = args => <ProfileCard {...args} />

export const LoggedOut = ProfileCardStory.bind({})
LoggedOut.args = ProfileCardLoggedOutStoryProps

export const LoggedIn = ProfileCardStory.bind({})
LoggedIn.args = ProfileCardLoggedInStoryProps

export const Following = ProfileCardStory.bind({})
Following.args = ProfileCardFollowingStoryProps

export const Owner = ProfileCardStory.bind({})
Owner.args = ProfileCardOwnerStoryProps

export default meta
