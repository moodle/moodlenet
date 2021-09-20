import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { people } from '../../../../helpers/factories'
import { randomIntFromInterval } from '../../../../helpers/utilities'
import { SBFormikBag } from '../../../lib/storybook/SBFormikBag'
import { ProfileFormValues } from '../../../pages/Profile/types'
import { ProfileCard, ProfileCardProps } from './ProfileCard'

const meta: ComponentMeta<typeof ProfileCard> = {
  title: 'Components/Organisms/Cards/ProfileCard',
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

const randomProfileIndex = randomIntFromInterval(0, 3)

export const ProfileCardStoryProps: ProfileCardProps = {
  backgroundUrl: people[randomProfileIndex]?.backgroundUrl!,
  avatarUrl: people[randomProfileIndex]?.avatarUrl!,
  isOwner: false,
  isAuthenticated: false,
  toggleFollow: action('toogleFollow'),
  toggleIsEditing: action('toogleIsEditing'),
  openSendMessage: action('openSendMessage'),
  formBag: SBFormikBag<ProfileFormValues>({
    displayName: people[randomProfileIndex]?.displayName!,
    description:
      'Italian biologist specialized in endangered rainforest monitoring. Cooperating with local organizations to improve nature reserves politics.',
    organizationName: people[randomProfileIndex]?.organization!,
    location: people[randomProfileIndex]?.location!,
    siteUrl: 'https://iuri.is/',
    avatarImage: null,
    backgroundImage: null,
    username: people[randomProfileIndex]?.username!,
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
