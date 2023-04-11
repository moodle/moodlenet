import { getCollectionsCardStoryProps, LandingCollectionList } from '@moodlenet/collection/ui'
import {
  getProfileCardsStoryProps,
  href,
  Landing,
  LandingProfileList,
  LandingProps,
} from '@moodlenet/react-app/ui'
import { getResourcesCardStoryProps, LandingResourceList } from '@moodlenet/resource/ui'
import { action } from '@storybook/addon-actions'
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
  loginHref: href('Pages/Access/Login'),
  signUpHref: href('Pages/Access/Signup'),
  newResourceHref: href('Pages/Resource/New'),
  newCollectionHref: href('Pages/Collection/New'),
  search: action('search'),
  mainColumnItems: [
    {
      Item: () => (
        <LandingResourceList
          searchResourcesHref={href('Page/Search')}
          resourceCardPropsList={getResourcesCardStoryProps(15, {
            access: {
              isAuthenticated: false,
            },
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
            access: { isAuthenticated: false },
          })}
        />
      ),
      key: 'collection-card-list',
    },
    {
      Item: () => (
        <LandingProfileList
          searchAuthorsHref={href('Page/Search')}
          profilesPropsList={getProfileCardsStoryProps(15, {
            access: { isAuthenticated: false },
          })}
        />
      ),
      key: 'people-card-list',
    },
  ],
  shareContentModalItems: [],
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
            state: {
              // liked: true,
              // bookmarked: true,
            },
            access: {
              canDelete: false,
              canPublish: false,
            },
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
            state: {
              // followed: true,
              // bookmarked: true,
            },
          })}
        />
      ),
      key: 'resource-card-list',
    },
    {
      Item: () => (
        <LandingProfileList
          searchAuthorsHref={href('Page/Search')}
          profilesPropsList={getProfileCardsStoryProps(15, {
            state: {
              // followed: true,
            },
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
              state: {
                isPublished: true,
              },
              access: {
                canDelete: true,
                canPublish: true,
                isAuthenticated: true,
              },
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
              state: {
                isPublished: false,
              },
              access: {
                isCreator: true,
                canPublish: true,
                isAuthenticated: true,
              },
            })}
          />
        ),
        key: 'resource-card-list',
      },
      {
        Item: () => (
          <LandingProfileList
            searchAuthorsHref={href('Page/Search')}
            profilesPropsList={getProfileCardsStoryProps(15, {
              access: {
                isCreator: true,
              },
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
