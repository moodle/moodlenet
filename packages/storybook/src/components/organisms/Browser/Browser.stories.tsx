import { getCollectionsCardStoryProps, LandingCollectionList } from '@moodlenet/collection/ui'
import {
  Browser,
  BrowserProps,
  getSmallProfilesCardStoryProps,
  href,
  SmallProfileCardList,
} from '@moodlenet/react-app/ui'
import { getResourcesCardStoryProps, LandingResourceList } from '@moodlenet/resource/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useMemo } from 'react'

const meta: ComponentMeta<typeof Browser> = {
  title: 'Organisms/Browser',
  component: Browser,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  parameters: { layout: 'fullscreen' },
  excludeStories: [
    'BrowserStoryProps',
    'BrowserLoggedOutStoryProps',
    'BrowserLoggedInStoryProps',
    'BrowserFollowingStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ margin: '50px' }}>
        <Story />
      </div>
    ),
  ],
}

const BrowserStory: ComponentStory<typeof Browser> = args => <Browser {...args} />

// const subjectCardPropsList: SubjectCardProps[] = [
//   '#Education',
//   '#Forestry',
//   'Enviromental Science with a lot of Mathematics and Physics',
//   'Sailing Principles',
//   'Latin',
//   'Hebrew',
//   'NoShow',
// ].map((x) => ({
//   organization: { ...SubjectCardStoryProps }.organization,
//   title: x,
//   subjectHomeHref: href('Subject/home'),
// }))

export const BrowserLoggedOutStoryProps: BrowserProps = {
  mainColumnItems: [
    {
      menuItem: {
        Item: () => <span>Resources</span>,
        key: 'menu-resources',
      },
      Item: () => {
        const list = useMemo(
          () =>
            getResourcesCardStoryProps(15, {
              isAuthenticated: false,
            }),
          [],
        )
        return (
          <LandingResourceList
            searchResourcesHref={href('Page/Search')}
            resourceCardPropsList={list}
          />
        )
      },
      key: 'resource-list',
    },
    {
      menuItem: {
        Item: () => <span>Collections</span>,
        key: 'menu-collections',
      },
      Item: () => {
        const list = useMemo(
          () =>
            getCollectionsCardStoryProps(15, {
              access: { isAuthenticated: false },
            }),
          [],
        )
        return (
          <LandingCollectionList
            searchCollectionsHref={href('Page/Search')}
            collectionCardPropsList={list}
          />
        )
      },
      key: 'collection-list',
    },
    {
      menuItem: {
        Item: () => <span>People</span>,
        key: 'menu-people',
      },
      Item: () => {
        const list = useMemo(
          () =>
            getSmallProfilesCardStoryProps(15, {
              access: { isAuthenticated: false },
            }),
          [],
        )
        return (
          <SmallProfileCardList
            searchAuthorsHref={href('Page/Search')}
            smallProfileCardPropsList={list}
          />
        )
      },
      key: 'people-list',
    },
  ],
  sideColumnItems: [],
  //   title: 'Bookmarks',
  //   setSortBy: action(`set sort by`),
  //   setFilters: action(`set Filters`),
  //   loadMoreSubjects: action(`load more subjects`),
  //   loadMoreCollections: action(`load more collections`),
  //   loadMoreResources: action(`load more resources`),
  //   loadMorePeople: action(`load more people`),
  //   subjectCardPropsList: subjectCardPropsList,
  //   collectionCardPropsList: [
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //     CollectionCardLoggedOutStoryProps(
  //       randomIntFromInterval(0, 1) === 0 ? 0 : 1
  //     ),
  //   ],
  //   resourceCardPropsList: [
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //     ResourceCardLoggedOutStoryProps(),
  //   ],
  //   smallProfileCardPropsList: [
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardStoryProps(randomIntFromInterval(0, 3)),
  //   ],
}

export const BrowserLoggedInStoryProps: BrowserProps = {
  //   setSortBy: action(`set sort by`),
  //   setFilters: action(`set Filters`),
  //   subjectCardPropsList: subjectCardPropsList,
  //   collectionCardPropsList: [
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //     CollectionCardLoggedInStoryProps(randomIntFromInterval(0, 1) === 0 ? 0 : 1),
  //   ],
  //   resourceCardPropsList: [
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //     ResourceCardLoggedInStoryProps,
  //   ],
  //   smallProfileCardPropsList: [
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardLoggedInStoryProps(randomIntFromInterval(0, 3)),
  //   ],
}

export const BrowserFollowingStoryProps: BrowserProps = {
  ...BrowserLoggedInStoryProps,
  //   smallProfileCardPropsList: [
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //     SmallProfileCardFollowingStoryProps(randomIntFromInterval(0, 3)),
  //   ],
}

export const LoggedOut = BrowserStory.bind({})
LoggedOut.args = BrowserLoggedOutStoryProps

export const LoggedIn = BrowserStory.bind({})
LoggedIn.args = BrowserLoggedInStoryProps

export const Following = BrowserStory.bind({})
Following.args = BrowserFollowingStoryProps

export default meta
