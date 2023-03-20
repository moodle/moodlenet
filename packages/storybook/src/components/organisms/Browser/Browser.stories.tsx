import { getCollectionsCardStoryProps, SearchCollectionList } from '@moodlenet/collection/ui'
import {
  Browser,
  BrowserProps,
  getProfileCardsStoryProps,
  href,
  SearchProfileList,
} from '@moodlenet/react-app/ui'
import { getResourcesCardStoryProps, SearchResourceList } from '@moodlenet/resource/ui'
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
        return <SearchResourceList resourceCardPropsList={list} />
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
        return <SearchCollectionList collectionCardPropsList={list} />
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
            getProfileCardsStoryProps(15, {
              access: { isAuthenticated: false },
            }),
          [],
        )
        return <SearchProfileList profilesCardPropsList={list} />
      },
      key: 'people-list',
    },
  ],
  sideColumnItems: [],
}

export const BrowserLoggedInStoryProps: BrowserProps = {
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
              isAuthenticated: true,
            }),
          [],
        )
        return (
          <SearchResourceList
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
              access: { isAuthenticated: true },
            }),
          [],
        )
        return (
          <SearchCollectionList
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
            getProfileCardsStoryProps(15, {
              access: { isAuthenticated: true },
            }),
          [],
        )
        return <SearchProfileList profilesCardPropsList={list} />
      },
      key: 'people-list',
    },
  ],
  sideColumnItems: [],
}

export const BrowserFollowingStoryProps: BrowserProps = {
  ...BrowserLoggedInStoryProps,
}

export const LoggedOut = BrowserStory.bind({})
LoggedOut.args = BrowserLoggedOutStoryProps

export const LoggedIn = BrowserStory.bind({})
LoggedIn.args = BrowserLoggedInStoryProps

export const Following = BrowserStory.bind({})
Following.args = BrowserFollowingStoryProps

export default meta
