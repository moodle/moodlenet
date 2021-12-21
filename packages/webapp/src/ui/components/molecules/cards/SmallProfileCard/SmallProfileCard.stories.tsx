import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { people } from '../../../../../helpers/factories'
import { randomIntFromInterval } from '../../../../../helpers/utilities'
import { href } from '../../../../elements/link'
import { OverallCardNoCardStoryProps } from '../OverallCard/OverallCard.stories'
import { SmallProfileCard, SmallProfileCardProps } from './SmallProfileCard'

const meta: ComponentMeta<typeof SmallProfileCard> = {
  title: 'Molecules/SmallProfileCard',
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
    (Story) => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export const SmallProfileCardStoryProps = (
  i: number
): SmallProfileCardProps => {
  return {
    backgroundUrl: people[i]?.backgroundUrl!,
    avatarUrl: people[i]?.avatarUrl!,
    profileHref: href('Pages/Profile/Logged In'),
    isOwner: false,
    isAuthenticated: false,
    isFollowing: false,
    toggleFollow: action('toogleFollow'),
    displayName: people[i]?.displayName!,
    organizationName: people[i]?.organization!,
    username: people[i]?.username!,
    overallCardProps: OverallCardNoCardStoryProps,
  }
}

export const SmallProfileCardLoggedOutStoryProps = (
  i: number
): SmallProfileCardProps => {
  return {
    ...SmallProfileCardStoryProps(i),
  }
}

export const SmallProfileCardLoggedInStoryProps = (
  i: number
): SmallProfileCardProps => {
  return {
    ...SmallProfileCardStoryProps(i),
    isAuthenticated: true,
  }
}

export const SmallProfileCardFollowingStoryProps = (
  i: number
): SmallProfileCardProps => {
  return {
    ...SmallProfileCardStoryProps(i),
    isFollowing: true,
  }
}

export const SmallProfileCardOwnerStoryProps = (
  i: number
): SmallProfileCardProps => {
  return {
    ...SmallProfileCardLoggedInStoryProps(i),
    isOwner: true,
  }
}

const SmallProfileCardStory: ComponentStory<typeof SmallProfileCard> = (
  args
) => <SmallProfileCard {...args} />

export const LoggedOut = SmallProfileCardStory.bind({})
LoggedOut.args = SmallProfileCardLoggedOutStoryProps(
  randomIntFromInterval(0, 3)
)

export const LoggedIn = SmallProfileCardStory.bind({})
LoggedIn.args = SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3))

export const Following = SmallProfileCardStory.bind({})
Following.args = SmallProfileCardFollowingStoryProps(
  randomIntFromInterval(0, 3)
)

export const Owner = SmallProfileCardStory.bind({})
Owner.args = SmallProfileCardOwnerStoryProps(randomIntFromInterval(0, 3))

export default meta
