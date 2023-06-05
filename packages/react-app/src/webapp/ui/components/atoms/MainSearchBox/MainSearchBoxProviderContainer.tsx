import type { FC, PropsWithChildren } from 'react'
import { useCallback } from 'react'
import { useUrlQueryString } from '../../../../web-lib/use-query-params.mjs'
import { ProvideMainSearchBoxCtx } from './MainSearchBox.js'

export const MainSearchBoxCtxProviderContainer: FC<PropsWithChildren> = ({ children }) => {
  const [queryUrlParams, setQueryUrlParams] = useUrlQueryString(['q'])
  const search = useCallback(
    (text: string) => {
      setQueryUrlParams({ q: text })
    },
    [setQueryUrlParams],
  )

  return (
    <ProvideMainSearchBoxCtx initSearchText={queryUrlParams.q ?? ''} search={search}>
      {children}
    </ProvideMainSearchBoxCtx>
  )
}
