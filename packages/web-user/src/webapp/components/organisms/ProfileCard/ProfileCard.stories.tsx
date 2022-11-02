import { ComponentMeta } from '@storybook/react'
import { ProfileCard } from './ProfileCard.js'
import { getProfileCardStoryProps } from './stories-props.js'

const meta: ComponentMeta<typeof ProfileCard> = {
  title: 'Molecules/ProfileCard',
  component: ProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['getProfileCardStoryProps'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export const LoggedOut = () => {
  const props = getProfileCardStoryProps()
  return <ProfileCard {...props} />
}

export const LoggedIn = () => {
  const props = getProfileCardStoryProps({
    props: {
      // isAuthenticated: true,
      // isFollowing: true,
    },
  })
  return <ProfileCard {...props} />
}

export const Owner = () => {
  const props = getProfileCardStoryProps({
    props: {
      isOwner: true,
      // showAccountApprovedSuccessAlert: true,
      // isApproved: true,
    },
  })
  return <ProfileCard {...props} />
}
// export const Approved = () => {
//   const props = getProfileCardStoryProps({
//     props: {
//       isOwner: true,
//       isElegibleForApproval: true,
//       showAccountApprovedSuccessAlert: true,
//       isApproved: true,
//     },
//   })
//   return <ProfileCard {...props} />
// }

// export const Admin = () => {
//   const props = getProfileCardStoryProps({
//     props: {
//       isAuthenticated: true,
//       isAdmin: true,
//     },
//   })
//   return <ProfileCard {...props} />
// }

export default meta
