import { BrowserCollectionFilters, BrowserCollectionList } from '@moodlenet/collection/ui'
import { overrideDeep } from '@moodlenet/component-library/common'
import { FieldsDataStories } from '@moodlenet/ed-meta/stories'
import { BrowserSubjectList } from '@moodlenet/ed-meta/ui'
import { BrowserResourceFilters, BrowserResourceList } from '@moodlenet/ed-resource/ui'
import type { BrowserProps, MainColumItem, SortType } from '@moodlenet/react-app/ui'
import { BrowserProfileFilters, BrowserProfileList } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { useMemo, useState } from 'react'
import type { PartialDeep } from 'type-fest'
import { getCollectionCardsStoryProps } from '../CollectionCard/CollectionCardProps.stories.props.js'
import { getProfileCardsStoryProps } from '../ProfileCard/ProfileCardProps.stories.props.js'
import { getResourceCardsStoryProps } from '../ResourceCard/ResourceCardProps.stories.props.js'
import { getSubjectCardsStoryProps } from '../SubjectCard/SubjectCardProps.stories.props.js'

export const useBrowserResourceList = (): MainColumItem => {
  const [currentResourceSortBy, setCurrentResourceSortBy] = useState<SortType>('Relevant')
  const [currentResourceSortByLanguage, setCurrentResourceSortByLanguage] = useState<string[]>([])
  const [currentResourceSortByLevel, setCurrentResourceSortByLevel] = useState<string[]>([])
  const [currentResourceSortByType, setCurrentResourceSortByType] = useState<string[]>([])
  const [currentResourceSortByLicense, setCurrentResourceSortByLicense] = useState<string[]>([])

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
      BrowserResourceFilters.SortByLanguageItem({
        selected: currentResourceSortByLanguage,
        setSelected: setCurrentResourceSortByLanguage,
        options: FieldsDataStories.LanguagesTextOptionProps,
      }),
      BrowserResourceFilters.SortByLevelItem({
        selected: currentResourceSortByLevel,
        setSelected: setCurrentResourceSortByLevel,
        options: FieldsDataStories.LevelTextOptionProps,
      }),
      BrowserResourceFilters.SortByTypeItem({
        selected: currentResourceSortByType,
        setSelected: setCurrentResourceSortByType,
        options: FieldsDataStories.TypeTextOptionProps,
      }),
      BrowserResourceFilters.SortByLicenseItem({
        selected: currentResourceSortByLicense,
        setSelected: setCurrentResourceSortByLicense,
        options: FieldsDataStories.LicenseIconTextOptionProps,
      }),
    ].map((e, i) => ({
      Item: () => e,
      key: e.key ? `${e.key}` : 'resource filter ' + i,
    })),
    key: 'resource-list',
  }
}

export const useBrowserCollectionList = (): MainColumItem => {
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
    ].map((e, i) => ({
      Item: () => e,
      key: e.key ? `${e.key}` : 'resource filter ' + i,
    })),
    key: 'collection-list',
  }
}

export const useBrowserProfileList = (showHeader?: boolean): MainColumItem => {
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
    ].map((e, i) => ({
      Item: () => e,
      key: e.key ? `${e.key}` : 'resource filter ' + i,
    })),
    key: 'profile-list',
  }
}

export const useBrowserSubjectList = (showHeader?: boolean): MainColumItem => {
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
  const mainColumnItems: MainColumItem[] = [
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
