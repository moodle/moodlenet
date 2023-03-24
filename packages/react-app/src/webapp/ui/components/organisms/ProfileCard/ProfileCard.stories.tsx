import { ComponentMeta } from '@storybook/react'
import { ProfileCard } from './ProfileCard.js'
import { getProfileCardFactory } from './story-props.js'

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
  const props = getProfileCardFactory()
  return <ProfileCard {...props} />
}

export const LoggedIn = () => {
  const props = getProfileCardFactory(undefined, { access: { isAuthenticated: true } })
  return <ProfileCard {...props} />
}

export const Owner = () => {
  const props = getProfileCardFactory(undefined, { access: { canEdit: true, isCreator: true } })
  return <ProfileCard {...props} />
}

export const Editing = () => {
  const props = getProfileCardFactory(undefined, {
    access: {
      canEdit: true,
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
