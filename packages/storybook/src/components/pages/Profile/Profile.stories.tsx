import { getCollectionsCardStoryProps, ProfileCollectionList } from '@moodlenet/collection/ui'
import { href, Profile, useProfileCardStoryProps } from '@moodlenet/react-app/ui'
import { getResourcesCardStoryProps, ProfileResourceList } from '@moodlenet/resource/ui'
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
    profileCardProps: useProfileCardStoryProps({
      access: { isAuthenticated: false },
    }),
    mainColumnItems: [
      {
        Item: () => (
          <ProfileResourceList
            isCreator={false}
            newResourceHref={href('Page/Resource/New')}
            resourceCardPropsList={getResourcesCardStoryProps(5, {
              isAuthenticated: false,
            })}
          />
        ),
        key: 'collection-card-list',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: { isAuthenticated: false },
            })}
          />
        ),
        key: 'collection-card-list',
      },
    ],
    sideColumnItems: [
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                isAuthenticated: false,
              },
            })}
          />
        ),
        key: 'collection-card-list',
      },
    ],

    access: { isAuthenticated: false },
  })

  return <Profile {...props} />
}

export const LoggedIn: ProfileStory = () => {
  const props = useProfileStoryProps({
    profileCardProps: useProfileCardStoryProps({
      access: { isAuthenticated: true },
    }),
    mainColumnItems: [
      {
        Item: () => (
          <ProfileResourceList
            isCreator={false}
            newResourceHref={href('Page/Resource/New')}
            resourceCardPropsList={getResourcesCardStoryProps(5, {})}
          />
        ),
        key: 'collection-card-list',
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

    access: { isAuthenticated: true },
  })

  return <Profile {...props} />
}

export const Owner: ProfileStory = () => {
  const props = useProfileStoryProps({
    profileCardProps: useProfileCardStoryProps({
      props: { isCreator: true, canEdit: true, isApproved: true },
    }),
    mainColumnItems: [
      {
        Item: () => (
          <ProfileResourceList
            isCreator={true}
            newResourceHref={href('Page/Resource/New')}
            resourceCardPropsList={getResourcesCardStoryProps(5, {
              isCreator: true,
              canEdit: true,
            })}
          />
        ),
        key: 'collection-card-list',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={true}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                isCreator: true,
                canEdit: true,
              },
            })}
          />
        ),
        key: 'collection-card-list',
      },
    ],
    sideColumnItems: [
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                isCreator: true,
                canEdit: true,
              },
            })}
          />
        ),
        key: 'collection-card-list',
      },
    ],
    access: { isOwner: true, canEdit: true },
  })

  return <Profile {...props} />
}

export const Admin: ProfileStory = () => {
  const props = useProfileStoryProps({
    profileCardProps: useProfileCardStoryProps({ props: { isAdmin: true, canEdit: true } }),
    mainColumnItems: [
      {
        Item: () => (
          <ProfileResourceList
            isCreator={false}
            newResourceHref={href('Page/Resource/New')}
            resourceCardPropsList={getResourcesCardStoryProps(5, {
              canEdit: true,
            })}
          />
        ),
        key: 'collection-card-list',
      },
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                canEdit: true,
              },
            })}
          />
        ),
        key: 'collection-card-list',
      },
    ],
    sideColumnItems: [
      {
        Item: () => (
          <ProfileCollectionList
            isCreator={false}
            newCollectionHref={href('Page/Collection/New')}
            collectionCardPropsList={getCollectionsCardStoryProps(5, {
              access: {
                canEdit: true,
              },
            })}
          />
        ),
        key: 'collection-card-list',
      },
    ],
    access: {
      isCreator: true,
      canEdit: true,
    },
  })
  return <Profile {...props} />
}

export default meta
