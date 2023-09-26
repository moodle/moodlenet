import type { AddOnMap } from '@moodlenet/core/lib'
import { EdMetaContext } from '@moodlenet/ed-meta/webapp'
import { MainSearchBoxCtx, proxyWith, type SortType } from '@moodlenet/react-app/ui'
import {
  useUrlQueryString,
  type SearchEntityPageWrapper,
  type SearchEntitySectionAddon,
} from '@moodlenet/react-app/webapp'
import type { FC, PropsWithChildren } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'
import type { ResourceSearchResultRpc, SortTypeRpc } from '../../../../../common/types.mjs'
import { isSortTypeRpc } from '../../../../../common/types.mjs'
import { shell } from '../../../../shell.mjs'

import { useResourceCardProps } from '../../ResourceCard/ResourceCardHook.js'
import { BrowserResourceFilters } from './BrowserResourceFilters.js'
import type { BrowserResourceListDataProps } from './BrowserResourceList.js'
import BrowserResourceList from './BrowserResourceList.js'

type ResourceListItem = { _key: string }
type SearchResourceContextT = {
  sortType: {
    selected: SortType
    select: (sortType: SortType) => void
  }
  subjectsFilter: {
    selected: string[]
    select: (subjects: string[]) => void
  }
  languagesFilter: {
    selected: string[]
    select: (languages: string[]) => void
  }
  levelsFilter: {
    selected: string[]
    select: (levels: string[]) => void
  }
  typesFilter: {
    selected: string[]
    select: (types: string[]) => void
  }
  licensesFilter: {
    selected: string[]
    select: (licenses: string[]) => void
  }
  resourceList: ResourceListItem[]
  loadMore(): void
}

function reducer(prev: ResourceListItem[], [action, list]: ['set' | 'more', ResourceListItem[]]) {
  const keepList = action === 'set' ? [] : prev
  return [...keepList, ...list]
}
//const _________________DEFAULTS_ON_EMPTY_________________ = { languages: 'hun' }
export const SearchResourceContext = createContext<SearchResourceContextT>(null as any)
export const ProvideSearchResourceContext: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { publishedMetaOptions } = useContext(EdMetaContext)
  const [resourceList, resourceListAction] = useReducer(reducer, [])
  const [resourceSearchResult, setResourceSearchResult] = useState<ResourceSearchResultRpc>()
  const { q } = useContext(MainSearchBoxCtx)
  const [queryUrlParams, setQueryUrlParams] = useUrlQueryString(
    ['sortType', 'subjects', 'languages', 'levels', 'types', 'licenses'],
    shell.pkgId.name,
    // {
    // prefix: shell.pkgId.name,
    // initialDefaults: _________________DEFAULTS_ON_EMPTY_________________,
    // },
  )
  const sortType = useMemo<SearchResourceContextT['sortType']>(() => {
    const type: SortTypeRpc = isSortTypeRpc(queryUrlParams.sortType)
      ? queryUrlParams.sortType
      : 'Popular'

    const setType: SearchResourceContextT['sortType']['select'] = sortType => {
      setQueryUrlParams({ sortType })
    }
    return { select: setType, selected: type }
  }, [queryUrlParams.sortType, setQueryUrlParams])

  const subjectsFilter = useMemo<SearchResourceContextT['subjectsFilter']>(() => {
    const subjectCodes = publishedMetaOptions.subjects.map(({ value }) => value)
    const selected = (queryUrlParams.subjects ? queryUrlParams.subjects.split('|') : []).filter(
      qsubject => subjectCodes.includes(qsubject),
    )
    const select: SearchResourceContextT['subjectsFilter']['select'] = subjectFilter => {
      setQueryUrlParams({ subjects: subjectFilter.join('|') })
    }
    return { select, selected }
  }, [publishedMetaOptions.subjects, queryUrlParams.subjects, setQueryUrlParams])

  const languagesFilter = useMemo<SearchResourceContextT['languagesFilter']>(() => {
    const languageCodes = publishedMetaOptions.languages.map(({ value }) => value)
    const selected = (queryUrlParams.languages ? queryUrlParams.languages.split('|') : []).filter(
      qlanguage => languageCodes.includes(qlanguage),
    )
    const select: SearchResourceContextT['languagesFilter']['select'] = languageFilter => {
      setQueryUrlParams({ languages: languageFilter.join('|') })
    }
    return { select, selected }
  }, [publishedMetaOptions.languages, queryUrlParams.languages, setQueryUrlParams])

  const levelsFilter = useMemo<SearchResourceContextT['subjectsFilter']>(() => {
    const levelCodes = publishedMetaOptions.levels.map(({ value }) => value)
    const selected = (queryUrlParams.levels ? queryUrlParams.levels.split('|') : []).filter(
      qlevel => levelCodes.includes(qlevel),
    )
    const select: SearchResourceContextT['levelsFilter']['select'] = levelFilter => {
      setQueryUrlParams({ levels: levelFilter.join('|') })
    }
    return { select, selected }
  }, [publishedMetaOptions.levels, queryUrlParams.levels, setQueryUrlParams])

  const typesFilter = useMemo<SearchResourceContextT['typesFilter']>(() => {
    const typeCodes = publishedMetaOptions.types.map(({ value }) => value)
    const selected = (queryUrlParams.types ? queryUrlParams.types.split('|') : []).filter(qtype =>
      typeCodes.includes(qtype),
    )
    const select: SearchResourceContextT['typesFilter']['select'] = typeFilter => {
      setQueryUrlParams({ types: typeFilter.join('|') })
    }
    return { select, selected }
  }, [publishedMetaOptions.types, queryUrlParams.types, setQueryUrlParams])

  const licensesFilter = useMemo<SearchResourceContextT['licensesFilter']>(() => {
    const licenseCodes = publishedMetaOptions.licenses.map(({ value }) => value)
    const selected = (queryUrlParams.licenses ? queryUrlParams.licenses.split('|') : []).filter(
      qlicense => licenseCodes.includes(qlicense),
    )
    const select: SearchResourceContextT['licensesFilter']['select'] = licenseFilter => {
      setQueryUrlParams({ licenses: licenseFilter.join('|') })
    }
    return { select, selected }
  }, [publishedMetaOptions.licenses, queryUrlParams.licenses, setQueryUrlParams])

  const load = useCallback(
    async (limit: number, cursor?: string) => {
      const res = await shell.rpc.me('webapp/search')(undefined, undefined, {
        limit,
        sortType: sortType.selected,
        filterSubjects: subjectsFilter.selected.join('|'),
        filterLanguages: languagesFilter.selected.join('|'),
        filterLevels: levelsFilter.selected.join('|'),
        filterTypes: typesFilter.selected.join('|'),
        filterLicenses: licensesFilter.selected.join('|'),
        text: q,
        after: cursor,
      })
      setResourceSearchResult(res)
      return res
    },
    [
      languagesFilter.selected,
      levelsFilter.selected,
      licensesFilter.selected,
      q,
      sortType.selected,
      subjectsFilter.selected,
      typesFilter.selected,
    ],
  )

  useEffect(() => {
    load(12).then(res => {
      resourceListAction(['set', res.list])
    })
  }, [load])

  const hasNoMore = !!resourceSearchResult && !resourceSearchResult.endCursor
  const loadMore = useCallback(async () => {
    if (hasNoMore) {
      return
    }
    const res = await load(36, resourceSearchResult?.endCursor)
    resourceListAction(['more', res.list])
  }, [hasNoMore, load, resourceSearchResult?.endCursor])

  const ctx = useMemo<SearchResourceContextT>(
    () => ({
      resourceList,
      loadMore,
      sortType,
      subjectsFilter,
      languagesFilter,
      levelsFilter,
      licensesFilter,
      typesFilter,
    }),
    [
      languagesFilter,
      levelsFilter,
      licensesFilter,
      loadMore,
      resourceList,
      sortType,
      subjectsFilter,
      typesFilter,
    ],
  )

  return <SearchResourceContext.Provider value={ctx}>{children}</SearchResourceContext.Provider>
}

