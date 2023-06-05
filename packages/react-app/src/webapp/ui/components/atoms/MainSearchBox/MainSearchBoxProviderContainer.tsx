import type { FC, PropsWithChildren } from 'react'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUrlQueryString } from '../../../../web-lib/use-query-params.mjs'
import { ProvideMainSearchBoxCtx } from './MainSearchBox.js'

export const MainSearchBoxCtxProviderContainer: FC<PropsWithChildren> = ({ children }) => {
  const nav = useNavigate()
  const loc = useLocation()
  const [queryUrlParams, setQueryUrlParams] = useUrlQueryString(['q'])
  const search = useCallback(
    (text: string) => {
      loc.pathname === '/search' ? setQueryUrlParams({ q: text }) : nav(`/search?q=${text}`)
    },
    [loc, setQueryUrlParams, nav],
  )

  return (
    <ProvideMainSearchBoxCtx initSearchText={queryUrlParams.q ?? ''} search={search}>
      {children}
    </ProvideMainSearchBoxCtx>
  )
}
