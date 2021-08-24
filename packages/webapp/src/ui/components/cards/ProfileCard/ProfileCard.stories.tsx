import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { ProfileFormValues } from '../../../pages/Profile/types'
import { ProfileCard, ProfileCardProps } from './ProfileCard'

const meta: ComponentMeta<typeof ProfileCard> = {
  title: 'Components/Cards/ProfileCard',
  component: ProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'ProfileCardStoryProps',
    'ProfileCardLoggedOutStoryProps',
    'ProfileCardLoggedInStoryProps',
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

export const ProfileCardStoryProps: ProfileCardProps = {
  backgroundUrl: 'https://picsum.photos/200/100',
  avatarUrl: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
  isOwner: false,
  isAuthenticated: false,
  toggleFollow: action('toogleFollow'),
  toggleIsEditing: action('toogleIsEditing'),
  openSendMessage: action('openSendMessage'),
  formBag: SBFormikBag<ProfileFormValues>({
    displayName: 'Juanito Rodriguez',
    description:
      'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
    organizationName: 'UM',
    location: 'Malta',
    siteUrl: 'https://iuri.is/',
    username: 'juanito',
  }),
}

export const ProfileCardLoggedOutStoryProps: ProfileCardProps = {
  ...ProfileCardStoryProps,
}

export const ProfileCardLoggedInStoryProps: ProfileCardProps = {
  ...ProfileCardStoryProps,
  isAuthenticated: true,
}

export const ProfileCardOwnerStoryProps: ProfileCardProps = {
  ...ProfileCardLoggedInStoryProps,
  isOwner: true,
}

const ProfileCardStory: ComponentStory<typeof ProfileCard> = args => <ProfileCard {...args} />

export const LoggedOut = ProfileCardStory.bind({})
LoggedOut.args = ProfileCardLoggedOutStoryProps

export const LoggedIn = ProfileCardStory.bind({})
LoggedIn.args = ProfileCardLoggedInStoryProps

export const Owner = ProfileCardStory.bind({})
Owner.args = ProfileCardOwnerStoryProps

export default meta
