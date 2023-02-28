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

export const LoggedOut: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      mainLayoutProps: MainLayoutLoggedOutStoryProps,
      profileCardProps: useProfileCardStoryProps({
        props: { isAuthenticated: false },
      }),
      mainColumnItems: [
        {
          Item: () => (
            <ProfileResourceList
              isOwner={false}
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
              isOwner={false}
              newCollectionHref={href('Page/Collection/New')}
              collectionCardPropsList={getCollectionsCardStoryProps(5, {
                isAuthenticated: false,
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
              isOwner={false}
              newCollectionHref={href('Page/Collection/New')}
              collectionCardPropsList={getCollectionsCardStoryProps(5, {
                isAuthenticated: false,
              })}
            />
          ),
          key: 'collection-card-list',
        },
      ],
    },
  })

  return <Profile {...props} />
}

export const LoggedIn: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({
        props: { isAuthenticated: true },
      }),
      mainColumnItems: [
        {
          Item: () => (
            <ProfileResourceList
              isOwner={false}
              newResourceHref={href('Page/Resource/New')}
              resourceCardPropsList={getResourcesCardStoryProps(5, {})}
            />
          ),
          key: 'collection-card-list',
        },
        {
          Item: () => (
            <ProfileCollectionList
              isOwner={false}
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
              isOwner={false}
              newCollectionHref={href('Page/Collection/New')}
              collectionCardPropsList={getCollectionsCardStoryProps(5, {})}
            />
          ),
          key: 'collection-card-list',
        },
      ],
    },
  })
  return <Profile {...props} />
}

export const Owner: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({
        props: { isOwner: true, canEdit: true, isApproved: true },
      }),
      mainColumnItems: [
        {
          Item: () => (
            <ProfileResourceList
              isOwner={true}
              newResourceHref={href('Page/Resource/New')}
              resourceCardPropsList={getResourcesCardStoryProps(5, {
                isOwner: true,
                canEdit: true,
              })}
            />
          ),
          key: 'collection-card-list',
        },
        {
          Item: () => (
            <ProfileCollectionList
              isOwner={true}
              newCollectionHref={href('Page/Collection/New')}
              collectionCardPropsList={getCollectionsCardStoryProps(5, {
                isOwner: true,
                canEdit: true,
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
              isOwner={false}
              newCollectionHref={href('Page/Collection/New')}
              collectionCardPropsList={getCollectionsCardStoryProps(5, {
                isOwner: true,
                canEdit: true,
              })}
            />
          ),
          key: 'collection-card-list',
        },
      ],
    },
  })
  return <Profile {...props} />
}

export const Admin: ProfileStory = () => {
  const props = useProfileStoryProps({
    props: {
      profileCardProps: useProfileCardStoryProps({ props: { isAdmin: true, canEdit: true } }),
      mainColumnItems: [
        {
          Item: () => (
            <ProfileResourceList
              isOwner={false}
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
              isOwner={false}
              newCollectionHref={href('Page/Collection/New')}
              collectionCardPropsList={getCollectionsCardStoryProps(5, {
                canEdit: true,
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
              isOwner={false}
              newCollectionHref={href('Page/Collection/New')}
              collectionCardPropsList={getCollectionsCardStoryProps(5, {
                canEdit: true,
              })}
            />
          ),
          key: 'collection-card-list',
        },
      ],
    },
  })
  return <Profile {...props} />
}

export default meta
