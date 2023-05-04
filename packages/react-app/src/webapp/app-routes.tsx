import type { ReactElement } from 'react'
import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainContext } from './context/MainContext.mjs'
import { LandingContainer } from './ui/components/pages/Landing/LandingContainer.js'
import { SettingsPageRoute } from './ui/components/pages/Settings/Settings/Hook/SettingsPageRoute.js'

export type RouteRegItem = { routes: ReactElement }

const AppRouter = () => {
  const {
    reg: { routes },
  } = useContext(MainContext)
  return (
    <Routes>
      <Route path="/" index element={<LandingContainer />} />
      <Route path="settings" element={<SettingsPageRoute />} />
      {routes.registry.entries.flatMap(entry => {
        const {
          pkgId,
          item: { routes },
        } = entry
        return (
          <Route path={`/`} key={`pkg-routes:${pkgId.name}`}>
            {routes}
          </Route>
        )
      })}
    </Routes>
  )
}

export default AppRouter
