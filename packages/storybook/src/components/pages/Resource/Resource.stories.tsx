import { Resource } from '@moodlenet/resource/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useMainResourceCardStoryProps } from 'components/organisms/MainResourceCard/stories-props.js'
import { useState } from 'react'
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
  ],
}

type ResourceStory = ComponentStory<typeof Resource>

export const LoggedOut: ResourceStory = () => {
  const props = useResourceStoryProps({
    props: {
      isAuthenticated: false,
    },
  })
  //     {
  //     props: {
  //       headerPageTemplateProps: {
  //         isAuthenticated: false,
  //         headerPageProps: {
  //           // isAuthenticated: false,
  //           headerProps: {
  //             ...HeaderLoggedOutStoryProps,
  //             me: null,
  //           },
  //           // subHeaderProps: {
  //           //   tags: [],
  //           // },
  //         },
  //         mainPageWrapperProps: {
  //           userAcceptsPolicies: null,
  //           cookiesPolicyHref: href('Pages/Policies/CookiesPolicy/Default'),
  //         },
  //       },
  //       collectionCardPropsList: [
  //         CollectionCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //         CollectionCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //         CollectionCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //       ],
  //       resourceCardPropsList: [
  //         ResourceCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //         ResourceCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //       ],
  //     },
  //   }
  //   )

  return <Resource {...props} />
}

export const LoggedIn: ResourceStory = () => {
  const props = useResourceStoryProps({
    props: {},
  })
  return <Resource {...props} />
}

export const Owner: ResourceStory = () => {
  const props = useResourceStoryProps({
    props: {
      isOwner: true,
      canEdit: true,
      mainResourceCardProps: useMainResourceCardStoryProps({
        props: { isOwner: true, canEdit: true },
      }),
      //   collectionCardPropsList: [
      //     CollectionCardOwnerPrivateStoryProps(
      //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
      //     ),
      //     CollectionCardOwnerStoryProps(
      //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
      //     ),
      //     CollectionCardOwnerStoryProps(
      //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
      //     ),
      //     CollectionCardOwnerPrivateStoryProps(
      //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
      //     ),
      //   ],
      //   resourceCardPropsList: [
      //     ResourceCardOwnerPrivateStoryProps,
      //     ResourceCardOwnerStoryProps,
      //     ResourceCardOwnerStoryProps,
      //     ResourceCardOwnerPrivateStoryProps,
      //     ResourceCardOwnerStoryProps,
      //   ],
    },
  })
  return <Resource {...props} />
}

export const NewResourceProps = {
  content: null,
  name: '',
  description: '',
  category: '',
  image: null,

  // visibility: 'Private',
  isFile: false,
}

export const New: ResourceStory = () => {
  // const [isEditting, setIsEditing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  // const [isWaitingForApproval, setIsWaitingForApproval] = useState(true)

  // useEffect(() => {
  //   !isPublished && setIsWaitingForApproval(false)
  // }, [isPublished])

  const props = useResourceStoryProps({
    resourceValues: NewResourceProps,
    props: {
      isOwner: true,
      canEdit: true,
      // isEditing: isEditting,
      // setIsEditing: setIsEditing,
      isWaitingForApproval: false,
      isPublished: isPublished,
      setIsPublished: setIsPublished,
      mainResourceCardProps: useMainResourceCardStoryProps({
        props: {
          // isOwner: true,
          // canEdit: true,
          // isEditing: false,
        },
        resourceValues: NewResourceProps,
      }),
    },
  })
  return <Resource {...props} />
}

// export const Unapproved: ResourceStory = () => {
//   const props = useResourceStoryProps({
//     props: {
//       isOwner: true,
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
//     //       isOwner: true,
//     //     },
//     //   }),
//     // },
//   })
//   return <Resource {...props} />
// }

export const Admin: ResourceStory = () => {
  const props = useResourceStoryProps({
    props: {
      isAdmin: true,
      //   getResourceCardProps: useuseResourceCardStoryProps({
      //     props: {
      //       isAuthenticated: true,
      //       isApproved: false,
      //     },
      //   }),
      //   collectionCardPropsList: [],
      //   resourceCardPropsList: [],
      //   showAccountApprovedSuccessAlert: true,
    },
  })
  return <Resource {...props} />
}

export default meta
