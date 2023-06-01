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

export type MainSearchBoxCtxT = Pick<
  SearchboxProps,
  'search' | 'placeholder' | 'searchText' | 'setSearchText'
>

export const MainSearchBoxCtx = createContext<MainSearchBoxCtxT>(null as any)

export const ProvideMainSearchBoxCtx: FC<PropsWithChildren<MainSearchBoxCtxValueDeps>> = ({
  children,
  search,
}) => {
  const ctxValue = useMainSearchBoxCtxValue({ search })
  return <MainSearchBoxCtx.Provider value={ctxValue}>{children}</MainSearchBoxCtx.Provider>
}

export type MainSearchBoxCtxValueDeps = { search(text: string): void }
export function useMainSearchBoxCtxValue({ search }: MainSearchBoxCtxValueDeps): MainSearchBoxCtxT {
  const [searchText, setSearchText] = useState('')
  const [defaultPlaceholder /* , setDefaultPlaceholder */] = useState(
    'Search for open education content',
  )
  const mainSearchBoxCtxT = useMemo<MainSearchBoxCtxT>(() => {
    const ctx: MainSearchBoxCtxT = {
      placeholder: defaultPlaceholder,
      search,
      searchText,
      setSearchText,
    }
    return ctx
  }, [defaultPlaceholder, search, searchText])
  return mainSearchBoxCtxT
}
