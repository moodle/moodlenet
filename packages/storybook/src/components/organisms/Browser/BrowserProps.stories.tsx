import { BrowserCollectionFilters, BrowserCollectionList } from '@moodlenet/collection/ui'
import { overrideDeep } from '@moodlenet/component-library/common'
import { BrowserSubjectList } from '@moodlenet/ed-meta/ui'
import { BrowserResourceFilters, BrowserResourceList } from '@moodlenet/ed-resource/ui'
import type { BrowserProps, MainColumItem, SortType } from '@moodlenet/react-app/ui'
import { BrowserProfileFilters, BrowserProfileList } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { useMemo, useState } from 'react'
import type { PartialDeep } from 'type-fest'
import { getCollectionCardsStoryProps } from '../CollectionCard/CollectionCardProps.stories.js'
import { getProfileCardsStoryProps } from '../ProfileCard/ProfileCardProps.stories.js'
import { getResourceCardsStoryProps } from '../ResourceCard/ResourceCardProps.stories.js'
import { getSubjectCardsStoryProps } from '../SubjectCard/SubjectCardProps.stories.js'

export const useBrowserResourceList = () => {
  const [currentResourceSortBy, setCurrentResourceSortBy] = useState<SortType>('Relevant')
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
      BrowserResourceFilters.SortByItem({
        selected: currentResourceSortBy,
        setSelected: setCurrentResourceSortBy,
      }),
    ].map(e => ({
      Item: () => e,
      key: e.key,
    })),
    key: 'resource-list',
  }
}

export const useBrowserCollectionList = () => {
  const [currentCollectionSortBy, setCurrentCollectionSortBy] = useState<SortType>('Relevant')
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
      BrowserCollectionFilters.SortByItem({
        selected: currentCollectionSortBy,
        setSelected: setCurrentCollectionSortBy,
      }),
    ].map(e => ({
      Item: () => e,
      key: e.key,
    })),
    key: 'collection-list',
  }
}

export const useBrowserProfileList = (showHeader?: boolean) => {
  const [currentProfileSortBy, setCurrentProfileSortBy] = useState<SortType>('Relevant')

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
    filters: [
      BrowserProfileFilters.SortByItem({
        selected: currentProfileSortBy,
        setSelected: setCurrentProfileSortBy,
      }),
    ].map(e => ({
      Item: () => e,
      key: e.key,
    })),
    key: 'profile-list',
  }
}

export const useBrowserSubjectList = (showHeader?: boolean) => {
  return {
    name: 'Subject',
    Item: ({ showAll, setShowAll }) => {
      const list = useMemo(() => getSubjectCardsStoryProps(30, {}), [])
      return (
        <BrowserSubjectList
          subjectCardPropsList={list}
          showAll={showAll}
          setShowAll={setShowAll}
          loadMore={action(`load more subjects`)}
          showHeader={showHeader ?? true}
          key="subject-list"
        />
      )
    },
    filters: [],
    key: 'subject-list',
  }
}

export const useBrowserStoryProps = (
  overrides?: PartialDeep<BrowserProps & { isAuthenticated: boolean }>,
): BrowserProps => {
  const mainColumnItems = [
    useBrowserResourceList(),
    useBrowserCollectionList(),
    useBrowserProfileList(),
    useBrowserSubjectList(),
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
