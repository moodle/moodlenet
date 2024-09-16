import { LandingCollectionList } from '@moodlenet/collection/ui'
import { LandingResourceList } from '@moodlenet/ed-resource/ui'
import { href } from '@moodlenet/react-app/common'
import type { LandingProps } from '@moodlenet/react-app/ui'
import { Landing } from '@moodlenet/react-app/ui'
import { LandingProfileList, Leaderboard, PublishContent } from '@moodlenet/web-user/ui'
import { linkTo } from '@storybook/addon-links'
import type { Meta as ComponentMeta, StoryFn as ComponentStory } from '@storybook/react'
import { getCollectionCardsStoryProps } from '../../../components/organisms/CollectionCard/CollectionCardProps.stories.props.js'
import { getProfileCardsStoryProps } from '../../../components/organisms/ProfileCard/ProfileCardProps.stories.props.js'
import { getResourceCardsStoryProps } from '../../../components/organisms/ResourceCard/ResourceCardProps.stories.props.js'
import {
  MainLayoutLoggedInStoryProps,
  MainLayoutLoggedOutStoryProps,
} from '../../layout/MainLayout/MainLayout.stories.js'
import { getMainHeaderStoryProps } from '../../organisms/MainHeader/MainHeaderProps.stories.props.js'
// import { href } from '../../../elements/link'

const leaderboardContributors = [
  {
    avatarUrl:
      'https://moodle.net/.pkg/@moodlenet/web-user/public/2022/02/02/10/38/39/147_rosmanitz.jpg',
    points: 112982,
    displayName: 'Krosmanitz',
    profileHref: href('Pages/Profile/Default'),
    subject: 'Mathematics',
  },
  {
    avatarUrl:
      'https://moodle.net/.pkg/@moodlenet/web-user/public/2023/04/06/10/03/42/761_Grasple_logo_G_Test.jpeg',
    points: 89456,
    displayName: 'Grasple - Open Education',
    profileHref: href('Pages/Profile/Default'),
    subject: 'Physics',
  },
  {
    avatarUrl: undefined,
    // 'https://moodle.net/.pkg/@moodlenet/web-user/public/2023/05/18/15/45/42/838_foto_rid_seria.jpeg',
    points: 44234,
    displayName: 'Carlo Cavicchioli',
    profileHref: href('Pages/Profile/Default'),
    subject: 'Chemistry',
  },
  {
    avatarUrl:
      'https://moodle.net/.pkg/@moodlenet/web-user/public/2023/05/29/17/33/21/516_YamnaProfile.jpg',
    points: 10980,
    displayName: 'Yamna Ettarres',
    profileHref: href('Pages/Profile/Default'),
    subject: 'Biology',
  },
  {
    avatarUrl:
      'https://moodle.net/.pkg/@moodlenet/web-user/public/2022/12/02/16/06/47/019_IMG_20190213_160443c.jpg',
    points: 662,
    displayName: 'Carrie Alena',
    profileHref: href('Pages/Profile/Default'),
    subject: 'Environmental Science',
  },
]

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
    {
      Item: () => <Leaderboard contributors={leaderboardContributors} />,
      key: 'leaderboard',
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
  mainLayoutProps: {
    ...MainLayoutLoggedInStoryProps,
    headerProps: getMainHeaderStoryProps({ isAuthenticated: true, hasAlerts: true }),
  },
  mainColumnItems: [
    // {
    //   Item: () => (
    //     <InterestInfo
    //       userSettingHref={href('Pages/Settings/Default')}
    //       doNotShowAgain={action('doNotShowAgain')}
    //     />
    //   ),
    //   key: 'interest-info',
    // },
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
    {
      Item: () => <Leaderboard contributors={leaderboardContributors} />,
      key: 'leaderboard',
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
      {
        Item: () => <Leaderboard contributors={leaderboardContributors} />,
        key: 'leaderboard',
      },
    ],
  }
  return <Landing {...props} />
}

export default meta
