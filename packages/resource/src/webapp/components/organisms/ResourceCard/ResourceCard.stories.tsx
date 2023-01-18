import { ComponentMeta } from '@storybook/react'
import { ResourceCard } from './ResourceCard.js'
import { useResourceCardStoryProps } from './stories-props.js'

const meta: ComponentMeta<typeof ResourceCard> = {
  title: 'Molecules/ResourceCard',
  component: ResourceCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['useResourceCardStoryProps'],
  decorators: [
    Story => (
      <div style={{ maxWidth: 500 }}>
        <Story />
      </div>
    ),
  ],
}

export const LoggedOut = () => {
  const props = useResourceCardStoryProps({
    props: {
      // contentItems: [<PrimaryButton key="jal">Done</PrimaryButton>],
      // contentItems: [],
    },
  })
  return <ResourceCard {...props} />
}

export const LoggedIn = () => {
  const props = useResourceCardStoryProps({
    props: {
      // isAuthenticated: true,
      // isFollowing: true,
    },
  })
  return <ResourceCard {...props} />
}

export const Owner = () => {
  const props = useResourceCardStoryProps({
    props: {
      isOwner: true,
      canEdit: true,
      // showAccountApprovedSuccessAlert: true,
      // isApproved: true,
    },
  })
  return <ResourceCard {...props} />
}

export const Editing = () => {
  const props = useResourceCardStoryProps({
    props: {
      isOwner: true,
      canEdit: true,
      isEditing: true,
      // showAccountApprovedSuccessAlert: true,
      // isApproved: true,
    },
  })
  return <ResourceCard {...props} />
}
// export const Approved = () => {
//   const props = useResourceCardStoryProps({
//     props: {
//       isOwner: true,
//       isElegibleForApproval: true,
//       showAccountApprovedSuccessAlert: true,
//       isApproved: true,
//     },
//   })
//   return <ResourceCard {...props} />
// }

// export const Admin = () => {
//   const props = useResourceCardStoryProps({
//     props: {
//       isAuthenticated: true,
//       isAdmin: true,
//     },
//   })
//   return <ResourceCard {...props} />
// }

export default meta
