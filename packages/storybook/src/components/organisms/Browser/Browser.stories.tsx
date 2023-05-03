import { SearchCollectionList } from '@moodlenet/collection/ui'
import { SearchResourceList } from '@moodlenet/ed-resource/ui'
import { Browser, BrowserProps, SortBy } from '@moodlenet/react-app/ui'
import { getProfileCardsStoryProps, SearchProfileList } from '@moodlenet/web-user/ui'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useMemo, useState } from 'react'
import { getCollectionsCardStoryProps } from '../CollectionCard/story-props.js'
import { getResourcesCardStoryProps } from '../ResourceCard/story-props.js'

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

// make array of 20 license types
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
  const [currentResourceSortBy, setCurrentResourceSortBy] = useState('Relevant')
  const [currentCollectionSortBy, setCurrentCollectionSortBy] = useState('Relevant')
  return {
    mainColumnItems: [
      {
        name: 'Resources',
        Item: ({ showAll, setShowAll }) => {
          const list = useMemo(
            () =>
              getResourcesCardStoryProps(30, {
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
        filters: [
          {
            Item: () => (
              <SortBy selected={currentResourceSortBy} setSelection={setCurrentResourceSortBy} />
            ),
            key: 'sort-by',
          },
        ],
        key: 'resource-list',
      },
      {
        name: 'Collections',
        Item: ({ showAll, setShowAll }) => {
          const list = useMemo(
            () =>
              getCollectionsCardStoryProps(30, {
                access: { isAuthenticated: false, canPublish: false, canFollow: false },
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
        filters: [
          {
            Item: () => (
              <SortBy
                selected={currentCollectionSortBy}
                setSelection={setCurrentCollectionSortBy}
              />
            ),
            key: 'sort-by',
          },
        ],
        key: 'collection-list',
      },
      {
        name: 'People',
        Item: ({ showAll, setShowAll }) => {
          const list = useMemo(
            () =>
              getProfileCardsStoryProps(30, {
                access: { isAuthenticated: false },
                state: {},
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
        filters: [],
        key: 'profile-list',
      },
    ],
  }
}

export const BrowserLoggedInStoryProps: BrowserProps = {
  mainColumnItems: [],
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
