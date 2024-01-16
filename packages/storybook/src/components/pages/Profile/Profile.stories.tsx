import { OverallCardStories } from '@moodlenet/react-app/stories'
// import { Profile } from '@moodlenet/web-user/ui'
import { Profile } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { getCollectionCardsStoryProps } from '../../../components/organisms/CollectionCard/CollectionCardProps.stories.props.js'
import { getResourceCardsStoryProps } from '../../../components/organisms/ResourceCard/ResourceCardProps.stories.props.js'
import { MainLayoutLoggedOutStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'
import { useProfileStoryProps } from './ProfileProps.stories.props.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'ProfileLoggedOutStoryProps',
    'ProfileLoggedInStoryProps',
    'ProfileOwnerStoryProps',
    'ProfileActivatedStoryProps',
    'ProfileAdminStoryProps',
    'ProfileApprovedStoryProps',
  ],
}

type ProfileStory = ComponentStory<typeof Profile>

export const LoggedOut = () => {
  const props = useProfileStoryProps({
    mainLayoutProps: MainLayoutLoggedOutStoryProps,
    access: { isAuthenticated: false, canFollow: false },
    mainColumnItems: [],
    rightColumnItems: [],
    overallCardItems: OverallCardStories.OverallCardNoCardStoryProps.items,
  })

  return <Profile {...props} />
}

export const LoggedIn: ProfileStory = () => {
  const props = useProfileStoryProps({
    access: {
      isAuthenticated: true,
      canApprove: false,
    },
    state: {
      showLevelUpAlert: true,
    },
    // resourceCardPropsList: getResourceCardsStoryProps(5, {access: {canLike: true}}),
    // collectionCardPropsList: getCollectionCardsStoryProps(5, {access: {canFollow: true}}),
    mainColumnItems: [],
    rightColumnItems: [],
  })

  return <Profile {...props} />
}

export const Owner: ProfileStory = () => {
  const props = useProfileStoryProps({
    access: {
      isAuthenticated: true,
      canEdit: true,
      isCreator: true,
      canApprove: false,
      isPublisher: true,
    },
    data: {
      // avatarUrl: undefined,
      // backgroundUrl: undefined,
    },
    state: {
      // isPublisher: false,
      // isWaitingApproval: false,
      // isElegibleForApproval: false,
      showAccountApprovedSuccessAlert: true,
    },
    resourceCardPropsList: getResourceCardsStoryProps(5, {
      access: {
        canDelete: true,
        canPublish: true,
        isCreator: true,
      },
    }),
    collectionCardPropsList: getCollectionCardsStoryProps(5, {
      access: {
        canPublish: true,
        isCreator: true,
      },
    }),
    mainColumnItems: [],
    rightColumnItems: [],
    jiraApprovalButton: {
      isElegibleForApproval: true,
      isWaitingApproval: false,
    },
  })

  const [resourceCardPropsList, setResourceCardPropsList] = useState(props.resourceCardPropsList)

  resourceCardPropsList.map(r => {
    r.onRemoveClick = () => {
      action('onRemoveResourceClick')
      setResourceCardPropsList(resourceCardPropsList.filter(x => x !== r))
    }
  })

  return <Profile {...props} resourceCardPropsList={resourceCardPropsList} />
}

export const Admin: ProfileStory = () => {
  const props = useProfileStoryProps({
    access: { isAdmin: true, canEdit: true, isCreator: false, canApprove: true },
    state: { isPublisher: false },
    resourceCardPropsList: getResourceCardsStoryProps(5, {
      access: {
        canDelete: true,
        canPublish: true,
      },
    }),
    collectionCardPropsList: getCollectionCardsStoryProps(5, {
      access: {
        canPublish: true,
        isCreator: true,
      },
    }),
    mainColumnItems: [],
    rightColumnItems: [],
  })
  return <Profile {...props} />
}

export default meta
