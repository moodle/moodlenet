import { MainProfileCard } from '@moodlenet/web-user/ui'
import type { ComponentMeta } from '@storybook/react'
import { useMainProfileCardStoryProps } from './MainProfileCardProps.stories.jsx'

const meta: ComponentMeta<typeof MainProfileCard> = {
  title: 'Molecules/MainProfileCard',
  component: MainProfileCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['useMainProfileCardStoryProps'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export const LoggedOut = () => {
  const props = useMainProfileCardStoryProps({
    // contentItems: [<PrimaryButton key="jal">Done</PrimaryButton>],
    // contentItems: [],
  })
  return <MainProfileCard {...props} />
}

export const LoggedIn = () => {
  const props = useMainProfileCardStoryProps({
    // isAuthenticated: true,
    // isFollowing: true,
  })
  return <MainProfileCard {...props} />
}

export const Owner = () => {
  const props = useMainProfileCardStoryProps({
    access: {
      isCreator: true,
      canEdit: true,
      // showAccountApprovedSuccessAlert: true,
      // isApproved: true,
    },
  })
  return <MainProfileCard {...props} />
}

export const Editing = () => {
  const props = useMainProfileCardStoryProps({
    access: {
      isCreator: true,
      canEdit: true,
    },
    isEditing: true,
    // showAccountApprovedSuccessAlert: true,
    // isApproved: true,
  })
  return <MainProfileCard {...props} />
}
// export const Approved = () => {
//   const props = useMainProfileCardStoryProps({
//     props: {
//       isCreator: true,
//       isElegibleForApproval: true,
//       showAccountApprovedSuccessAlert: true,
//       isApproved: true,
//     },
//   })
//   return <MainProfileCard {...props} />
// }

// export const Admin = () => {
//   const props = useMainProfileCardStoryProps({
//     props: {
//       isAuthenticated: true,
//       isAdmin: true,
//     },
//   })
//   return <MainProfileCard {...props} />
// }

export default meta
