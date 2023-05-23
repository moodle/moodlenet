import type { PkgIdentifier } from '@moodlenet/core'
import type { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import { getCurrentInitPkg } from './plugin-initializer.mjs'
import { AdminSettingsPageRoute } from './ui/components/pages/AdminSettings/Hook/AdminSettingsPageRoute.js'
import { LandingContainer } from './ui/components/pages/Landing/LandingContainer.js'

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
      <Route path="/" index element={<LandingContainer />} />
      <Route path="settings" element={<AdminSettingsPageRoute />} />
      {appRoutesContextPlugins.map(({ pkgId, pkgRoutes: { routes } }) => {
        return (
          <Route path={`/`} key={pkgId.name}>
            {routes}
          </Route>
        )
      })}
    </Routes>
  )
}

export default AppRouter
