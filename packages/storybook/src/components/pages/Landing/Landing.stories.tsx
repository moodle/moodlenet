import { LandingCollectionList } from '@moodlenet/collection/ui'
import { LandingResourceList } from '@moodlenet/ed-resource/ui'
import { href } from '@moodlenet/react-app/common'
import type { LandingProps } from '@moodlenet/react-app/ui'
import { Landing } from '@moodlenet/react-app/ui'
import { InterestInfo, LandingProfileList, PublishContent } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { getCollectionCardsStoryProps } from '../../../components/organisms/CollectionCard/CollectionCardProps.stories.props.js'
import { getProfileCardsStoryProps } from '../../../components/organisms/ProfileCard/ProfileCardProps.stories.props.js'
import { getResourceCardsStoryProps } from '../../../components/organisms/ResourceCard/ResourceCardProps.stories.props.js'
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
          searchResourcesHref={href('Pages/Search')}
          hasSetInterests={false}
          resourceCardPropsList={getResourceCardsStoryProps(15, {
            access: {
              // isAuthenticated: false,
              canPublish: false,
            },
            state: {
              isPublished: false,
            },
          })}
        />
      ),
      key: 'resource-card-list',
    },
    {
      Item: () => (
        <LandingCollectionList
          searchCollectionsHref={href('Pages/Search')}
          hasSetInterests={false}
          collectionCardPropsList={getCollectionCardsStoryProps(15, {
            state: {
              numResources: 2,
            },
            access: {
              // isAuthenticated: false,
              canPublish: false,
              // canBookmark: false,
              // canFollow: false,
            },
          })}
        />
      ),
      key: 'collection-card-list',
    },
    {
      Item: () => (
        <LandingProfileList
          searchAuthorsHref={href('Pages/Search')}
          hasSetInterests={false}
          profilesPropsList={getProfileCardsStoryProps(15, {
            access: { isAuthenticated: false },
          })}
        />
      ),
      key: 'people-card-list',
    },
  ],
  headerCardItems: [
    {
      Item: () => (
        <PublishContent
          publishContentHrefs={{
            loginHref: href('Pages/Access/Login/Default'),
            signUpHref: href('Pages/Access/SignUp/Default'),
            createResource: linkTo('Pages/Resource', 'New'),
            createCollection: linkTo('Pages/Collection', 'New'),
          }}
          isAuthenticated={false}
        />
      ),
      key: 'publish-content',
    },
  ],
}

export const LandingLoggedInStoryProps: LandingProps = {
  ...LandingLoggedOutStoryProps,
  mainLayoutProps: MainLayoutLoggedInStoryProps,
  mainColumnItems: [
    {
      Item: () => (
        <InterestInfo
          userSettingHref={href('Pages/Settings/Default')}
          doNotShowAgain={action('doNotShowAgain')}
        />
      ),
      key: 'interest-info',
    },
    {
      Item: () => (
        <LandingResourceList
          searchResourcesHref={href('Pages/Search')}
          hasSetInterests={true}
          resourceCardPropsList={getResourceCardsStoryProps(15, {
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
          searchCollectionsHref={href('Pages/Search')}
          hasSetInterests={true}
          collectionCardPropsList={getCollectionCardsStoryProps(15, {
            state: {
              // followed: true,
              // bookmarked: true,
            },
            access: {
              canPublish: false,
            },
          })}
        />
      ),
      key: 'collection-card-list',
    },
    {
      Item: () => (
        <LandingProfileList
          searchAuthorsHref={href('Pages/Search')}
          hasSetInterests={true}
          profilesPropsList={getProfileCardsStoryProps(15, {
            state: {
              // followed: true,
            },
            access: {},
          })}
        />
      ),
      key: 'people-card-list',
    },
  ],
  headerCardItems: [
    {
      Item: () => (
        <PublishContent
          publishContentHrefs={{
            loginHref: href('Pages/Access/Login/Default'),
            signUpHref: href('Pages/Access/SignUp/Default'),
            createResource: linkTo('Pages/Resource', 'New'),
            createCollection: linkTo('Pages/Collection', 'New'),
          }}
          isAuthenticated={true}
        />
      ),
      key: 'publish-content',
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
            searchResourcesHref={href('Pages/Search')}
            hasSetInterests={true}
            resourceCardPropsList={getResourceCardsStoryProps(15, {
              state: {
                isPublished: true,
              },
              access: {
                canDelete: true,
                canPublish: true,
                // isAuthenticated: true,
                // canLike: false,
                isCreator: true,
              },
            })}
          />
        ),
        key: 'resource-card-list',
      },
      {
        Item: () => (
          <LandingCollectionList
            searchCollectionsHref={href('Pages/Search')}
            hasSetInterests={true}
            collectionCardPropsList={getCollectionCardsStoryProps(15, {
              state: {
                isPublished: true,
              },
              access: {
                isCreator: true,
                canPublish: true,
                // canBookmark: true,
                // isAuthenticated: true,
              },
            })}
          />
        ),
        key: 'collection-card-list',
      },
      {
        Item: () => (
          <LandingProfileList
            searchAuthorsHref={href('Pages/Search')}
            hasSetInterests={true}
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
