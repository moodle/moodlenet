import type { PkgIdentifier } from '@moodlenet/core'
import type { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import { getCurrentInitPkg } from './plugin-initializer.js'
import { LandingContainer } from './ui/components/pages/Landing/LandingContainer.js'
import { SettingsPageRoute } from './ui/components/pages/Settings/Settings/Hook/SettingsPageRoute.js'

export type RouteRegItem = { routes: ReactElement }

const appRoutesContextPlugins: {
  routeRegItem: RouteRegItem
  pkgId: PkgIdentifier
}[] = []
export function registerAppRoutesContextPlugin(routeRegItem: RouteRegItem) {
  const pkgId = getCurrentInitPkg()
  appRoutesContextPlugins.push({ routeRegItem, pkgId })
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" index element={<LandingContainer />} />
      <Route path="settings" element={<SettingsPageRoute />} />
      {appRoutesContextPlugins.flatMap(({ pkgId, routeRegItem: { routes } }) => {
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
