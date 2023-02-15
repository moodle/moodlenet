import { Collection } from '@moodlenet/collection/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useMainCollectionCardStoryProps } from 'components/organisms/MainCollectionCard/stories-props.js'
import { useState } from 'react'
import { useCollectionStoryProps } from './stories-props.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Collection> = {
  title: 'Pages/Collection',
  component: Collection,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'CollectionLoggedOutStoryProps',
    'CollectionLoggedInStoryProps',
    'CollectionOwnerStoryProps',
    'CollectionActivatedStoryProps',
    'CollectionAdminStoryProps',
    'CollectionApprovedStoryProps',
    'NewCollectionProps',
  ],
}

type CollectionStory = ComponentStory<typeof Collection>

export const LoggedOut: CollectionStory = () => {
  const props = useCollectionStoryProps({
    props: {
      isAuthenticated: false,
      mainCollectionCardProps: useMainCollectionCardStoryProps({
        props: {
          // followed: false,
        },
      }),
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
  //       CollectionCardPropsList: [
  //         CollectionCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //         CollectionCardLoggedOutStoryProps(
  //           randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //         ),
  //       ],
  //     },
  //   }
  //   )

  return <Collection {...props} />
}

export const LoggedIn: CollectionStory = () => {
  const props = useCollectionStoryProps({
    props: {
      mainCollectionCardProps: useMainCollectionCardStoryProps({
        props: {
          bookmarked: true,
          followed: true,
        },
      }),
    },
  })
  return <Collection {...props} />
}

export const Owner: CollectionStory = () => {
  const props = useCollectionStoryProps({
    props: {
      isOwner: true,
      canEdit: true,
      isPublished: false,
      mainCollectionCardProps: useMainCollectionCardStoryProps({
        props: {
          isOwner: true,
          isPublished: false,
          canEdit: true,
          // isSaving: true,
          isSaving: false,
          // isSaved: true,
        },
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
      //   CollectionCardPropsList: [
      //     CollectionCardOwnerPrivateStoryProps,
      //     CollectionCardOwnerStoryProps,
      //     CollectionCardOwnerStoryProps,
      //     CollectionCardOwnerPrivateStoryProps,
      //     CollectionCardOwnerStoryProps,
      //   ],
    },
  })
  return <Collection {...props} />
}

export const NewCollectionProps = {
  content: null,
  name: '',
  description: '',
  category: '',
  type: '',
  image: null,
  // visibility: 'Private',
  isFile: false,
}

export const New: CollectionStory = () => {
  // const [isEditting, setIsEditing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  // const [uploadProgress, setUploadProgress] = useState(0)

  // useEffect(() => {
  //   uploadProgress < 100 && setTimeout(() => setUploadProgress(oldCount => oldCount + 1), 70)
  // }, [uploadProgress])
  // const [isWaitingForApproval, setIsWaitingForApproval] = useState(true)

  // useEffect(() => {
  //   !isPublished && setIsWaitingForApproval(false)
  // }, [isPublished])

  const props = useCollectionStoryProps({
    collectionValues: NewCollectionProps,
    props: {
      isOwner: true,
      canEdit: true,
      collectionUrl: 'moodle.com',
      // isEditing: isEditting,
      // setIsEditing: setIsEditing,
      isWaitingForApproval: false,
      isPublished: isPublished,
      setIsPublished: setIsPublished,
      mainCollectionCardProps: useMainCollectionCardStoryProps({
        props: {
          uploadProgress: 50,
          // isOwner: true,
          // canEdit: true,
          // isEditing: false,
        },
        collectionValues: NewCollectionProps,
      }),
    },
  })
  return <Collection {...props} />
}

// export const Unapproved: CollectionStory = () => {
//   const props = useCollectionStoryProps({
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
//       //   CollectionCardPropsList: [
//       //     CollectionCardOwnerPrivateStoryProps,
//       //     CollectionCardOwnerStoryProps,
//       //     CollectionCardOwnerStoryProps,
//       //     CollectionCardOwnerPrivateStoryProps,
//       //     CollectionCardOwnerStoryProps,
//       //   ],
//       //   showAccountApprovedSuccessAlert: true,
//     },
//   })
//   return <Collection {...props} />
// }

// export const Activated: CollectionStory = () => {
//   const props = useCollectionStoryProps({
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
//     //   //   CollectionCardPropsList: [],
//     //   showAccountCreationSuccessAlert: true,
//     //   getCollectionCardProps: useuseCollectionCardStoryProps({
//     //     props: {
//     //       isAuthenticated: true,
//     //       isOwner: true,
//     //     },
//     //   }),
//     // },
//   })
//   return <Collection {...props} />
// }

export const Admin: CollectionStory = () => {
  const props = useCollectionStoryProps({
    props: {
      canEdit: true,
      //   getCollectionCardProps: useuseCollectionCardStoryProps({
      //     props: {
      //       isAuthenticated: true,
      //       isApproved: false,
      //     },
      //   }),
      //   collectionCardPropsList: [],
      //   CollectionCardPropsList: [],
      //   showAccountApprovedSuccessAlert: true,
    },
  })
  return <Collection {...props} />
}

export default meta