export const SearchResourceSectionAddon: AddOnMap<SearchEntitySectionAddon> = {
  resources: {
    Item: browserMainColumnItemBase => {
      const { resourceList, loadMore } = useContext(SearchResourceContext)

      const BrowserResourceListDataProps: BrowserResourceListDataProps = {
        resourceCardPropsList: resourceList.map(({ _key }) => {
          return {
            key: _key,
            props: proxyWith(function useProxy() {
              return { props: useResourceCardProps(_key) }
            }),
          }
        }),
        loadMore,
      }

      return (
        <BrowserResourceList {...BrowserResourceListDataProps} {...browserMainColumnItemBase} />
      )
    },
    filters: [
      {
        key: 'sort-by',
        Item: () => {
          const {
            sortType: { select: setType, selected: type },
          } = useContext(SearchResourceContext)
          return <BrowserResourceFilters.SortByItem selected={type} setSelected={setType} />
        },
      },
      {
        key: 'subject-filter',
        Item: () => {
          const { publishedMetaOptions } = useContext(EdMetaContext)
          const {
            subjectsFilter: { select, selected },
          } = useContext(SearchResourceContext)
          return (
            <BrowserResourceFilters.SortBySubjectItem
              selected={selected}
              setSelected={select}
              options={publishedMetaOptions.subjects}
            />
          )
        },
      },
      {
        key: 'language-filter',
        Item: () => {
          const { publishedMetaOptions } = useContext(EdMetaContext)
          const {
            languagesFilter: { select, selected },
          } = useContext(SearchResourceContext)
          return (
            <BrowserResourceFilters.SortByLanguageItem
              selected={selected}
              setSelected={select}
              options={publishedMetaOptions.languages}
            />
          )
        },
      },
      {
        key: 'level-filter',
        Item: () => {
          const { publishedMetaOptions } = useContext(EdMetaContext)
          const {
            levelsFilter: { select, selected },
          } = useContext(SearchResourceContext)
          return (
            <BrowserResourceFilters.SortByLevelItem
              selected={selected}
              setSelected={select}
              options={publishedMetaOptions.levels}
            />
          )
        },
      },
      {
        key: 'type-filter',
        Item: () => {
          const { publishedMetaOptions } = useContext(EdMetaContext)
          const {
            typesFilter: { select, selected },
          } = useContext(SearchResourceContext)
          return (
            <BrowserResourceFilters.SortByTypeItem
              selected={selected}
              setSelected={select}
              options={publishedMetaOptions.types}
            />
          )
        },
      },
      {
        key: 'license-filter',
        Item: () => {
          const { publishedMetaOptions } = useContext(EdMetaContext)
          const {
            licensesFilter: { select, selected },
          } = useContext(SearchResourceContext)
          return (
            <BrowserResourceFilters.SortByLicenseItem
              selected={selected}
              setSelected={select}
              options={publishedMetaOptions.licenses}
            />
          )
        },
      },
    ],
    name: 'Resources',
  },
}

export const SearchResourceWrapperAddon: AddOnMap<SearchEntityPageWrapper> = {
  default: { Wrapper: ProvideSearchResourceContext },
}
