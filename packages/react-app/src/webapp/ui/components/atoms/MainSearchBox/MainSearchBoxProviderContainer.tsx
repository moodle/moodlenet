import type { FC, PropsWithChildren } from 'react'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { searchPagePath } from '../../../../../common/webapp-paths.mjs'
import { useUrlQueryString } from '../../../../web-lib/use-query-params.mjs'
import type { MainSearchBoxCtxValueDeps } from './MainSearchBox.js'
import { ProvideMainSearchBoxCtx } from './MainSearchBox.js'

export const MainSearchBoxCtxProviderContainer: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const nav = useNavigate()
  const loc = useLocation()
  const [queryUrlParams, setQueryUrlParams] = useUrlQueryString(['q'])
  const search = useCallback<MainSearchBoxCtxValueDeps['search']>(
    (text, defaultQuery) => {
      loc.pathname === searchPagePath()
        ? setQueryUrlParams({ q: text })
        : nav(searchPagePath({ q: { q: text, ...defaultQuery } }))
    },
    [loc, setQueryUrlParams, nav],
  )

  return (
    <ProvideMainSearchBoxCtx
      initSearchText={queryUrlParams.q ?? ''}
      search={search}
      initialDefaultQuery={{}}
    >
      {children}
    </ProvideMainSearchBoxCtx>
  )
}
