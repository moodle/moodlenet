import { Collection } from '@moodlenet/collection/ui'
import { getResourcesCardStoryProps } from '@moodlenet/resource/ui'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
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
    collection: {},
    actions: {},
    access: {
      isAuthenticated: false,
    },
    resourceCardPropsList: getResourcesCardStoryProps(15, {
      isAuthenticated: false,
      orientation: 'horizontal',
    }),
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
    collection: {},
    actions: {
      bookmarked: true,
      followed: true,
    },
    access: {},
  })

  return <Collection {...props} />
}

export const Owner: CollectionStory = () => {
  const props = useCollectionStoryProps({
    collection: {},
    actions: {
      isPublished: false,
      bookmarked: true,
      followed: true,
      // isSaving: true,
      isSaving: false,
      // isSaved: true,
    },
    access: {
      isOwner: true,
      canEdit: true,
    },
    resourceCardPropsList: getResourcesCardStoryProps(15, {
      canEdit: true,
      isOwner: true,
      orientation: 'horizontal',
    }),
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
    collection: {
      mnUrl: 'moodle.com',
    },
    collectionForm: NewCollectionProps,
    actions: {
      bookmarked: true,
      followed: true,
      // isSaving: true,
      isSaving: false,
      // isSaved: true,
      isWaitingForApproval: false,
      setIsPublished: action('set is published'),
    },
    access: {
      isOwner: true,
      canEdit: true,
    },
    resourceCardPropsList: [],
  })

  return <Collection {...props} />
}

export const Admin: CollectionStory = () => {
  const props = useCollectionStoryProps({
    collection: {},
    actions: {},
    access: {
      isAdmin: true,
      canEdit: true,
    },
  })
  return <Collection {...props} />
}

export default meta
