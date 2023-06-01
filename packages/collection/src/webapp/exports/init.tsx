import type {
  MainAppPluginHookResult,
  PkgAddOns,
  SearchEntitySectionAddon,
} from '@moodlenet/react-app/webapp'
import {
  registerAppRoutes,
  registerMainAppPluginHook,
  SearchPagePlugin,
} from '@moodlenet/react-app/webapp'
import { useMemo, useState } from 'react'
import '../shell.mjs'

import type { SortType } from '@moodlenet/react-app/ui'
import MainWrapper from '../MainWrapper.js'
import { pkgRoutes } from '../routes.js'
import {
  BrowserCollectionFilters,
  BrowserCollectionList,
  type BrowserCollectionListDataProps,
} from './ui.mjs'

registerAppRoutes(pkgRoutes)
registerMainAppPluginHook(function useMainAppContext() {
  const mainAppPlugin = useMemo<MainAppPluginHookResult>(
    () => ({
      MainWrapper,
    }),
    [],
  )
  return mainAppPlugin
})

const searchCollectionAddons: PkgAddOns<SearchEntitySectionAddon> = {
  collections: {
    Item: browserMainColumnItemBase => {
      const BrowserCollectionListDataProps: BrowserCollectionListDataProps = {
        collectionCardPropsList: [],
        loadMore: console.log.bind(null, 'load more collections'),
      }
      return (
        <BrowserCollectionList {...BrowserCollectionListDataProps} {...browserMainColumnItemBase} />
      )
    },
    filters: [
      {
        key: 'sort-by',
        Item: () => {
          const [selected, setSelection] = useState<SortType>('Popular')
          return (
            <BrowserCollectionFilters.SortByItem selected={selected} setSelection={setSelection} />
          )
        },
      },
    ],
    name: 'Collections',
  },
  Collections2: {
    Item: browserMainColumnItemBase => {
      const BrowserCollectionListDataProps: BrowserCollectionListDataProps = {
        collectionCardPropsList: [],
        loadMore: console.log.bind(null, 'load more collections 2'),
      }
      return (
        <BrowserCollectionList {...BrowserCollectionListDataProps} {...browserMainColumnItemBase} />
      )
    },
    filters: [
      {
        key: 'sort-by',
        Item: () => {
          const [selected, setSelection] = useState<SortType>('Popular')
          return (
            <BrowserCollectionFilters.SortByItem selected={selected} setSelection={setSelection} />
          )
        },
      },
    ],
    name: 'Collections 2',
  },
}

SearchPagePlugin.register(({ useSearchEntitySections }) => {
  useSearchEntitySections(searchCollectionAddons)
})
