import type { AddOnMap } from '@moodlenet/core/lib'
import { EdMetaContext } from '@moodlenet/ed-meta/webapp'
import { MainSearchBoxCtx, proxyWith, type SortType } from '@moodlenet/react-app/ui'
import {
  silentCatchAbort,
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
  useRef,
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
export const SearchResourceContext = createContext<SearchResourceContextT>(null as any)
export function useResourceSearchQuery() {
  return [
    ...useUrlQueryString(
      ['sortType', 'subjects', 'languages', 'levels', 'types', 'licenses'],
      shell.pkgId.name,
    ),
    useRef({
      ls2str,
      str2ls,
    }).current,
  ] as const
  function ls2str(ls: string[]) {
    return ls.join('|')
  }
  function str2ls(str: string) {
    return str.split('|')
  }
}
export const ProvideSearchResourceContext: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { publishedMetaOptions } = useContext(EdMetaContext)
  const [resourceList, resourceListAction] = useReducer(reducer, [])
  const [resourceSearchResult, setResourceSearchResult] = useState<ResourceSearchResultRpc>()
  const { qText: q } = useContext(MainSearchBoxCtx)
  const [queryUrlParams, setQueryUrlParams, , { ls2str, str2ls }] = useResourceSearchQuery()
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
    const selected = (queryUrlParams.subjects ? str2ls(queryUrlParams.subjects) : []).filter(
      qsubject => subjectCodes.includes(qsubject),
    )
    const select: SearchResourceContextT['subjectsFilter']['select'] = subjectFilter => {
      setQueryUrlParams({ subjects: ls2str(subjectFilter) })
    }
    return { select, selected }
  }, [publishedMetaOptions.subjects, ls2str, str2ls, queryUrlParams.subjects, setQueryUrlParams])

  const languagesFilter = useMemo<SearchResourceContextT['languagesFilter']>(() => {
    const languageCodes = publishedMetaOptions.languages.map(({ value }) => value)
    const selected = (queryUrlParams.languages ? str2ls(queryUrlParams.languages) : []).filter(
      qlanguage => languageCodes.includes(qlanguage),
    )
    const select: SearchResourceContextT['languagesFilter']['select'] = languageFilter => {
      setQueryUrlParams({ languages: ls2str(languageFilter) })
    }
    return { select, selected }
  }, [publishedMetaOptions.languages, ls2str, str2ls, queryUrlParams.languages, setQueryUrlParams])

  const levelsFilter = useMemo<SearchResourceContextT['subjectsFilter']>(() => {
    const levelCodes = publishedMetaOptions.levels.map(({ value }) => value)
    const selected = (queryUrlParams.levels ? str2ls(queryUrlParams.levels) : []).filter(qlevel =>
      levelCodes.includes(qlevel),
    )
    const select: SearchResourceContextT['levelsFilter']['select'] = levelFilter => {
      setQueryUrlParams({ levels: ls2str(levelFilter) })
    }
    return { select, selected }
  }, [publishedMetaOptions.levels, ls2str, str2ls, queryUrlParams.levels, setQueryUrlParams])

  const typesFilter = useMemo<SearchResourceContextT['typesFilter']>(() => {
    const typeCodes = publishedMetaOptions.types.map(({ value }) => value)
    const selected = (queryUrlParams.types ? str2ls(queryUrlParams.types) : []).filter(qtype =>
      typeCodes.includes(qtype),
    )
    const select: SearchResourceContextT['typesFilter']['select'] = typeFilter => {
      setQueryUrlParams({ types: ls2str(typeFilter) })
    }
    return { select, selected }
  }, [publishedMetaOptions.types, ls2str, str2ls, queryUrlParams.types, setQueryUrlParams])

  const licensesFilter = useMemo<SearchResourceContextT['licensesFilter']>(() => {
    const licenseCodes = publishedMetaOptions.licenses.map(({ value }) => value)
    const selected = (queryUrlParams.licenses ? str2ls(queryUrlParams.licenses) : []).filter(
      qlicense => licenseCodes.includes(qlicense),
    )
    const select: SearchResourceContextT['licensesFilter']['select'] = licenseFilter => {
      setQueryUrlParams({ licenses: ls2str(licenseFilter) })
    }
    return { select, selected }
  }, [publishedMetaOptions.licenses, ls2str, str2ls, queryUrlParams.licenses, setQueryUrlParams])

  const load = useCallback(
    (limit: number, cursor?: string) => {
      return shell.rpc
        .me('webapp/search', { rpcId: '/search' })(undefined, undefined, {
          limit,
          sortType: sortType.selected,
          filterSubjects: ls2str(subjectsFilter.selected),
          filterLanguages: ls2str(languagesFilter.selected),
          filterLevels: ls2str(levelsFilter.selected),
          filterTypes: ls2str(typesFilter.selected),
          filterLicenses: ls2str(licensesFilter.selected),
          text: q,
          after: cursor,
        })
        .then(res => {
          setResourceSearchResult(res)
          return res
        })
        .catch(silentCatchAbort)
    },
    [
      languagesFilter.selected,
      levelsFilter.selected,
      licensesFilter.selected,
      ls2str,
      q,
      sortType.selected,
      subjectsFilter.selected,
      typesFilter.selected,
    ],
  )

  useEffect(() => {
    load(12).then(res => {
      res && resourceListAction(['set', res.list])
    })
  }, [load])

  const hasNoMore = !!resourceSearchResult && !resourceSearchResult.endCursor
  const loadMore = useCallback(async () => {
    if (hasNoMore) {
      return
    }
    const res = await load(36, resourceSearchResult?.endCursor)
    res && resourceListAction(['more', res.list])
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
    position: 0,
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
