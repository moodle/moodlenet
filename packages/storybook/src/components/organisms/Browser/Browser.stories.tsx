import { getCollectionsCardStoryProps, SearchCollectionList } from '@moodlenet/collection/ui'
import {
  Browser,
  BrowserProps,
  getProfileCardsStoryProps,
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
}

type BrowserStory = ComponentStory<typeof Browser>
// const BrowserStory: ComponentStory<typeof Browser> = args => <Browser {...args} />

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

export const useBrowserLoggedOutStoryProps = (): BrowserProps => {
  return {
    mainColumnItems: [
      {
        menuItem: () => <span>Resources</span>,
        Item: ({ showAll, setShowAll }) => {
          const list = useMemo(
            () =>
              getResourcesCardStoryProps(15, {
                access: {
                  isAuthenticated: false,
                },
              }),
            [],
          )
          return (
            <SearchResourceList
              resourceCardPropsList={list}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          )
        },
        key: 'resource-list',
      },
      {
        menuItem: () => <span>Collections</span>,
        Item: ({ showAll, setShowAll }) => {
          const list = useMemo(
            () =>
              getCollectionsCardStoryProps(15, {
                access: { isAuthenticated: false },
              }),
            [],
          )
          return (
            <SearchCollectionList
              collectionCardPropsList={list}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          )
        },
        key: 'collection-list',
      },
      {
        menuItem: () => <span>People</span>,
        Item: ({ showAll, setShowAll }) => {
          const list = useMemo(
            () =>
              getProfileCardsStoryProps(15, {
                access: { isAuthenticated: false },
              }),
            [],
          )
          return (
            <SearchProfileList
              profilesCardPropsList={list}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          )
        },
        key: 'people-list',
      },
    ],
    sideColumnItems: [],
  }
}

export const BrowserLoggedInStoryProps: BrowserProps = {
  mainColumnItems: [
    {
      menuItem: () => <span>Resources</span>,
      Item: ({ showAll, setShowAll }) => {
        const list = useMemo(
          () =>
            getResourcesCardStoryProps(15, {
              access: { isAuthenticated: true },
            }),
          [],
        )
        return (
          <SearchResourceList
            showAll={showAll}
            resourceCardPropsList={list}
            setShowAll={setShowAll}
          />
        )
      },
      key: 'resource-list',
    },
    {
      menuItem: () => <span>Collections</span>,
      Item: ({ showAll, setShowAll }) => {
        const list = useMemo(
          () =>
            getCollectionsCardStoryProps(15, {
              access: { isAuthenticated: true },
            }),
          [],
        )
        return (
          <SearchCollectionList
            collectionCardPropsList={list}
            showAll={showAll}
            setShowAll={setShowAll}
          />
        )
      },
      key: 'collection-list',
    },
    {
      menuItem: () => <span>People</span>,
      Item: ({ showAll, setShowAll }) => {
        const list = useMemo(
          () =>
            getProfileCardsStoryProps(15, {
              access: { isAuthenticated: true },
            }),
          [],
        )
        return (
          <SearchProfileList
            profilesCardPropsList={list}
            showAll={showAll}
            setShowAll={setShowAll}
          />
        )
      },
      key: 'people-list',
    },
  ],
  sideColumnItems: [],
}

export const BrowserFollowingStoryProps: BrowserProps = {
  ...BrowserLoggedInStoryProps,
}

export const LoggedOut: BrowserStory = () => {
  const props = useBrowserLoggedOutStoryProps()
  return <Browser {...props} />
}

// export const LoggedOut = BrowserStory.bind({})
// LoggedOut.args = useBrowserLoggedOutStoryProps()

// export const LoggedIn = BrowserStory.bind({})
// LoggedIn.args = BrowserLoggedInStoryProps

// export const Following = BrowserStory.bind({})
// Following.args = BrowserFollowingStoryProps

export default meta
