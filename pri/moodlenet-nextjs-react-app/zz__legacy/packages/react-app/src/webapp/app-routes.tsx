import type { PkgIdentifier } from '@moodlenet/core'
import type { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import { adminPagePath, searchPagePath } from '../common/webapp-paths.mjs'
import { Fallback } from './exports/ui.mjs'
import { useMainLayoutProps } from './exports/webapp.mjs'
import { getCurrentInitPkg } from './plugin-initializer.mjs'
import { AdminSettingsPageRoute } from './ui/components/pages/AdminSettings/Hook/AdminSettingsPageRoute'
import { LandingContainer } from './ui/components/pages/Landing/LandingContainer'
import { SearchPageRoute } from './ui/components/pages/Search/SearchPageRoute'

export type PkgRoutes = { routes: ReactElement }

const appRoutesContextPlugins: {
  pkgRoutes: PkgRoutes
  pkgId: PkgIdentifier
}[] = []
export function registerAppRoutes(pkgRoutes: PkgRoutes) {
  const pkgId = getCurrentInitPkg()
  appRoutesContextPlugins.push({ pkgRoutes, pkgId })
}

const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<LandingContainer />} />
      <Route path={searchPagePath()} element={<SearchPageRoute />} />
      <Route path={adminPagePath()} element={<AdminSettingsPageRoute />} />

      {appRoutesContextPlugins.map(({ pkgId, pkgRoutes: { routes } }) => {
        return (
          <Route path={`/`} key={pkgId.name}>
            {routes}
          </Route>
        )
      })}

      <Route path="*" element={<Fallback mainLayoutProps={useMainLayoutProps()} />} />
    </Routes>
  )
}

export default AppRouter
