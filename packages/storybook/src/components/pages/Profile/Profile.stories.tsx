import { getCollectionsCardStoryProps } from '@moodlenet/collection/ui'
import { getResourcesCardStoryProps } from '@moodlenet/ed-resource/ui'
import { Profile } from '@moodlenet/web-user/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MainLayoutLoggedOutStoryProps } from '../../layout/MainLayout/MainLayout.stories.js'
import { useProfileStoryProps } from './stories-props.js'
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
    access: { isAuthenticated: false },
    mainColumnItems: [],
    sideColumnItems: [],
  })

  return <Profile {...props} />
}

export const LoggedIn: ProfileStory = () => {
  const props = useProfileStoryProps({
    access: { isAuthenticated: true },
    // resourceCardPropsList: getResourcesCardStoryProps(5, {access: {canLike: true}}),
    // collectionCardPropsList: getCollectionsCardStoryProps(5, {access: {canFollow: true}}),
    mainColumnItems: [],
    sideColumnItems: [],
  })

  return <Profile {...props} />
}

export const Owner: ProfileStory = () => {
  const props = useProfileStoryProps({
    access: { isAuthenticated: true, canEdit: true, isCreator: true },
    resourceCardPropsList: getResourcesCardStoryProps(5, {
      access: {
        canDelete: true,
        canPublish: true,
      },
    }),
    collectionCardPropsList: getCollectionsCardStoryProps(5, {
      access: {
        canPublish: true,
        isCreator: true,
      },
    }),
    mainColumnItems: [],
    sideColumnItems: [],
  })

  return <Profile {...props} />
}

export const Admin: ProfileStory = () => {
  const props = useProfileStoryProps({
    access: { isAdmin: true, canEdit: true, isCreator: false },
    resourceCardPropsList: getResourcesCardStoryProps(5, {
      access: {
        canDelete: true,
        canPublish: true,
      },
    }),
    collectionCardPropsList: getCollectionsCardStoryProps(5, {
      access: {
        canPublish: true,
        isCreator: true,
      },
    }),
    mainColumnItems: [],
    sideColumnItems: [],
  })
  return <Profile {...props} />
}

export default meta
