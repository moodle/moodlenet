import { SearchCollectionList } from '@moodlenet/collection/ui'
import { overrideDeep } from '@moodlenet/component-library/common'
import { SearchResourceList } from '@moodlenet/ed-resource/ui'
import type { BrowserProps, MainColumItem } from '@moodlenet/react-app/ui'
import { SortBy } from '@moodlenet/react-app/ui'
import { getProfileCardsStoryProps, SearchProfileList } from '@moodlenet/web-user/ui'
import { useMemo, useState } from 'react'
import type { PartialDeep } from 'type-fest'
import { getCollectionsCardStoryProps } from '../CollectionCard/story-props.js'
import { getResourcesCardStoryProps } from '../ResourceCard/story-props.js'

export const useBrowserResourceList = () => {
  const [currentResourceSortBy, setCurrentResourceSortBy] = useState('Relevant')
  return {
    name: 'Resources',
    Item: ({ showAll, setShowAll }) => {
      const list = useMemo(
        () =>
          getResourcesCardStoryProps(30, {
            access: {
              // isAuthenticated,
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
  }
}

export const useBrowserProfileList = () => {
  return {
    name: 'People',
    Item: ({ showAll, setShowAll }) => {
      const list = useMemo(
        () =>
          getProfileCardsStoryProps(30, {
            access: {},
            state: {},
          }),
        [],
      )
      return (
        <SearchProfileList profilesCardPropsList={list} showAll={showAll} setShowAll={setShowAll} />
      )
    },
    filters: [],
    key: 'profile-list',
  }
}

export const useBrowserCollectionList = () => {
  const [currentCollectionSortBy, setCurrentCollectionSortBy] = useState('Relevant')
  return {
    name: 'Collections',
    Item: ({ showAll, setShowAll }) => {
      const list = useMemo(
        () =>
          getCollectionsCardStoryProps(30, {
            access: { canPublish: false },
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
          <SortBy selected={currentCollectionSortBy} setSelection={setCurrentCollectionSortBy} />
        ),
        key: 'sort-by',
      },
    ],
    key: 'collection-list',
  }
}

export const useBrowserStoryProps = (
  overrides?: PartialDeep<BrowserProps & { isAuthenticated: boolean }>,
): BrowserProps => {
  const mainColumnItems = [
    useBrowserResourceList(),
    useBrowserCollectionList(),
    useBrowserProfileList(),
  ]
  const overrideMainColumnItems = overrides?.mainColumnItems
    ? overrides?.mainColumnItems.filter((item): item is MainColumItem => !!item)
    : undefined
  // const isAuthenticated = overrides?.isAuthenticated ?? true
  return overrideDeep<BrowserProps>(
    {
      mainColumnItems: overrideMainColumnItems ?? mainColumnItems,
    },
    overrides,
  )
}
