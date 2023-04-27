import { getCollectionsCardStoryProps, ProfileCollectionList } from '@moodlenet/collection/ui'
import { getResourcesCardStoryProps, ProfileResourceList } from '@moodlenet/ed-resource/ui'
import { href } from '@moodlenet/react-app/common'
import { OverallCardStories } from '@moodlenet/react-app/stories'
import { OverallCard } from '@moodlenet/react-app/ui'
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
    mainColumnItems: [
      {
        Item: () => (
          <ProfileResourceList
            isCreator={false}
            newResourceHref={href('Page/Resource/New')}
            resourceCardPropsList={getResourcesCardStoryProps(5, {
              access: {
                // isAuthenticated: false
              },
            })}
          />
        ),
        key: 'resource-card-list',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                //  isAuthenticated: false
              },
            })}
          />
        ),
        key: 'collection-card-list',
      },
    ],
    sideColumnItems: [
      {
        Item: () => <OverallCard {...OverallCardStories.OverallCardStoryProps} />,
        key: 'overall-card',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                // isAuthenticated: false,
              },
            })}
          />
        ),
        key: 'profile-card-list',
      },
    ],
  })

  return <Profile {...props} />
}

export const LoggedIn: ProfileStory = () => {
  const props = useProfileStoryProps({
    access: { isAuthenticated: true },
    mainColumnItems: [
      {
        Item: () => (
          <ProfileResourceList
            isCreator={false}
            newResourceHref={href('Page/Resource/New')}
            resourceCardPropsList={getResourcesCardStoryProps(5, {})}
          />
        ),
        key: 'resource-card-list',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {})}
          />
        ),
        key: 'collection-card-list',
      },
    ],
    sideColumnItems: [
      {
        Item: () => <OverallCard {...OverallCardStories.OverallCardStoryProps} />,
        key: 'overall-card',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {})}
          />
        ),
        key: 'profile-card-list',
      },
    ],
  })

  return <Profile {...props} />
}

export const Owner: ProfileStory = () => {
  const props = useProfileStoryProps({
    access: { isAuthenticated: true, canEdit: true, isCreator: true },
    mainColumnItems: [
      {
        Item: () => (
          <ProfileResourceList
            isCreator={true}
            newResourceHref={href('Page/Resource/New')}
            resourceCardPropsList={getResourcesCardStoryProps(5, {
              access: {
                canDelete: true,
                canPublish: true,
              },
            })}
          />
        ),
        key: 'resource-card-list',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={true}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                canPublish: true,
                isCreator: true,
              },
            })}
          />
        ),
        key: 'collection-card-list',
      },
    ],
    sideColumnItems: [
      {
        Item: () => <OverallCard {...OverallCardStories.OverallCardStoryProps} />,
        key: 'overall-card',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={true}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                isCreator: true,
                canPublish: true,
              },
            })}
          />
        ),
        key: 'profile-card-list',
      },
    ],
  })

  return <Profile {...props} />
}

export const Admin: ProfileStory = () => {
  const props = useProfileStoryProps({
    access: { isAdmin: true, canEdit: true },
    mainColumnItems: [
      {
        Item: () => (
          <ProfileResourceList
            isCreator={false}
            newResourceHref={href('Page/Resource/New')}
            resourceCardPropsList={getResourcesCardStoryProps(5, {
              access: {
                canDelete: true,
                canPublish: true,
              },
            })}
          />
        ),
        key: 'resource-card-list',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                canPublish: true,
                isCreator: true,
              },
            })}
          />
        ),
        key: 'collection-card-list',
      },
    ],
    sideColumnItems: [
      {
        Item: () => <OverallCard {...OverallCardStories.OverallCardStoryProps} />,
        key: 'overall-card',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                isCreator: true,
                canPublish: true,
              },
            })}
          />
        ),
        key: 'profile-card-list',
      },
    ],
  })
  return <Profile {...props} />
}

export default meta
