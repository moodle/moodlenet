import { BrowserCollectionFilters, BrowserCollectionList } from '@moodlenet/collection/ui'
import { overrideDeep } from '@moodlenet/component-library/common'
import { BrowserResourceFilters, BrowserResourceList } from '@moodlenet/ed-resource/ui'
import type { BrowserProps, MainColumItem } from '@moodlenet/react-app/ui'
import {
  BrowserProfileFilters,
  BrowserProfileList,
  getProfileCardsStoryProps,
} from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { useMemo, useState } from 'react'
import type { PartialDeep } from 'type-fest'
import { getCollectionCardsStoryProps } from '../CollectionCard/story-props.js'
import { getResourceCardsStoryProps } from '../ResourceCard/story-props.js'

export const useBrowserResourceList = () => {
  const [currentResourceSortBy, setCurrentResourceSortBy] = useState('Relevant')
  return {
    name: 'Resources',
    Item: ({ showAll, setShowAll }) => {
      const list = useMemo(
        () =>
          getResourceCardsStoryProps(30, {
            access: {
              // isAuthenticated,
            },
          }),
        [],
      )
      return (
        <BrowserResourceList
          resourceCardPropsList={list}
          showAll={showAll}
          setShowAll={setShowAll}
          loadMore={action(`load more resources`)}
        />
      )
    },
    filters: [
      BrowserResourceFilters.SortByItem(currentResourceSortBy, setCurrentResourceSortBy),
    ].map(e => ({
      Item: () => e,
      key: e.key,
    })),
    key: 'resource-list',
  }
}

export const useBrowserCollectionList = () => {
  const [currentCollectionSortBy, setCurrentCollectionSortBy] = useState('Relevant')
  return {
    name: 'Collections',
    Item: ({ showAll, setShowAll }) => {
      const list = useMemo(
        () =>
          getCollectionCardsStoryProps(30, {
            access: { canPublish: false },
          }),
        [],
      )
      return (
        <BrowserCollectionList
          collectionCardPropsList={list}
          showAll={showAll}
          setShowAll={setShowAll}
          loadMore={action(`load more collections`)}
        />
      )
    },
    filters: [
      BrowserCollectionFilters.SortByItem(currentCollectionSortBy, setCurrentCollectionSortBy),
    ].map(e => ({
      Item: () => e,
      key: e.key,
    })),
    key: 'collection-list',
  }
}

export const useBrowserProfileList = (showHeader?: boolean) => {
  const [currentProfileSortBy, setCurrentProfileSortBy] = useState('Relevant')

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
        <BrowserProfileList
          profilesCardPropsList={list}
          showAll={showAll}
          setShowAll={setShowAll}
          loadMore={action(`load more profiles`)}
          showHeader={showHeader ?? true}
        />
      )
    },
    filters: [BrowserProfileFilters.SortByItem(currentProfileSortBy, setCurrentProfileSortBy)].map(
      e => ({
        Item: () => e,
        key: e.key,
      }),
    ),
    key: 'profile-list',
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
