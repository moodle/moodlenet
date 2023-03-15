import { ProfileCard } from '@moodlenet/react-app/ui'
import { ComponentMeta } from '@storybook/react'
import { useProfileCardStoryProps } from './stories-props.js'

const meta: ComponentMeta<typeof ProfileCard> = {
  title: 'Molecules/ProfileCard',
  component: ProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['useProfileCardStoryProps'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export const LoggedOut = () => {
  const props = useProfileCardStoryProps()
  // contentItems: [<PrimaryButton key="jal">Done</PrimaryButton>],
  // contentItems: [],
  return <ProfileCard {...props} />
}

export const LoggedIn = () => {
  const props = useProfileCardStoryProps()
  // isAuthenticated: true,
  // isFollowing: true,
  return <ProfileCard {...props} />
}

export const Owner = () => {
  const props = useProfileCardStoryProps({
    access: {
      isCreator: true,
      canEdit: true,
    },

    // showAccountApprovedSuccessAlert: true,
    // isApproved: true,
  })
  return <ProfileCard {...props} />
}

export const Editing = () => {
  const props = useProfileCardStoryProps({
    isEditing: true,
    access: {
      isCreator: true,
      canEdit: true,
      // showAccountApprovedSuccessAlert: true,
      // isApproved: true,
    },
  })
  return <ProfileCard {...props} />
}
// export const Approved = () => {
//   const props = useProfileCardStoryProps({
//     props: {
//       isCreator: true,
//       isElegibleForApproval: true,
//       showAccountApprovedSuccessAlert: true,
//       isApproved: true,
//     },
//   })
//   return <ProfileCard {...props} />
// }

// export const Admin = () => {
//   const props = useProfileCardStoryProps({
//     props: {
//       isAuthenticated: true,
//       isAdmin: true,
//     },
//   })
//   return <ProfileCard {...props} />
// }

export default meta
