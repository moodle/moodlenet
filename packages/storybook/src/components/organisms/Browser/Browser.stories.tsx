import { getCollectionsCardStoryProps, SearchCollectionList } from '@moodlenet/collection/ui'
import {
  Browser,
  BrowserProps,
  getFilterContentDefaultListElement,
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
  return {
    mainColumnItems: [
      {
        menuItem: () => <span>Resources</span>,
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
            name: 'Sort by',
            menuContent: [<div key="relevance">Relevance</div>, <div key="latest">Latest</div>].map(
              e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
            ),
            menuContentType: 'menu-content-default-list',
            key: 'sort-by',
          },
          {
            name: 'Subjects',
            menuContent: [
              'Generic programmes and qualifications',
              'Literacy and numeracy',
              'Arts and humanities',
              'Social sciences',
              'Business and administration',
              'Natural sciences',
              'Engineering and technology',
              'Agriculture, forestry and fisheries',
              'Health and welfare',
              'Personal skills and development',
            ]
              .map(e => <div key={e.toLocaleLowerCase()}>{e}</div>)
              .map(e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
              ),
            menuContentType: 'menu-content-default-list',
            key: 'subjects',
          },
          {
            name: 'Language',
            menuContent: [
              'English',
              'French',
              'Spanish',
              'Italian',
              'German',
              'Chinesse',
              'Japaesse',
              'Korean',
              'Portuguese',
            ]
              .map(e => <div key={e.toLocaleLowerCase()}>{e}</div>)
              .map(e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
              ),
            menuContentType: 'menu-content-default-list',
            key: 'language',
          },
          {
            name: 'License',
            menuContent: [
              'Attribution',
              'Attribution-ShareAlike',
              'Attribution-NoDerivs',
              'Attribution-NonCommercial',
              'Attribution-NonCommercial-ShareAlike',
              'Attribution-NonCommercial-NoDerivs',
              'Public Domain Dedication (CC0)',
              'Public Domain Mark',
            ]
              .map(e => <div key={e.toLocaleLowerCase()}>{e}</div>)
              .map(e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
              ),
            menuContentType: 'menu-content-default-list',
            key: 'license',
          },
        ],
        key: 'resource-list',
      },
      {
        menuItem: () => <span>Collections</span>,
        Item: ({ showAll, setShowAll }) => {
          const list = useMemo(
            () =>
              getCollectionsCardStoryProps(30, {
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
        filters: [
          {
            name: 'Sort by',
            menuContent: [<div key="relevance">Relevance</div>, <div key="latest">Latest</div>].map(
              e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
            ),
            menuContentType: 'menu-content-default-list',
            key: 'sort-by',
          },
          {
            name: 'Subjects',
            menuContent: [
              'Generic programmes and qualifications',
              'Literacy and numeracy',
              'Arts and humanities',
              'Social sciences',
              'Business and administration',
              'Natural sciences',
              'Engineering and technology',
              'Agriculture, forestry and fisheries',
              'Health and welfare',
              'Personal skills and development',
            ]
              .map(e => <div key={e.toLocaleLowerCase()}>{e}</div>)
              .map(e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
              ),
            menuContentType: 'menu-content-default-list',
            key: 'subjects',
          },
          {
            name: 'Language',
            menuContent: [
              'English',
              'French',
              'Spanish',
              'Italian',
              'German',
              'Chinesse',
              'Japaesse',
              'Korean',
              'Portuguese',
            ]
              .map(e => <div key={e.toLocaleLowerCase()}>{e}</div>)
              .map(e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
              ),
            menuContentType: 'menu-content-default-list',
            key: 'language',
          },
        ],
        key: 'collection-list',
      },
      {
        menuItem: () => <span>People</span>,
        Item: ({ showAll, setShowAll }) => {
          const list = useMemo(
            () =>
              getProfileCardsStoryProps(30, {
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
        filters: [
          // {
          //   name: 'Connections',
          //   menuContent: ['1st', '2nd', '3rd+']
          //     .map(e => <div key={e.toLocaleLowerCase()}>{e}</div>)
          //     .map(e =>
          //       getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
          //     ),
          //   menuContentType: 'menu-content-default-list',
          //   key: 'connections',
          // },
          {
            name: 'Subjects',
            menuContent: [
              'Generic programmes and qualifications',
              'Literacy and numeracy',
              'Arts and humanities',
              'Social sciences',
              'Business and administration',
              'Natural sciences',
              'Engineering and technology',
              'Agriculture, forestry and fisheries',
              'Health and welfare',
              'Personal skills and development',
            ]
              .map(e => <div key={e.toLocaleLowerCase()}>{e}</div>)
              .map(e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
              ),
            menuContentType: 'menu-content-default-list',
            key: 'subjects',
          },
          {
            name: 'Entities',
            menuContent: [
              'Massachussets Institute of Technology',
              'University of Cambridge',
              'Stanford University',
              'University of Oxford',
              'Harvard University',
              'California Institute of Technology',
              'Imperial College London',
              'University College London',
              'ETH Zurich',
              'Australian National University',
            ]
              .map(e => <div key={e.toLocaleLowerCase()}>{e}</div>)
              .map(e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
              ),
            menuContentType: 'menu-content-default-list',
            key: 'entities',
          },
          {
            name: 'Locations',
            menuContent: [
              'USA',
              'India',
              'Australia',
              'China',
              'Japan',
              'Germany',
              'France',
              'Italy',
              'Spain',
              'Portugal',
            ]
              .map(e => <div key={e.toLocaleLowerCase()}>{e}</div>)
              .map(e =>
                getFilterContentDefaultListElement({ Item: () => e, key: e.key?.valueOf() ?? '' }),
              ),
            menuContentType: 'menu-content-default-list',
            key: 'locations',
          },
        ],
        key: 'people-list',
      },
    ],
    sideColumnItems: [],
  }
}

export const BrowserLoggedInStoryProps: BrowserProps = {
  mainColumnItems: [
    // {
    //   menuItem: () => <span>Resources</span>,
    //   Item: ({ showAll, setShowAll }) => {
    //     const list = useMemo(
    //       () =>
    //         getResourcesCardStoryProps(30, {
    //           access: { isAuthenticated: true },
    //         }),
    //       [],
    //     )
    //     return (
    //       <SearchResourceList
    //         showAll={showAll}
    //         resourceCardPropsList={list}
    //         setShowAll={setShowAll}
    //       />
    //     )
    //   },
    //   key: 'resource-list',
    // },
    // {
    //   menuItem: () => <span>Collections</span>,
    //   Item: ({ showAll, setShowAll }) => {
    //     const list = useMemo(
    //       () =>
    //         getCollectionsCardStoryProps(30, {
    //           access: { isAuthenticated: true },
    //         }),
    //       [],
    //     )
    //     return (
    //       <SearchCollectionList
    //         collectionCardPropsList={list}
    //         showAll={showAll}
    //         setShowAll={setShowAll}
    //       />
    //     )
    //   },
    //   key: 'collection-list',
    // },
    // {
    //   menuItem: () => <span>People</span>,
    //   Item: ({ showAll, setShowAll }) => {
    //     const list = useMemo(
    //       () =>
    //         getProfileCardsStoryProps(30, {
    //           access: { isAuthenticated: true },
    //         }),
    //       [],
    //     )
    //     return (
    //       <SearchProfileList
    //         profilesCardPropsList={list}
    //         showAll={showAll}
    //         setShowAll={setShowAll}
    //       />
    //     )
    //   },
    //   key: 'people-list',
    // },
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
