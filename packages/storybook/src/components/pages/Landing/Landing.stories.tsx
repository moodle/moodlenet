import { getCollectionsCardStoryProps, LandingCollectionList } from '@moodlenet/collection/ui'
import {
  getSmallProfilesCardStoryProps,
  href,
  Landing,
  LandingProps,
  SmallProfileCardList,
} from '@moodlenet/react-app/ui'
import { getResourcesCardStoryProps, LandingResourceList } from '@moodlenet/resource/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../layout/MainLayout/MainLayout.stories.js'
// import { href } from '../../../elements/link'

const meta: ComponentMeta<typeof Landing> = {
  title: 'Pages/Landing',
  component: Landing,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: ['LandingLoggedOutStoryProps', 'LandingLoggedInStoryProps'],
}

export const LandingLoggedOutStoryProps: LandingProps = {
  mainLayoutProps: MainLayoutLoggedOutStoryProps,
  title: 'Find, share and curate open educational resources',
  subtitle: 'Search for resources, subjects, collections or people',
  mainColumnItems: [
    {
      Item: () => (
        <LandingResourceList
          searchResourcesHref={href('Page/Search')}
          resourceCardPropsList={getResourcesCardStoryProps(15, {
            isAuthenticated: false,
          })}
        />
      ),
      key: 'resource-card-list',
    },
    {
      Item: () => (
        <LandingCollectionList
          searchCollectionsHref={href('Page/Search')}
          collectionCardPropsList={getCollectionsCardStoryProps(15, {
            isAuthenticated: false,
          })}
        />
      ),
      key: 'collection-card-list',
    },
    {
      Item: () => (
        <SmallProfileCardList
          searchAuthorsHref={href('Page/Search')}
          smallProfileCardPropsList={getSmallProfilesCardStoryProps(15, {
            isAuthenticated: false,
          })}
        />
      ),
      key: 'people-card-list',
    },
  ],
}

export const LandingLoggedInStoryProps: LandingProps = {
  ...LandingLoggedOutStoryProps,
  mainLayoutProps: MainLayoutLoggedInStoryProps,
  mainColumnItems: [
    {
      Item: () => (
        <LandingResourceList
          searchResourcesHref={href('Page/Search')}
          resourceCardPropsList={getResourcesCardStoryProps(15, {
            liked: true,
            bookmarked: true,
          })}
        />
      ),
      key: 'resource-card-list',
    },
    {
      Item: () => (
        <LandingCollectionList
          searchCollectionsHref={href('Page/Search')}
          collectionCardPropsList={getCollectionsCardStoryProps(15, {
            followed: true,
            bookmarked: true,
          })}
        />
      ),
      key: 'resource-card-list',
    },
    {
      Item: () => (
        <SmallProfileCardList
          searchAuthorsHref={href('Page/Search')}
          smallProfileCardPropsList={getSmallProfilesCardStoryProps(15, {
            followed: true,
          })}
        />
      ),
      key: 'people-card-list',
    },
  ],
}

type LandingStory = ComponentStory<typeof Landing>

export const LoggedOut: LandingStory = () => {
  const props = {
    ...LandingLoggedOutStoryProps,
  }
  return <Landing {...props} />
}

export const LoggedIn: LandingStory = () => {
  const props = {
    ...LandingLoggedInStoryProps,
  }
  return <Landing {...props} />
}

export const Owner: LandingStory = () => {
  const props = {
    ...LandingLoggedInStoryProps,
    mainColumnItems: [
      {
        Item: () => (
          <LandingResourceList
            searchResourcesHref={href('Page/Search')}
            resourceCardPropsList={getResourcesCardStoryProps(15, {
              isOwner: true,
              canEdit: true,
              isPublished: true,
            })}
          />
        ),
        key: 'resource-card-list',
      },
      {
        Item: () => (
          <LandingCollectionList
            searchCollectionsHref={href('Page/Search')}
            collectionCardPropsList={getCollectionsCardStoryProps(15, {
              isOwner: true,
              canEdit: true,
              isPublished: false,
            })}
          />
        ),
        key: 'resource-card-list',
      },
      {
        Item: () => (
          <SmallProfileCardList
            searchAuthorsHref={href('Page/Search')}
            smallProfileCardPropsList={getSmallProfilesCardStoryProps(15, {
              isOwner: true,
            })}
          />
        ),
        key: 'people-card-list',
      },
    ],
  }
  return <Landing {...props} />
}

export default meta
