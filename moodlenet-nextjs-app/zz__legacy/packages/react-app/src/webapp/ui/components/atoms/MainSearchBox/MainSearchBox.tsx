import type { SearchboxProps } from '@moodlenet/component-library'
import { Searchbox } from '@moodlenet/component-library'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { href } from '../../../../../common/lib.mjs'
import { searchPagePath } from '../../../../../common/webapp-paths.mjs'

export type MainSearchBoxProps = Partial<
  Pick<SearchboxProps, 'setIsSearchboxInViewport' | 'placeholder' | 'size' | 'marginTop'>
>

export const MainSearchBox: FC<MainSearchBoxProps> = props => {
  const ctx = useContext(MainSearchBoxCtx)
  return <Searchbox {...{ ...ctx, ...props }} />
}

export type MainSearchBoxCtxT = {
  qText: string
  setDefaultQuery: React.Dispatch<React.SetStateAction<Record<string, string | undefined>>>
  resetFilters(): void
} & Pick<SearchboxProps, 'search' | 'placeholder' | 'searchText' | 'setSearchText'>

export const MainSearchBoxCtx = createContext<MainSearchBoxCtxT>(null as any)

export const ProvideMainSearchBoxCtx: FC<PropsWithChildren<MainSearchBoxCtxValueDeps>> = ({
  children,
  initSearchText,
  search,
  initialDefaultQuery,
}) => {
  const ctxValue = useMainSearchBoxCtxValue({ search, initSearchText, initialDefaultQuery })
  return <MainSearchBoxCtx.Provider value={ctxValue}>{children}</MainSearchBoxCtx.Provider>
}

const defaultPlaceholder = 'Search for open education content'
export type MainSearchBoxCtxValueDeps = {
  search(text: string, defaultQuery: Record<string, string | undefined>): void
  initSearchText: string
  initialDefaultQuery: Record<string, string | undefined>
}
export function useMainSearchBoxCtxValue({
  search,
  initSearchText,
  initialDefaultQuery,
}: MainSearchBoxCtxValueDeps): MainSearchBoxCtxT {
  const [searchText, setSearchText] = useState(initSearchText)
  const [defaultQuery, setDefaultQuery] =
    useState<Record<string, string | undefined>>(initialDefaultQuery)
  const [qText, setQText] = useState(initSearchText)
  const defaultSearchHref = useMemo(() => {
    return href(searchPagePath({ q: defaultQuery }))
  }, [defaultQuery])
  const nav = useNavigate()
  const mainSearchBoxCtxT = useMemo<MainSearchBoxCtxT>(() => {
    const ctx: MainSearchBoxCtxT = {
      placeholder: defaultPlaceholder,
      search(text: string) {
        setQText(text)
        return search(text, defaultQuery)
      },
      resetFilters() {
        nav(defaultSearchHref.url)
      },
      searchText,
      setSearchText,
      qText,
      setDefaultQuery,
    }
    return ctx
  }, [qText, search, searchText, defaultQuery, setDefaultQuery, defaultSearchHref.url, nav])
  return mainSearchBoxCtxT
}
