import { ResourceFormValues } from '@moodlenet/resource/common'
import { Resource } from '@moodlenet/resource/ui'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useResourceStoryProps } from './stories-props.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Resource> = {
  title: 'Pages/Resource',
  component: Resource,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'ResourceLoggedOutStoryProps',
    'ResourceLoggedInStoryProps',
    'ResourceOwnerStoryProps',
    'ResourceActivatedStoryProps',
    'ResourceAdminStoryProps',
    'ResourceApprovedStoryProps',
    'NewResourceProps',
  ],
}

type ResourceStory = ComponentStory<typeof Resource>

export const LoggedOut: ResourceStory = () => {
  const props = useResourceStoryProps({
    resource: {},
    actions: {},
    access: {
      isAuthenticated: false,
    },
  })

  return <Resource {...props} />
}

export const LoggedIn: ResourceStory = () => {
  const props = useResourceStoryProps({})
  return <Resource {...props} />
}

export const Owner: ResourceStory = () => {
  const props = useResourceStoryProps({
    resource: {},
    actions: {
      isPublished: true,
      isSaving: false,
      isSaved: true,
    },
    access: {
      isCreator: true,
      canEdit: true,
    },
  })
  return <Resource {...props} />
}

export const NewResourceProps: Partial<ResourceFormValues> = {
  name: '',
  description: '',
  content: null,
  image: null,
}

export const New: ResourceStory = () => {
  const props = useResourceStoryProps({
    resource: {
      downloadFilename: undefined,
    },
    resourceForm: NewResourceProps,
    actions: {
      isPublished: true,
      isWaitingForApproval: false,
      setIsPublished: action('set is published'),
      isSaving: false,
      isSaved: true,
    },
    access: {
      isCreator: true,
      canEdit: true,
    },
  })
  return <Resource {...props} />
}

// export const Unapproved: ResourceStory = () => {
//   const props = useResourceStoryProps({
//     props: {
//       isCreator: true,
//       //   collectionCardPropsList: [
//       //     CollectionCardOwnerPrivateStoryProps(
//       //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
//       //     ),
//       //     CollectionCardOwnerStoryProps(
//       //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
//       //     ),
//       //     CollectionCardOwnerStoryProps(
//       //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
//       //     ),
//       //     CollectionCardOwnerPrivateStoryProps(
//       //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
//       //     ),
//       //   ],
//       //   resourceCardPropsList: [
//       //     ResourceCardOwnerPrivateStoryProps,
//       //     ResourceCardOwnerStoryProps,
//       //     ResourceCardOwnerStoryProps,
//       //     ResourceCardOwnerPrivateStoryProps,
//       //     ResourceCardOwnerStoryProps,
//       //   ],
//       //   showAccountApprovedSuccessAlert: true,
//     },
//   })
//   return <Resource {...props} />
// }

// export const Activated: ResourceStory = () => {
//   const props = useResourceStoryProps({
//     // editFormValues: {
//     //   description: '',
//     //   location: '',
//     //   avatarImage: null,
//     //   backgroundImage: null,
//     //   organizationName: '',
//     //   siteUrl: '',
//     // },
//     // props: {
//     //   //   collectionCardPropsList: [],
//     //   //   resourceCardPropsList: [],
//     //   showAccountCreationSuccessAlert: true,
//     //   getResourceCardProps: useuseResourceCardStoryProps({
//     //     props: {
//     //       isAuthenticated: true,
//     //       isCreator: true,
//     //     },
//     //   }),
//     // },
//   })
//   return <Resource {...props} />
// }

export const Admin: ResourceStory = () => {
  const props = useResourceStoryProps({
    resource: {},
    actions: {},
    access: {
      canEdit: true,
    },
  })
  return <Resource {...props} />
}

export default meta
