import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { href } from '../../../elements/link'
import { OverallCardNoCardStoryProps } from '../OverallCard/OverallCard.stories'
import { SmallProfileCard, SmallProfileCardProps } from './SmallProfileCard'

const meta: ComponentMeta<typeof SmallProfileCard> = {
  title: 'Components/Organisms/Cards/SmallProfileCard',
  component: SmallProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'SmallProfileCardStoryProps',
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

export const SmallProfileCardStoryProps: SmallProfileCardProps = {
  backgroundUrl: 'https://picsum.photos/200/100',
  avatarUrl: 'https://uifaces.co/our-content/donated/1H_7AxP0.jpg',
  profileHref: href('Pages/Profile/Logged In'),
  isOwner: false,
  isAuthenticated: false,
  isFollowing: false,
  toggleFollow: action('toogleFollow'),
  displayName: 'Juanito Rodriguez',
  organizationName: 'University of Malta',
  username: 'juanito',
  overallCardProps: OverallCardNoCardStoryProps
}

export const SmallProfileCardLoggedOutStoryProps: SmallProfileCardProps = {
  ...SmallProfileCardStoryProps,
}

export const SmallProfileCardLoggedInStoryProps: SmallProfileCardProps = {
  ...SmallProfileCardStoryProps,
  isAuthenticated: true,
}

export const SmallProfileCardFollowingStoryProps: SmallProfileCardProps = {
  ...SmallProfileCardLoggedInStoryProps,
  isFollowing: true,
}
export const SmallProfileCardOwnerStoryProps: SmallProfileCardProps = {
  ...SmallProfileCardLoggedInStoryProps,
  isOwner: true,
}

const SmallProfileCardStory: ComponentStory<typeof SmallProfileCard> = args => <SmallProfileCard {...args} />

export const LoggedOut = SmallProfileCardStory.bind({})
LoggedOut.args = SmallProfileCardLoggedOutStoryProps

export const LoggedIn = SmallProfileCardStory.bind({})
LoggedIn.args = SmallProfileCardLoggedInStoryProps

export const Following = SmallProfileCardStory.bind({})
Following.args = SmallProfileCardFollowingStoryProps

export const Owner = SmallProfileCardStory.bind({})
Owner.args = SmallProfileCardOwnerStoryProps

export default meta
