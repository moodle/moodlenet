import type { SearchboxProps } from '@moodlenet/component-library'
import { Searchbox } from '@moodlenet/component-library'
import type { FC, PropsWithChildren } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

export type MainSearchBoxProps = Partial<
  Pick<SearchboxProps, 'setIsSearchboxInViewport' | 'placeholder' | 'size' | 'marginTop'>
>

export const MainSearchBox: FC<MainSearchBoxProps> = props => {
  const ctx = useContext(MainSearchBoxCtx)
  return <Searchbox {...{ ...ctx, ...props }} />
}

export type MainSearchBoxCtxT = { q: string } & Pick<
  SearchboxProps,
  'search' | 'placeholder' | 'searchText' | 'setSearchText'
>

export const MainSearchBoxCtx = createContext<MainSearchBoxCtxT>(null as any)

export const ProvideMainSearchBoxCtx: FC<PropsWithChildren<MainSearchBoxCtxValueDeps>> = ({
  children,
  initSearchText,
  search,
}) => {
  const ctxValue = useMainSearchBoxCtxValue({ search, initSearchText })
  return <MainSearchBoxCtx.Provider value={ctxValue}>{children}</MainSearchBoxCtx.Provider>
}

export type MainSearchBoxCtxValueDeps = { search(text: string): void; initSearchText: string }
export function useMainSearchBoxCtxValue({
  search,
  initSearchText,
}: MainSearchBoxCtxValueDeps): MainSearchBoxCtxT {
  const [searchText, setSearchText] = useState(initSearchText)
  const [q, setQ] = useState(initSearchText)
  const [defaultPlaceholder /* , setDefaultPlaceholder */] = useState(
    'Search for open education content',
  )

  const mainSearchBoxCtxT = useMemo<MainSearchBoxCtxT>(() => {
    const ctx: MainSearchBoxCtxT = {
      placeholder: defaultPlaceholder,
      search(q: string) {
        setQ(q)
        return search(q)
      },
      searchText,
      setSearchText,
      q,
    }
    return ctx
  }, [q, defaultPlaceholder, search, searchText])
  return mainSearchBoxCtxT
}
