import { SearchCollectionList } from '@moodlenet/collection/ui'
import { overrideDeep } from '@moodlenet/component-library/common'
import { SearchResourceList } from '@moodlenet/ed-resource/ui'
import { BrowserProps, SortBy } from '@moodlenet/react-app/ui'
import { getProfileCardsStoryProps, SearchProfileList } from '@moodlenet/web-user/ui'
import { useMemo, useState } from 'react'
import { PartialDeep } from 'type-fest'
import { getCollectionsCardStoryProps } from '../CollectionCard/story-props.js'
import { getResourcesCardStoryProps } from '../ResourceCard/story-props.js'

export const useBrowserStoryProps = (
  overrides?: PartialDeep<BrowserProps & { isAuthenticated: boolean }>,
): BrowserProps => {
  const [currentResourceSortBy, setCurrentResourceSortBy] = useState('Relevant')
  const [currentCollectionSortBy, setCurrentCollectionSortBy] = useState('Relevant')
  const isAuthenticated = overrides?.isAuthenticated ?? true
  return overrideDeep<BrowserProps>(
    {
      mainColumnItems: [
        {
          name: 'Resources',
          Item: ({ showAll, setShowAll }) => {
            const list = useMemo(
              () =>
                getResourcesCardStoryProps(30, {
                  access: {
                    isAuthenticated,
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
                  access: { isAuthenticated, canPublish: false, canFollow: false },
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
                  access: { isAuthenticated },
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
    },
    overrides,
  )
}
