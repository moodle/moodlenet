import { ComponentMeta } from '@storybook/react'
import { ProfileCard } from './ProfileCard'
import { useProfileCardStoryProps } from './props.stories'

const meta: ComponentMeta<typeof ProfileCard> = {
  title: 'Molecules/ProfileCard',
  component: ProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['useProfileCardStoryProps'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export const LoggedOut = () => {
  const props = useProfileCardStoryProps()
  return <ProfileCard {...props} />
}

export const LoggedIn = () => {
  const props = useProfileCardStoryProps({
    props: {
      isAuthenticated: true,
      isFollowing: true,
    },
  })
  return <ProfileCard {...props} />
}

export const Owner = () => {
  const props = useProfileCardStoryProps({
    props: {
      showAccountApprovedSuccessAlert: true,
      isApproved: true,
    },
  })
  return <ProfileCard {...props} />
}
export const Approved = () => {
  const props = useProfileCardStoryProps({
    props: {
      isOwner: true,
      isElegibleForApproval: true,
      showAccountApprovedSuccessAlert: true,
      isApproved: true,
    },
  })
  return <ProfileCard {...props} />
}

export const Admin = () => {
  const props = useProfileCardStoryProps({
    props: {
      isAuthenticated: true,
      isAdmin: true,
    },
  })
  return <ProfileCard {...props} />
}

export default meta
